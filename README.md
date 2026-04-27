Room Flow
A web-based decision support tool that helps hotel front office and revenue management teams identify and execute room upgrades that maximize the value of unsold premium inventory.
The application ingests a daily reservations export (or pulls one automatically from a cloud feed), simulates upgrade paths under three different strategies, and surfaces a ranked list of recommendations the team can accept in bulk or one at a time. Accepted upgrades are tracked in a per-user log so the team can verify the change was made in the PMS and roll up performance analytics over time.
---
Table of Contents
What It Does
Live Architecture at a Glance
Admin Guide
Signing In
Daily Workflow
Reading the Recommendations Tab
Accepting Upgrades and Marking Them in the PMS
Manual Upgrades
Analytics
Settings: Property Rules
Settings: Out-of-Order (OOO) Rooms
Adding a New Property
Lead Times
Developer Guide
Stack
File Layout
Authentication and Admin Allowlist
Property Configuration Model
Data Inputs
The Upgrade Simulation
UI Architecture
Firestore Schema
Adding a Property
Local Setup
Debugging
Future Work
---
What It Does
When a guest with a low-tier room books at a property, the front desk often has the option to upgrade them at no charge if a higher-tier room is sitting unsold. Done well, this generates goodwill, frees lower-tier inventory for late bookings, and rewards loyal guests. Done poorly, it gives away revenue that would have walked in at a premium.
Room Flow takes that judgment call and turns it into a structured recommendation problem. For a given arrival window, it looks at every active reservation, every room in the property's inventory, and every constraint the property has configured (rate restrictions, accessibility, do-not-move flags, out-of-order rooms, lead times). It then runs three different optimization strategies — Optimized, Guest Focus, and VIP Focus — and presents each as a complete upgrade path the user can accept whole or partially.
---
Live Architecture at a Glance
The app is a single-page client application. All business logic — CSV parsing, the upgrade simulation, the matrix calculations — runs in the browser. Firestore is used for persistence (admin-edited rules, OOO logs, completed-upgrade history, custom properties). Firebase Auth gates access. There is no server component besides Firebase.
---
Admin Guide
This section is for hotel ops, revenue management, and front-of-house staff using the tool day-to-day.
Signing In
The app uses email + password authentication. Your account must be provisioned by Anthropic-side (Firebase Auth) before you can sign in. If you are an admin (the people who can edit property rules, clear analytics, or add new properties), your UID also needs to be listed in the `ADMIN_UIDS` array in the application code. Reach out to a developer to get added.
After signing in successfully you'll see the property dropdown in the top right. Pick the property you're managing — the rest of the app updates to that property's hierarchy, inventory, and historical data.
Daily Workflow
The intended cadence:
Pick the property in the top-right dropdown.
Confirm the Analysis Start Date at the top of the page. This defaults to today and drives the 14-day matrix and the upgrade window.
Load reservations — either click Load Cloud Reports if your property uses the automatic SNT feed, or upload a CSV manually using the file input.
Review Recommendations — pick a strategy from the dropdown (Optimized, Guest Focus, VIP Focus) and review the recommended path.
Accept the path, individual rows, or skip to Manual Upgrades if you need to make a specific call.
Mark each accepted upgrade as PMS Updated once you've actually changed the room assignment in your PMS. This moves it into the analytics log.
Reading the Recommendations Tab
The Recommendations tab shows you a single optimization path at a time. Switch strategies with the Optimization Strategy dropdown:
Optimized: prioritizes guests by lead time, then revenue, with VIP status used as a tiebreaker. The intent is to fill rooms that historically don't book deep — the shorter their typical lead time, the higher priority the move.
Guest Focus: highest-revenue guests first.
VIP Focus: VIPs first, then longest stays.
Below the strategy header you'll see a count and total potential value (e.g. "5 Upgrades | Potential: $4,604.15") and an Accept Entire Path button.
Two matrices follow: Projected Availability (what inventory looks like if you accept the path) and Current Availability (what it looks like right now). Cells are color-coded — green is healthy availability, orange is tight, red is oversold.
Accepting Upgrades and Marking Them in the PMS
Clicking Accept Entire Path moves all of that strategy's recommendations into the Accepted Upgrades tab. From there each row has a Mark PMS Updated button — clicking it removes the row and logs the upgrade to your account's history. Use this only after you have actually made the change in the PMS — Room Flow does not push updates to the PMS itself.
You can also undo a completed upgrade from the analytics view if it was marked in error.
Manual Upgrades
The Manual Upgrades tab lists every reservation in the next 10 days that could be upgraded but didn't end up in the recommended path. You can pick a target room from the dropdown next to each guest and click Upgrade to add them to your accepted list.
This tab is most useful when the recommended path is being conservative (because of a chain block, for example) and you have specific operational knowledge — a guest you know is coming with a complaint history, a VIP arriving for an event, etc.
Guests marked VIP show a red VIP tag. Guests arriving within 48 hours show a green 48H tag — for these, the simulation relaxes some rate filters (it stops excluding OTA-rate bookings since at that point the inventory is committed anyway).
Analytics
The Analytics tab has three sub-views:
Completed Upgrades: a chronological log of every upgrade you've marked as PMS Updated, filterable by date and showing total value.
Demand Insights: a per-property aggregate of which room types you've upgraded into most often and the revenue captured.
Lead Time Analytics: a manual entry table for the average lead time per room type. The Optimized strategy uses these values when prioritizing guests, so keeping them up to date matters. Click Save to Cloud after editing.
If you accidentally clear analytics, the action is destructive — it deletes the records from Firestore and they cannot be recovered.
Settings: Property Rules
(Admin-only, opened via the gear icon.)
Each property has five rule fields:
Hierarchy — the order of room types from lowest to highest tier, comma-separated. Upgrades only flow upward through this list. The format includes a bed-type suffix where present (`KJS-K/POC`, `TQ-QQ`, `LKBS-K/POC`).
Target Rooms — currently unused for active filtering; reserved for future "preferred destination" logic.
Prioritized Rates — rates the simulation favors when picking candidates. Comma-separated.
OTA Rates — bookings on these rates are excluded from upgrade consideration when the arrival is more than 48 hours away. This protects against giving free upgrades to guests who already paid the lowest available rate. After the 48-hour mark, the filter relaxes.
Ineligible Upgrades — room types that should never be used as upgrade destinations (typically ADA-accessible rooms or oversold-buffer types).
Click Save Rules to persist your changes to Firestore. Changes apply immediately to the next simulation run. They are scoped per-property.
Settings: Out-of-Order (OOO) Rooms
The Settings panel also has an OOO section. Use this to record rooms that are unavailable for assignment — maintenance, deep clean, renovation, etc. Each record has a room type, a count, a start date, and an end date. The simulation subtracts these from physical inventory for the affected dates.
OOO records are scoped per-property and persist in Firestore.
Adding a New Property
(Admin-only, + Add Property button.)
A property needs four pieces of information at minimum:
Property Code — a short lowercase abbreviation (e.g. `cby`).
Hierarchy — comma-separated room types in tier order.
Inventory — room numbers and codes, in the format `101 102 103 KING, 201 202 QQR, ...` (room numbers separated by spaces, then a code, comma-separated groups).
Bed Types (optional but recommended) — pairs in the format `PKR:K, TKR:K, QQR:QQ, ...`. Valid bed values are `K`, `QQ`, `Q`, `D`, `DD`. If you skip this, the simulation uses pattern inference on room codes, which works for most names but can misclassify uncommon ones (e.g. `EX`, `HHK`, `DAR`).
Submit the form and the property becomes available immediately in the dropdown. The data is stored in Firestore under `custom_properties/{code}` and survives reloads.
Lead Times
For the Optimized strategy to work well, each property needs lead-time data. The simplest way to populate this is via the Lead Time Analytics sub-tab — there's an input row for every room type in the hierarchy. Enter the average lead time in days based on your historical data and click Save to Cloud.
If lead times are not entered, the simulation falls back to lead time = 0 for every room, which effectively disables that priority dimension and Optimized becomes a revenue + VIP sort.
---
Developer Guide
This section is for engineers extending or maintaining the app.
Stack
Vanilla JavaScript in a single `script.js` file (no build step, no bundler, no framework).
HTML + CSS for the UI shell, which is mostly tabbed sections inside `index.html`.
Firebase Auth (email + password) for authentication.
Firestore for persistence of editable settings and per-user history.
Firebase Storage is initialized but not currently used in the active code paths.
Hosting: the project deploys as a static site (currently to Vercel).
There is no test suite yet. There is no transpilation step — the JavaScript runs in the browser as-written.
File Layout
```
.
├── index.html              # All UI markup, modal definitions, tab structure
├── script.js               # All application logic (~2700 lines)
├── style.css               # Styles
├── Config.js               # firebaseConfig — populated per environment
├── Hotel_Upgrade_Favicon.ico
└── README.md               # This file
```
`Config.js` exports a global `firebaseConfig` object that `script.js` consumes via `firebase.initializeApp(firebaseConfig)` at the top of the file. Treat `Config.js` as environment-specific.
Authentication and Admin Allowlist
Authentication is email + password through Firebase Auth. Sign-up is not exposed in the UI — admins create accounts via the Firebase console.
Admin privilege is controlled by an in-script allowlist:
```js
const ADMIN_UIDS = [
  "<uid>",
  "<uid>",
  // ...
];
```
Adding a new admin means appending their UID to this array and redeploying. Admin gates check `ADMIN_UIDS.includes(user.uid)` in `auth.onAuthStateChanged` and toggle UI visibility accordingly. Admin-gated features include: editing property rules, adding properties, accessing the Settings modal, and clearing analytics.
Note that all admin enforcement is client-side. The Firestore security rules should also enforce the same allowlist — see Future Work.
Property Configuration Model
Properties live in two places:
Baked-in profiles — defined in `script.js` as the `profiles` and `MASTER_INVENTORIES` constants. Edit in the source.
Custom profiles — created via the Add Property modal, stored in Firestore at `custom_properties/{code}`, merged into the in-memory `profiles` object at sign-in time by `loadCustomProperties()`.
Each profile has six fields:
```js
sts: {
  hierarchy: 'PKR, TKR, QQR, LKR, CKR, KS, PKS, AKR, AQQ',
  bedTypes: { PKR:'K', TKR:'K', QQR:'QQ', LKR:'K', CKR:'K', KS:'K', PKS:'K', AKR:'K', AQQ:'QQ' },
  targetRooms: '',
  prioritizedRates: 'Best Available, BAR, Rack',
  otaRates: 'Expedia, Booking.com, Priceline, GDS',
  ineligibleUpgrades: ''
}
```
`hierarchy` is the upgrade ladder, lowest to highest. `bedTypes` is an explicit map from room code to bed type — `K`, `QQ`, `Q`, `D`, or `DD`. The simulation enforces bed compatibility (a King-bedded guest can't be put in a Queen-Queen room), so this field needs to be accurate.
Admin overrides to property rules (excluding `bedTypes`) are stored separately in `app_settings/profile_rules` and merged in by `loadRemoteProfiles()`. `bedTypes` is preserved across this merge because the merge is shallow and only writes the five rule fields.
Data Inputs
The application accepts two CSV formats, distinguished by their header columns.
SNT format 
Files prefixed `SNT`, `LTRL`, `VERD`, `LCKWD`, `TBH`, or `DARLING`. These are the standard Charlestowne reservation exports.
Key columns: `First Name`, `Last Name`, `Reservation Id`, `Arrival Room Type`, `Arrival Rate Code`, `Group Name`, `Arrival Date`, `Departure Date`, `Reservation Status`, `Adr`, `Market Code`, `Vip` / `VIPDescription`, `Do Not Move`, and any of `Book Date` / `Booked Date` / `Creation Date` / `Create Date` / `Entered On` for booking date inference.
Parsed by `parseAllReservations()`.
SynXis format
Detected by the presence of a `Guest_Nm` column. Used for properties on the SynXis CRS.
Key columns: `Guest_Nm`, `CRS_Confirm_No`, `Rm_Typ_Cd`, `Rate_Type_Name_Code_Offshore`, `Arrival_Date`, `Depart_Date`, `Rez_Status`, `Avg_Rate_Offshore`, `create_dt`.
Parsed by `parseSynxisArrivals()`.
SynXis inventory feed
A separate auxiliary feed loaded alongside the reservation file when available. Contains `Cal_Dt`, `Rm_Typ_Nm` (room type name with code in parentheses), and `Avail_Qty`. When this is present, the simulation uses these availability values directly; when absent, it computes availability from `MASTER_INVENTORIES` minus current reservations minus OOO records.
Auto-load reads the latest available document from `SNTData/{prefix}_latest` and `SynxisData/{prefix}_latest` per the property mapping in `SNT_PROPERTY_MAP`.
The Upgrade Simulation
The core simulation lives in `runSimulation(strategy, allReservations, masterInv, rules, completedIds)` and is called once per strategy by `generateScenariosFromData()`.
The inputs:
`strategy` — `'Optimized'`, `'Guest Focus'`, or `'VIP Focus'`. Drives candidate priority order.
`allReservations` — reservations parsed from the CSV.
`masterInv` — total physical inventory per room code for this property.
`rules` — the active rule set (hierarchy, ineligible, OTA rates, profile, selected date).
`completedIds` — Set of reservation IDs already marked as upgraded to exclude from re-recommendation.
The output is a list of `pendingUpgrades` records, each containing the guest's name, reservation ID, original room, target room, dates, revenue, and VIP flag.
Pipeline
Build per-date inventory: a 14-day inventory map, accounting for existing reservations, OOO records, and any already-accepted upgrades.
Filter candidates: drop completed upgrades, do-not-move guests, already-accepted guests, cancellations, and check-outs. Apply rate filters (exclude OTA rates when arrival is more than 48 hours away; exclude COMP rates always).
Sort by strategy: Guest Focus = revenue desc; VIP Focus = VIP first, then longest stay; Optimized = lead time asc, revenue desc, VIP tiebreaker.
Iterate: for each guest in priority order, attempt to move them up the hierarchy. The exact iteration semantics (one tier per pass with re-iteration vs. highest reachable) are an active design discussion — see Future Work.
Bed compatibility check: at every move, verify the target room's bed type is compatible with the guest's current bed type. K → K, QQ → QQ, Q → anything (the existing rule).
Inventory check: every night of the guest's stay must have at least one unit of the target room available.
Record: each guest who moves gets a single entry in `pendingUpgrades` with their original room preserved across multi-hop chains, so the UI displays "Original: X | Upgraded To: <final>" regardless of how many internal hops happened.
Bed Type Resolution
`getBedType(roomCode, profileName)` resolves bed types in three tiers:
Explicit bed map for the property (`profiles[profileName].bedTypes[code]`). Authoritative.
Pattern inference — looks for `-K` / `-QQ` / `-Q` suffixes, `KING` / `QUEEN` / `QQ` substrings, and common prefix conventions.
Fallback to `K` — most un-inferable codes (e.g. `EX`, `HHK`, `DAR`) are suites at this set of properties, which are conventionally King-bedded. A console warning is emitted whenever the fallback fires so admins know to populate the bed map.
UI Architecture
The UI is a single page with three top-level zones:
Header: property dropdown, sign in/out, settings gear, add-property button (admin only).
Action panel: cloud-load button, manual upload, analysis start date.
Tabbed main area: Recommendations, Manual Upgrades, Accepted Upgrades, Analytics (with sub-tabs).
Tab switching is handled by simple `data-tab-target` attributes on the buttons and CSS class toggling. Sub-tabs in Analytics use `data-sub-tab-target`. There is no router — state is held in module-scoped variables in `script.js`.
State variables of note:
`currentCsvContent` / `currentFileName` — last loaded reservation file.
`currentRules` — the active rule snapshot for this run.
`currentScenarios` — the `{ Optimized, GuestFocus, VIPFocus }` map of strategies for the current run.
`currentAllReservations` / `originalAllReservations` — parsed reservation arrays.
`acceptedUpgrades` / `completedUpgrades` — pending and committed upgrades.
`oooRecords` — out-of-order records loaded from Firestore.
`currentInventoryMap` — the SynXis availability feed if loaded.
`savedLeadTimes` — per-room-type lead times for the active property.
Firestore Schema
```
app_settings/
  profile_rules                   # admin-edited rule overrides per property
                                  # { sts: { hierarchy: '…', otaRates: '…', … }, ... }

custom_properties/
  {code}                          # admin-added property
    code:        string
    hierarchy:   string
    inventory:   [{ roomNumber, code }, ...]
    rules:       { hierarchy, targetRooms, prioritizedRates, otaRates,
                   ineligibleUpgrades, bedTypes }

users/
  {uid}/
    completedUpgrades/
      {auto-id}                   # one document per upgrade marked in PMS
        name, resId, room, upgradeTo, revenue, profile,
        completedTimestamp, vipStatus, ...

ooo_logs/
  {auto-id}                       # one document per OOO record
    profile, roomType, count, startDate, endDate

SNTData/
  {prefix}_latest                 # auto-loaded reservation files
    csv_content, filename

SynxisData/
  {prefix}_latest                 # auto-loaded inventory feed
    csv_content

property_analytics/
  {profile}                       # per-property analytics data
    leadTimeStats:
      {roomType}: { avgLeadTime, count }
    updatedAt
```
Adding a Property
For a property that should be in the deployed app for everyone:
Add the profile to the `profiles` object in `script.js`. Include a `bedTypes` map.
Add the inventory to `MASTER_INVENTORIES`.
If the property uses a SNT-style auto-load, add the prefix to `SNT_PROPERTY_MAP`.
Commit, redeploy.
For a one-off property only this admin needs, use the Add Property modal in the UI. The data lands in Firestore and merges in for everyone who has access.
Local Setup
```bash
git clone <repo>
cd <repo>
# Edit Config.js with your Firebase config object
# Open index.html in a browser, or serve it via any static server:
npx serve .
```
There is no build step. Edits to `script.js` take effect on browser refresh.
Debugging
The simulation has a built-in diagnostic mode. To enable it, open the browser console and run:
```js
window.DEBUG_UPGRADE_SIM = true
```
Then re-run a simulation (refresh the Recommendations tab or switch strategies). The console will print:
The initial inventory snapshot for the next ~10 days
The full candidate pool with their current rooms, dates, rates, and tags
Every move decision as it happens, in sequence
The final pending upgrades
For every guest who didn't get upgraded, the per-tier reason (ineligibility, bed mismatch, or which specific date's inventory was 0)
The output is keyed off the Guest Focus strategy only, to avoid triple-logging across all three. Disable with `window.DEBUG_UPGRADE_SIM = false` or refresh the page.
---
Future Work
A few items that are known and on a list, in rough priority order:
Duplicate function definitions. `generateMatrixData` and `generateScenariosFromData` are each defined twice in `script.js`. JavaScript keeps the second definition; the first copies are dead code. The two `generateMatrixData` definitions are not equivalent — the dead one is missing the `netInventoryChange` adjustments.
Date-string matching in `renderManualUpgradeView`. The header-matching uses substring inclusion (`headers.findIndex(h => h.includes("4/2"))`) which can match `4/20` or `4/27` when looking for `4/2`. Tighter pattern.
Score on manual upgrades. `executeManualUpgrade` doesn't set a `score` on the accepted-upgrade record. Anything that reads `score` off a manually-accepted upgrade gets `undefined`.
Firestore security rules. Admin enforcement is currently client-side only. Production hardening should mirror `ADMIN_UIDS` checks in Firestore rules so that someone with a non-admin account can't bypass the UI and write directly to admin collections.
Bed-type review. Several baked-in profiles have `// CONFIRM:` markers on bed-type entries where I best-guessed from naming patterns. Review these against ground truth before relying on them: `spec`, `ivy`, `msi`, `indjh`, `bri`, `dar`, `asu`, `csh`, `gsl`, `maj`. The map is authoritative when populated, so a wrong value here will mis-route upgrades.
Test suite. There is none. Adding one would be a meaningful stability win, especially around the simulation logic which is the most algorithmically dense piece.
Rewrite in TypeScript. The current codebase is vanilla JavaScript with all types inferred at runtime. A TypeScript rewrite would catch a meaningful class of bugs at edit time — particularly around the shape of reservation objects, the per-property rule schema, and the simulation's intermediate state. Worth pairing with the test suite work above.
