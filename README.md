# Kyoso Clan website

Kyoso Clan puts every editor, videographer, photographer and studio in one place, so clients can find the right creator near them and book one person or a whole team for a wedding, function or event.

This folder is the **complete, standalone website**. It does not need Claude, a build step, a framework or a database to run.

---

## 1. What technology is it?

| | |
|---|---|
| **Original format** | A Claude *design component* project: `.dc.html` pages (HTML + CSS + JavaScript) that need Claude's own runtime (`support.js`) and use custom tags (`<x-dc>`, `<helmet>`, `<sc-for>`, `<sc-if>`) and a React-style class (`DCLogic` with `renderVals()` and `setState()`). It is **not** React, Next.js or any other public framework. |
| **This export** | Plain **HTML5 + CSS3 + vanilla JavaScript**. No build step, no npm dependencies at runtime. |
| **Helper** | `assets/js/dc-lite.js` (about 150 lines) re-implements the small part of Claude's runtime the site uses, so the original page logic runs unchanged in any browser. |
| **Fonts** | Space Grotesk from Google Fonts (loaded from the web). |
| **Forms** | Plain HTML forms that post to FormSubmit, which emails the answers to `deepakframes369@gmail.com`. |

## 2. Pages

| File | Page | Interactive? |
|---|---|---|
| `index.html` | Home: hero search, creators by role, studio and creator finder with map and location button, featured work, event booking steps, tags, trust, bookings, footer | Yes (`assets/js/index.js`) |
| `join.html` | Join form for creators, editors, videographers, photographers and studios (skills, pricing, availability, portfolio, photo upload) | No (plain form) |
| `book.html` | Four-step booking: event, who you need (individual or team, quick teams), suggested creators with availability, your details | Yes (`assets/js/book.js`) |
| `studio.html` | Studio listing request form with permission checkbox and availability | No (plain form) |
| `profile.html` | Sample creator or studio profile layout | No |
| `requests.html` | Provider dashboard **prototype**: accept or decline sample booking requests | Yes (`assets/js/requests.js`) |

## 3. Folder structure

```
kyoso-clan/
├── index.html  join.html  book.html  studio.html  profile.html  requests.html
├── assets/
│   ├── css/    index.css  join.css  book.css  studio.css  profile.css  requests.css
│   ├── js/     dc-lite.js  index.js  book.js  requests.js
│   └── img/    kyoso-profile.jpg  kyoso-logo.png  favicon.png
├── claude-source/   the original Claude files, for reference only (cannot run outside Claude)
├── package.json  netlify.toml  vercel.json  robots.txt  .gitignore  .nojekyll
└── README.md
```

## 4. Run it locally

Use any static file server. Do not just double-click the HTML files: some browsers block location access and other features on `file://` addresses.

**Option A: Node.js (18 or newer)**
```bash
npm install
npm start          # opens at http://localhost:3000
```

**Option B: Python (no install)**
```bash
python3 -m http.server 8000     # open http://localhost:8000
```

**Option C: VS Code**: install the "Live Server" extension, right-click `index.html`, choose "Open with Live Server".

## 5. Deploy it

The site is just files, so any static host works. No build command, publish directory is the project root (`.`).

- **Netlify:** drag the folder onto <https://app.netlify.com/drop>, or connect the repository (`netlify.toml` is included).
- **Vercel:** run `npx vercel` in this folder (`vercel.json` is included), or import the repository.
- **GitHub Pages:** push to a repository, then Settings → Pages → deploy from the main branch, root folder. A `.nojekyll` file is included.
- **Cloudflare Pages:** connect the repository, leave the build command empty, set the output directory to `/`.
- **Any web host:** upload the contents of this folder to the web root with FTP or the host's file manager.

Use **HTTPS** (every host above gives it free). The "Use my location" button only works on HTTPS pages.

## 6. Before you go live (checklist)

1. **Activate the forms.** Submit each form once. FormSubmit emails `deepakframes369@gmail.com` a confirmation link, and nothing is delivered until you click it. The forms are in `join.html`, `studio.html` and `book.html`. To change the receiving address, edit the `action="https://formsubmit.co/…"` line in those three files.
2. **Replace placeholders.** Search the project for `[YOUR PRICE]` (home page, Bookings), `[YOUR PAYMENT LINK]` (`book.html`), and the bracketed `[Studio name]` and `[Creator name]` cards in "Featured work".
3. **Replace sample data with real, approved members.** Sample studios and individuals live in two arrays: `studios` in `assets/js/index.js` and `providers` in `assets/js/book.js` (each has name, area, niches, role, and `busy` dates for availability).
4. **Update the Instagram link.** The Instagram button and icon on the home page point to `instagram.com/creators._.zone1`. Search for `creators._.zone1` and replace it with your new account.
5. **Privacy.** The forms collect names, ages, phone numbers, emails and photos. Add a consent line and a privacy policy that fit your legal situation (this is not legal advice; ask a lawyer).
6. **Check the tags text.** The Verified, Featured and Promoted descriptions are written as policy. Only publish them if you will follow them.

## 7. How to change things

| To change | Edit |
|---|---|
| Text, sections, links | The page's `.html` file |
| Colours, fonts, animations | The page's file in `assets/css/` (brand orange is `#FF5A1F`, background `#0F1115`) |
| Areas, niches, sample providers, map pin positions, location logic | `assets/js/index.js` |
| Booking steps, quick teams, matching, availability | `assets/js/book.js` |
| Demo booking requests | `assets/js/requests.js` |
| Logo and profile picture | `assets/img/` (the round logo is `kyoso-profile.jpg`) |

The scripts keep the original structure: `class Component extends DCLogic` with a `renderVals()` method that returns the values the page markup shows, and `this.setState()` to update them.

## 8. Claude-specific parts: what they were and what happened to them

| In the Claude version | Works outside Claude? | In this export |
|---|---|---|
| `support.js` runtime and tags `<x-dc>`, `<helmet>`, `<sc-for>`, `<sc-if>`, `DCLogic` | No | Replaced by normal `<head>` and `<body>` markup and `assets/js/dc-lite.js` |
| Host page that loads `artifact-type/app.js`, plus `canvas.json` (the artboard layout) | No (editor and preview only) | Not part of the site. Kept in `claude-source/` for reference |
| `Piece-*.dc.html` files | No | Loose pieces left on the Claude canvas. Not used by any page |
| Asset links such as `/_blob/<id>` | No (only resolve on claude.ai) | Images copied to `assets/img/`, links rewritten |
| Page heights set to the canvas frame size | Would leave blank space | Replaced with `min-height: 100vh` |
| `onClick` / `onChange` attributes in templates | No | Renamed `data-on-click` / `data-on-change` and handled by `dc-lite.js` |
| Claude features: database, comments, asset store, downloads, user, "sample" (ask Claude), Claude API, MCP connectors, `window.storage` | Not available outside Claude | **None are used.** A search of every original file found no use of them, no `fetch()`, no storage and no backend calls |
| The share link `https://claude.ai/artifact/…` | Only works while it stays published on claude.ai | Replace with your own domain |

**Services that still need the internet** (none are Claude): Google Fonts (to avoid this, download Space Grotesk and host the font files yourself), FormSubmit (form email relay), Google Maps links (they open Google Maps), Instagram link, and the browser's own Geolocation API.

Small technical differences from the original, none visible in the design: `<meta viewport>`, page descriptions, theme colour and a favicon were added; the radio buttons in the booking steps now restore their checked state from the page state; the page is hidden for a split second until the script starts, so raw template text never flashes; the script mounting line was added to the end of each page script.

## 9. What this website is not (yet)

- It has **no backend, no accounts and no database.** Every form arrives as an email. Matching, accepting and confirming bookings are done by hand.
- The finder, the booking suggestions and the requests dashboard use **sample data**. Real availability, online payment and provider sign-in need a backend.
- The map is a **schematic**, not a real map. "Use my location" picks the nearest listed area using rough area coordinates, and nothing is sent anywhere.
- Scroll animations use CSS scroll-driven animations (Chrome, Edge, recent Safari). Other browsers show the page without those effects, with nothing hidden.
- It is a website, not an Android app. A Play Store app would need a real backend first, and the website could later be wrapped as a progressive web app.

## 10. How this export was checked

Tested in headless Chromium: all six pages load with no script errors at 1440 px and 390 px wide, with no sideways scrolling; no unfilled template text; every local link and image resolves; the finder (niche, who, search, map pins, clear), the location button (allowed and blocked), all four booking steps (validation, quick teams, availability, selection), and the request buttons all work.

**Not tested:** real form deliveries to FormSubmit, Safari and Firefox, real phones.
