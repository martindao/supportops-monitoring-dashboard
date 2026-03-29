# Uptime Kuma Monitoring Source Map

## Source References Used
- GitHub repo: https://github.com/louislam/uptime-kuma
- Live demo entry: https://demo.kuma.pet/start-demo
- Public screenshots from README:
  - Dark dashboard/detail: https://user-images.githubusercontent.com/1336778/212262296-e6205815-ad62-488c-83ec-a5b0d0689f7c.jpg
  - Status page/history bars: https://user-images.githubusercontent.com/1336778/134628766-a3fe0981-0926-4285-ab46-891a21c3e4cb.png
  - Light dashboard/detail: https://uptime.kuma.pet/img/light.jpg
- UI source files (for exact screen/component naming and visible states):
  - `src/pages/DashboardHome.vue`
  - `src/pages/Details.vue`
  - `src/pages/EditMonitor.vue`
  - `src/components/Status.vue`
  - `src/assets/vars.scss`

---

## Monitoring Remake Target Screens (Exact Targets)

### 1) Main dashboard (monitor list + quick stats + recent important events)
**Primary source**: `DashboardHome.vue` + dashboard screenshots

Mirror these visible areas:
- Top title area: “Quick Stats” block.
- Stat counters: **Up / Down / Maintenance / Unknown / Paused**.
- Left monitor list panel pattern:
  - Search input at top.
  - Monitor rows with uptime badge (e.g., `100%`, `0%`).
  - Right-side mini heartbeat strip in each row.
  - Active selection row highlight.
- Important events table:
  - Columns: monitor/group, status badge, date/time, message.
  - Dense, operational table styling (compact rows).

### 2) Monitor detail view
**Primary source**: `Details.vue` + dark/light dashboard screenshots

Mirror these visible areas:
- Page header: monitor name + optional metadata/tags + target URL/host text.
- Action row: Pause/Resume, Edit, Clone, Delete button group.
- Heartbeat strip card:
  - Horizontal sequence of narrow status pills/segments.
  - Large right-side current status pill (e.g., “Up”).
- KPI stats strip:
  - Current response, avg response (24h), uptime (24h/30d/1y), cert expiry.
- Response time graph card:
  - Single-series line chart with subtle fill.
  - Horizontal time axis + vertical ms axis.
- Important events/history table:
  - Repeated status/date/message pattern for incident history.

### 3) Status indicators (up/down/maintenance/pending)
**Primary source**: `Status.vue` + `vars.scss`

Map from status code → label → color class:
- `1` → **Up** → `bg-primary` (green family, `$primary: #5cdd8b`)
- `0` → **Down** → `bg-danger` (red, `$danger: #dc3545`)
- `2` → **Pending** → `bg-warning` (yellow/orange, `$warning: #f8a306`)
- `3` → **Maintenance** → `bg-maintenance` (blue, `$maintenance: #1747f5`)
- fallback → **Unknown** → `bg-secondary` (gray)

For remake usage:
- Required by brief: preserve green/red/yellow status semantics.
- Also preserve explicit maintenance state (blue) because Uptime Kuma uses a distinct maintenance color.

### 4) Response time graphs
**Primary source**: detail screenshots + `Details.vue` (`PingChart`)

Mirror these characteristics:
- Dark-card container, soft border, rounded corners.
- Green line series with light translucent area fill.
- Low visual noise (thin grid lines, muted axis labels).
- “Realtime operations” look: recent spikes are visually prominent.

### 5) Incident/history presentation
**Primary source**: `DashboardHome.vue` + `Details.vue`

Mirror pattern:
- History is presented as an **important events table**, not a long prose feed.
- Each entry includes:
  - status badge,
  - timestamp,
  - short message text.
- Supports pagination and “no important events” empty state.

### 6) Add monitor flow
**Primary source**: `EditMonitor.vue`

Mirror the visible flow (minimal subset for remake):
1. **Header + form card** (“Add New Monitor” style entry point).
2. **General section**
   - Monitor type selector (HTTP, Ping, Port, DNS, etc.).
   - Friendly name input.
3. **Target definition** (conditional by type)
   - URL input (HTTP-like monitors) OR hostname/port fields.
4. **Status logic controls**
   - Keyword + invert keyword (for keyword monitors) when applicable.
5. **Save action bar**
   - Fixed-bottom or clearly separated action row for submit/cancel.

Keep this flow in scope; do not replicate advanced backend/provider-specific monitor options.

---

## Visual Elements to Reproduce

### Card/List structure
- Repeated dark “shadow-box” cards with rounded corners and medium padding.
- Two-column dashboard composition:
  - left navigation/list panel,
  - right detail/metrics/content area.
- Tight vertical rhythm for data-dense operations UI.

### Status colors
- Up = green, Down = red, Pending = yellow/orange, Unknown = gray.
- Maintenance uses dedicated blue pill in source model.

### Typography + spacing
- Simple sans-serif stack, mostly regular weight.
- Strong hierarchy:
  - Page title (`h1`),
  - section titles (`h2`/`h3`/`h4`),
  - compact data text (table + labels).
- Typical spacing observed:
  - card padding around ~20px,
  - section gap around ~20–25px,
  - compact table row spacing.

### Icon usage
- Functional icons in action controls (pause/play/edit/clone/delete).
- Status and utility icons are lightweight and secondary to numeric/text signal.

### Graph/chart style
- Single primary-color line.
- Muted grid/axes.
- Rounded, contained chart surface matching card language.

---

## Layout Rules to Mirror

### Grid vs list
- Primary shell is **split layout**:
  - list/navigation column (monitors),
  - content column (selected monitor details).
- Inside content, use stacked cards rather than complex nested grids.

### Sidebar navigation
- Persistent monitor list with:
  - search field,
  - monitor rows,
  - tiny heartbeat indicators,
  - selected row highlight.

### Header structure
- Top nav/header includes app identity and key section links (Status Page / Dashboard / Settings).
- Monitor detail header includes monitor title and immediate actions.

### Footer elements
- No strong visual footer dependency in core monitoring workflow.
- Prioritize screen real estate for status data; keep footer minimal/non-prominent.

---

## Explicit Exclusions for This Remake Scope
- Authentication/login/setup screens.
- Backend/config-heavy admin pages (notification providers, integrations, system setup).
- Non-monitoring management pages unrelated to dashboard/detail/status/add-monitor UX.
