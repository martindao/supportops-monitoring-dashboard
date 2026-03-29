# T9: Add tests and README proof to monitoring repo

## Current State
- 15 tests pass (3 files: ServiceCard, AlertTable, HealthBadge)
- New untested components: HeartbeatBar, Sidebar, Sparkline
- README cites SigNoz as inspiration — should be Uptime Kuma
- README project structure is stale (missing HeartbeatBar, Sidebar, Sparkline)
- README lacks screenshot placeholders

## Plan

### 1. Add HeartbeatBar tests
- [ ] Renders "Heartbeat" label
- [ ] Shows stats (Up count, Degraded/Down when present)
- [ ] Renders 24 heartbeat bars
- [ ] Shows time labels (24h ago / 12h ago / Now)

### 2. Add Sidebar tests
- [ ] Renders app name "SupportOps"
- [ ] Shows "Add Monitor" button
- [ ] Renders all nav items (Dashboard, Status Pages, Settings)
- [ ] Highlights active nav item
- [ ] Calls onAddMonitor callback

### 3. Add Sparkline tests
- [ ] Returns null for empty data
- [ ] Renders SVG with correct dimensions
- [ ] Renders the line path and area fill
- [ ] Renders last-point dot

### 4. Update README
- [ ] Fix source inspiration: SigNoz → Uptime Kuma
- [ ] Add screenshot placeholder section
- [ ] Update project structure listing (add HeartbeatBar, Sidebar, Sparkline)
- [ ] Verify support relevance section

### 5. Verify
- [ ] `npm test` passes with all new tests
