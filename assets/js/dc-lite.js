/*
 * dc-lite.js: a tiny, dependency-free template runtime.
 *
 * The original pages were written in Claude's "design component" format, which needs Claude's
 * own runtime (support.js). This file re-implements the small part of that format the site uses,
 * so the pages run in any browser with no framework and no build step.
 *
 * Supported template features:
 *   {{ path }}                    text and attribute holes (e.g. class="{{item.cls}}")
 *   <sc-for list="{{x}}" as="i">  repeat the children for every item in a list
 *   <sc-if value="{{flag}}">      show the children only when the value is truthy
 *   data-on-click / data-on-change="{{handler}}"   event handlers
 * A page script defines `class Component extends DCLogic` with renderVals() and uses this.setState().
 */
(function (global) {
  'use strict';
  var HOLE = /\{\{\s*([\w$.]+)\s*\}\}/g;
  var ONE = /^\s*\{\{\s*([\w$.]+)\s*\}\}\s*$/;
  function has(s) { return s.indexOf('{{') > -1; }
  function look(scope, path) {
    var v = scope, keys = path.split('.');
    for (var i = 0; i < keys.length; i++) { if (v == null) return undefined; v = v[keys[i]]; }
    return v;
  }
  function fill(tpl, scope) { return tpl.replace(HOLE, function (_, p) { var v = look(scope, p); return v == null ? '' : String(v); }); }
  function raw(tpl, scope) { var m = tpl.match(ONE); return m ? look(scope, m[1]) : fill(tpl, scope); }
  function isTextual(el) {
    if (el.tagName === 'TEXTAREA') return true;
    if (el.tagName !== 'INPUT') return false;
    return ['text', 'number', 'tel', 'email', 'url', 'search', 'password'].indexOf((el.getAttribute('type') || 'text').toLowerCase()) > -1;
  }
  function apply(el, name, v) {
    var s;
    if (name === 'class') { s = v == null ? '' : String(v); if (el.className !== s) el.className = s; return; }
    if (name === 'checked') { el.checked = !!v && v !== 'false'; return; }
    if (name === 'value' && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) { s = v == null ? '' : String(v); if (el.value !== s) el.value = s; return; }
    if (v === false || v == null) { el.removeAttribute(name); return; }
    s = String(v); if (el.getAttribute(name) !== s) el.setAttribute(name, s);
  }
  function bindAttrs(el, updaters) {
    Array.prototype.slice.call(el.attributes).forEach(function (a) {
      if (!has(a.value)) return;
      var name = a.name, tpl = a.value;
      el.removeAttribute(name);
      if (name.indexOf('data-on-') === 0) {
        var ev = name.slice(8), m = tpl.match(ONE), path = m && m[1], current = null;
        el.addEventListener(ev === 'change' && isTextual(el) ? 'input' : ev, function (e) { if (current) current(e); });
        updaters.push(function (scope) { current = path ? look(scope, path) : null; });
      } else {
        updaters.push(function (scope) { apply(el, name, raw(tpl, scope)); });
      }
    });
  }
  function bind(root) {
    var updaters = [];
    Array.prototype.slice.call(root.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {
        if (has(child.data)) { var tpl = child.data; updaters.push(function (scope) { var s = fill(tpl, scope); if (child.data !== s) child.data = s; }); }
      } else if (child.nodeType === 1) {
        var tag = child.tagName.toLowerCase();
        if (tag === 'sc-for') updaters.push(island(child, true));
        else if (tag === 'sc-if') updaters.push(island(child, false));
        else { bindAttrs(child, updaters); updaters.push(bind(child)); }
      }
    });
    return function (scope) { for (var i = 0; i < updaters.length; i++) updaters[i](scope); };
  }
  // A repeating (sc-for) or conditional (sc-if) region. Existing instances are updated in place,
  // so focus and typed values inside the page are never lost.
  function island(el, isFor) {
    var tpl = Array.prototype.slice.call(el.childNodes);
    var m = (el.getAttribute(isFor ? 'list' : 'value') || '').match(ONE);
    var path = m && m[1], alias = el.getAttribute('as');
    var anchor = document.createComment(isFor ? 'for' : 'if');
    el.parentNode.replaceChild(anchor, el);
    var instances = [];
    function make(scope) {
      var start = document.createComment(''), end = document.createComment(''), frag = document.createDocumentFragment();
      frag.appendChild(start);
      tpl.forEach(function (n) { frag.appendChild(n.cloneNode(true)); });
      frag.appendChild(end);
      var update = bind(frag); update(scope);
      anchor.parentNode.insertBefore(frag, anchor);
      return { start: start, end: end, update: update };
    }
    function drop(inst) {
      var n = inst.start, next;
      while (n) { next = n.nextSibling; n.parentNode.removeChild(n); if (n === inst.end) break; n = next; }
    }
    return function (scope) {
      if (isFor) {
        var list = (path && look(scope, path)) || [];
        while (instances.length > list.length) drop(instances.pop());
        for (var k = 0; k < list.length; k++) {
          var child = Object.create(scope); child[alias] = list[k];
          if (instances[k]) instances[k].update(child); else instances.push(make(child));
        }
      } else {
        var on = !!(path && look(scope, path));
        if (on) { if (instances[0]) instances[0].update(scope); else instances.push(make(scope)); }
        else if (instances[0]) drop(instances.pop());
      }
    };
  }
  function DCLogic() { this.state = {}; this._render = null; }
  DCLogic.prototype.setState = function (patch) {
    this.state = Object.assign({}, this.state, typeof patch === 'function' ? patch(this.state) : patch);
    if (this._render) this._render();
  };
  function mount(Component, root) {
    var logic = new Component(), update = bind(root), queued = false;
    logic._render = function () {
      if (queued) return; queued = true;
      Promise.resolve().then(function () { queued = false; update(logic.renderVals()); });
    };
    update(logic.renderVals());
    root.classList.remove('cloak');
    return logic;
  }
  global.DCLogic = DCLogic;
  global.DC = { mount: mount };
})(window);
