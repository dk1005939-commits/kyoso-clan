class Component extends DCLogic {
renderVals() {
const st = this.state || {};
const step = st.step || 1;
const area = st.area || '';
const event = st.event || '';
const coverage = st.coverage || '';
const date = st.date || '';
const picked = st.picked || [];
const providers = [
{ name: 'Sample Studio One', role: 'Studio', kind: 'Team or studio', area: 'Kurnool city', niches: ['Wedding', 'Events'], busy: ['2026-12-12'] },
{ name: 'Sample Studio Two', role: 'Studio', kind: 'Team or studio', area: 'Kallur', niches: ['Product', 'Food'], busy: [] },
{ name: 'Sample Studio Three', role: 'Studio', kind: 'Team or studio', area: 'Budhwarpet', niches: ['Reels / social media', 'Fashion'], busy: [] },
{ name: 'Sample Studio Four', role: 'Studio', kind: 'Team or studio', area: 'Nandyal', niches: ['Real estate', 'Corporate / brand film'], busy: [] },
{ name: 'Sample Studio Five', role: 'Studio', kind: 'Team or studio', area: 'Adoni', niches: ['Portraits', 'Editing only'], busy: [] },
{ name: 'Sample Editor One', role: 'Editor', kind: 'Individual', area: 'Kurnool city', niches: ['Reels / social media', 'Wedding'], busy: [] },
{ name: 'Sample Videographer One', role: 'Videographer', kind: 'Individual', area: 'Kallur', niches: ['Events', 'Wedding'], busy: ['2026-12-05'] },
{ name: 'Sample Photographer One', role: 'Photographer', kind: 'Individual', area: 'Budhwarpet', niches: ['Portraits', 'Events'], busy: [] }
];
const areaList = ['Kurnool city', 'Kallur', 'Budhwarpet', 'Nandyal', 'Adoni', 'Other'];
const eventList = ['Wedding', 'Engagement or function', 'Birthday', 'Corporate event', 'Product launch', 'Other'];
const covList = [{ label: 'One individual', value: 'Individual' }, { label: 'A team', value: 'Team' }];
const evNiches = { 'Wedding': ['Wedding'], 'Engagement or function': ['Events', 'Wedding'], 'Birthday': ['Events'], 'Corporate event': ['Events', 'Corporate / brand film'], 'Product launch': ['Product', 'Events'], 'Other': [] };
const names = ['Your event', 'Who you need', 'Pick who you like', 'Your details'];
const wantKind = coverage === 'Individual' ? 'Individual' : (coverage === 'Team' ? 'Team or studio' : '');
const want = evNiches[event] || [];
const scored = providers.filter((p) => !wantKind || p.kind === wantKind).map((p) => ({ p: p, score: (area && p.area === area ? 2 : 0) + (p.niches.some((x) => want.indexOf(x) > -1) ? 1 : 0), busy: !!(date && p.busy.indexOf(date) > -1) }));
scored.sort((x, y) => y.score - x.score);
const sug = scored.slice(0, 5).map((x, i) => {
const on = picked.indexOf(x.p.name) > -1;
return {
name: x.p.name,
best: i === 0 && x.score > 0 && !x.busy ? 'Best match' : '',
line: x.p.role + ' \u00b7 ' + x.p.kind + ' \u00b7 ' + x.p.area + ' \u00b7 ' + (x.busy ? 'Booked on your date' : (date ? 'Free on your date' : 'Pick a date to check')),
cls: on ? 'chip on' : 'chip',
btn: on ? 'Selected' : (x.busy ? 'Select anyway' : 'Select'),
pick: () => this.setState({ picked: on ? picked.filter((n) => n !== x.p.name) : picked.concat([x.p.name]) })
};
});
return {
stepNo: step,
stepName: names[step - 1],
pct: (step * 25) + '%',
s1: step === 1 ? '' : 'hide',
s2: step === 2 ? '' : 'hide',
s3: step === 3 ? '' : 'hide',
s4: step === 4 ? '' : 'hide',
backCls: step > 1 ? 'chip' : 'chip hide',
nextCls: step < 4 ? 'cta' : 'cta hide',
submitCls: step === 4 ? 'cta' : 'cta hide',
back: () => this.setState({ step: Math.max(1, step - 1) }),
next: () => {
const el = document.getElementById('step' + step);
const bad = el ? el.querySelector(':invalid') : null;
if (bad) { bad.reportValidity(); return; }
this.setState({ step: Math.min(4, step + 1) });
},
events: eventList.map((l, i) => ({ value: l, id: 'ev' + i, checked: event === l, pick: () => this.setState({ event: l }) })),
areas: areaList.map((l, i) => ({ value: l, id: 'ar' + i, checked: area === l, pick: () => this.setState({ area: l }) })),
coverages: covList.map((c, i) => ({ value: c.value, label: c.label, id: 'cv' + i, checked: coverage === c.value, pick: () => this.setState({ coverage: c.value }) })),
onDate: (e) => this.setState({ date: e.target.value }),
sug: sug,
hasSug: sug.length > 0,
noSug: sug.length === 0,
pickedText: picked.length ? picked.join(', ') : 'None yet',
pickedValue: picked.join(', '),
teams: [{ label: 'Wedding crew', ph: 2, vd: 2, ed: 1 }, { label: 'Event duo', ph: 1, vd: 1, ed: 0 }, { label: 'Reel squad', ph: 0, vd: 1, ed: 1 }, { label: 'Full coverage', ph: 2, vd: 2, ed: 2 }].map((t) => ({ label: t.label + ' (' + t.ph + ' photo, ' + t.vd + ' video, ' + t.ed + ' edit)', cls: st.team === t.label ? 'chip on' : 'chip', pick: () => this.setState({ ph: t.ph, vd: t.vd, ed: t.ed, coverage: 'Team', team: t.label }) })),
ph: st.ph === undefined ? '' : st.ph,
vd: st.vd === undefined ? '' : st.vd,
ed: st.ed === undefined ? '' : st.ed,
onPh: (e) => this.setState({ ph: e.target.value, team: '' }),
onVd: (e) => this.setState({ vd: e.target.value, team: '' }),
onEd: (e) => this.setState({ ed: e.target.value, team: '' })
};
}
}

DC.mount(Component, document.getElementById('app'));
