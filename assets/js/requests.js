class Component extends DCLogic {
renderVals() {
const st = this.state || {};
const status = st.status || {};
const reqs = [
{ id: 'r1', title: 'Wedding', meta: '12 Dec 2026, evening \u00b7 Kurnool city \u00b7 400 guests', cover: 'Team: 2 photographers, 2 videographers, 1 editor', budget: '\u20b925,000 to \u20b950,000' },
{ id: 'r2', title: 'Birthday', meta: '20 Dec 2026, afternoon \u00b7 Kallur \u00b7 60 guests', cover: 'One individual: 1 photographer', budget: 'Under \u20b910,000' },
{ id: 'r3', title: 'Corporate event', meta: '5 Jan 2027, morning \u00b7 Nandyal \u00b7 120 guests', cover: 'Team: 1 photographer, 1 videographer', budget: '\u20b910,000 to \u20b925,000' }
];
const count = (k) => reqs.filter((r) => (status[r.id] || 'pending') === k).length;
return {
summary: count('pending') + ' pending, ' + count('accepted') + ' accepted, ' + count('declined') + ' declined',
reqs: reqs.map((r) => {
const s = status[r.id] || 'pending';
const set = (v) => () => this.setState({ status: Object.assign({}, status, { [r.id]: v }) });
return {
title: r.title,
meta: r.meta,
cover: r.cover,
budgetLine: 'Budget: ' + r.budget,
label: s === 'pending' ? 'Pending' : (s === 'accepted' ? 'Accepted' : 'Declined'),
tagCls: s === 'accepted' ? 'tg f' : (s === 'declined' ? 'tg' : 'tg p'),
actCls: s === 'pending' ? 'row' : 'row hide',
undoCls: s === 'pending' ? 'chip hide' : 'chip',
accept: set('accepted'),
decline: set('declined'),
undo: set('pending')
};
})
};
}
}

DC.mount(Component, document.getElementById('app'));
