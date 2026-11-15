class Component extends DCLogic {
renderVals() {
const st = this.state || {};
const niche = st.niche || '';
const area = st.area || '';
const q = (st.q || '').trim().toLowerCase();
const studios = [
{ name: 'Sample Studio One', area: 'Kurnool city', niches: ['Wedding', 'Events'], featured: true, blurb: 'Sample listing. Wedding and event coverage.' },
{ name: 'Sample Studio Two', area: 'Kallur', niches: ['Product', 'Food'], featured: false, blurb: 'Sample listing. Product and food shoots.' },
{ name: 'Sample Studio Three', area: 'Budhwarpet', niches: ['Reels / social media', 'Fashion'], featured: false, blurb: 'Sample listing. Reels and fashion shoots.' },
{ name: 'Sample Studio Four', area: 'Nandyal', niches: ['Real estate', 'Corporate / brand film'], featured: false, blurb: 'Sample listing. Property and brand films.' },
{ name: 'Sample Studio Five', area: 'Adoni', niches: ['Portraits', 'Editing only'], featured: false, blurb: 'Sample listing. Portraits and editing.' },
{ name: 'Sample Editor One', area: 'Kurnool city', niches: ['Reels / social media', 'Wedding'], featured: false, kind: 'Individual', role: 'Editor', blurb: 'Sample listing. Reels and wedding highlight edits.' },
{ name: 'Sample Videographer One', area: 'Kallur', niches: ['Events', 'Wedding'], featured: false, kind: 'Individual', role: 'Videographer', blurb: 'Sample listing. Function and wedding coverage.' },
{ name: 'Sample Photographer One', area: 'Budhwarpet', niches: ['Portraits', 'Events'], featured: false, kind: 'Individual', role: 'Photographer', blurb: 'Sample listing. Portraits and event photos.' }
];
studios.forEach((s) => { if (!s.kind) { s.kind = 'Team or studio'; s.role = 'Studio'; } });
const nicheList = ['Wedding', 'Events', 'Product', 'Food', 'Real estate', 'Fashion', 'Reels / social media', 'Corporate / brand film', 'Portraits', 'Editing only'];
const areaList = ['Kurnool city', 'Kallur', 'Budhwarpet', 'Nandyal', 'Adoni', 'Other'];
const kind = st.kind || '';
const results = studios.filter((s) => (!kind || s.kind === kind) && (!niche || s.niches.indexOf(niche) > -1) && (!area || s.area === area) && (!q || (s.name + ' ' + s.area + ' ' + s.niches.join(' ') + ' ' + s.blurb).toLowerCase().indexOf(q) > -1)).map((s) => ({ name: s.name, label: s.role + ' · ' + s.kind, area: s.area, blurb: s.blurb, featured: s.featured, tags: s.niches.map((l) => ({ label: l })) }));
const active = !!(niche || area || q || kind);
const pinPos = { 'Kurnool city': [50, 46], 'Kallur': [66, 30], 'Budhwarpet': [38, 64], 'Nandyal': [82, 76], 'Adoni': [16, 28] };
const mapPins = Object.keys(pinPos).map((l) => ({ label: l + ' (' + studios.filter((s) => s.area === l).length + ')', cls: l === area ? 'pin on' : 'pin', style: 'left:' + pinPos[l][0] + '%;top:' + pinPos[l][1] + '%', pick: () => this.setState({ area: l === area ? '' : l }) }));
const place = (area && area !== 'Other') ? area : 'Kurnool';
const mapUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('photo video studio ' + place);
const mapLabel = 'Open ' + place + ' studios in Google Maps';
const centers = { 'Kurnool city': [15.83, 78.04], 'Budhwarpet': [15.83, 78.05], 'Kallur': [15.80, 78.07], 'Nandyal': [15.48, 78.48], 'Adoni': [15.63, 77.27] };
const km = (a, b, c, d) => { const r = Math.PI / 180; const x = (c - a) * r; const y = (d - b) * r; const h = Math.sin(x / 2) * Math.sin(x / 2) + Math.cos(a * r) * Math.cos(c * r) * Math.sin(y / 2) * Math.sin(y / 2); return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)); };
const locDefault = 'Tap “Use my location” to find the nearest area. Your location stays in your browser and is never sent to us.';
const useLocation = () => {
if (typeof navigator === 'undefined' || !navigator.geolocation) { this.setState({ locMsg: 'This browser can’t share your location here. Use the Google Maps link instead.' }); return; }
this.setState({ locMsg: 'Finding your location…' });
navigator.geolocation.getCurrentPosition((pos) => {
let best = '';
let bd = 1e9;
Object.keys(centers).forEach((k) => { const d = km(pos.coords.latitude, pos.coords.longitude, centers[k][0], centers[k][1]); if (d < bd) { bd = d; best = k; } });
this.setState({ area: best, locMsg: 'Nearest listed area: ' + best + ', about ' + Math.round(bd) + ' km away (approximate).' });
}, (err) => {
this.setState({ locMsg: err && err.code === 1 ? 'Location is blocked. Allow it in your browser settings, or use the Google Maps link.' : 'We could not get your location. Use the Google Maps link instead.' });
}, { timeout: 10000, maximumAge: 300000 });
};
return {
query: st.q || '',
onQuery: (e) => this.setState({ q: e.target.value }),
clear: () => this.setState({ niche: '', area: '', q: '', kind: '' }),
niches: nicheList.map((l) => ({ label: l, cls: l === niche ? 'chip on' : 'chip', pick: () => this.setState({ niche: l === niche ? '' : l }) })),
areas: areaList.map((l) => ({ label: l, cls: l === area ? 'chip on' : 'chip', pick: () => this.setState({ area: l === area ? '' : l }) })),
results: results,
mapPins: mapPins,
mapUrl: mapUrl,
mapLabel: mapLabel,
locMsg: st.locMsg || locDefault,
useLocation: useLocation,
kinds: ['Individual', 'Team or studio'].map((l) => ({ label: l, cls: l === kind ? 'chip on' : 'chip', pick: () => this.setState({ kind: l === kind ? '' : l }) })),
showList: active,
showHint: !active,
noResults: active && results.length === 0,
countText: results.length + (results.length === 1 ? ' studio found' : ' studios found')
};
}
}

DC.mount(Component, document.getElementById('app'));
