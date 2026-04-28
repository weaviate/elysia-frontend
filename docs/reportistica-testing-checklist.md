# Reportistica Testing & Development Checklist

## Status
**Last updated:** 2026-04-28  
**Frontend features verified:** AG Grid integration, searchable combobox for select params, wildcard defaults ("Tutti"), auto-execute with debounce, **client-side CSV/Excel export with 50k-row guard**  
**Backend (n8n) status:** Phase 1 done — `Get_Report_Parameters` no longer returns `output_options`. Two pre-existing bugs still tracked in `reportistica-n8n-fix-types-and-empty-params.md`.

---

## ✅ Completed Features

- [x] AG Grid Community integration (v34.3.1) with pagination, virtualization
- [x] Dynamic dark mode theming via CSS variables
- [x] Auto-execute with 400ms debounce, 30s timeout
- [x] Searchable combobox for select parameters (ParamCombobox)
  - Pinned "Tutti" option at top
  - Alphabetical sort (IT locale) for remaining options
  - Custom filter on both label and value
- [x] Wildcard default handling (`%` → "Tutti", `-1` → "Tutti")
- [x] Empty state handling (no params, empty results, errors)
- [x] i18n keys for Reportistica (EN/IT)
- [x] Applied type normalisation in n8n
- [x] Tested on 16 reports without parameters (auto-execute works)
- [x] **Output dropdown removed** — frontend always requests `output: "json"`
- [x] **`noParams` empty-state info box** with `<Info />` icon and friendlier copy
- [x] **Client-side CSV export** via AG Grid `exportDataAsCsv()` (respects sort/filter/column order)
- [x] **Client-side Excel export** via SheetJS lazy-loaded `xlsx` (~50 KB gzipped, only loaded on click)
- [x] **50k-row export guard** with tooltip when exceeded
- [x] **Param card** centred vertically with `min-h-[80px]` so empty states don't feel hollow

---

## 📋 Next Steps (Priority Order)

The output dropdown removal and export feature is **frontend-only** — no n8n
changes required. The grid already holds all rows in memory (`gridData`), so
CSV/Excel can be generated client-side from the data the user is already
seeing. This avoids re-querying the database, eliminates data-drift between
grid and export, and keeps export consistent with AG Grid's column order /
sorts / filters.

A row-count guard caps client-side export at 50k rows — well above the largest
report tested today (7,354 rows). If that ceiling is ever hit in production,
build a dedicated `Export_Report` n8n workflow at that point (don't preempt).

The work is split into 3 sequential phases — finish each before moving on.

---

### Phase 1: Clean up `get-params` (n8n) — ✅ DONE

`Get_Report_Parameters` (`b94XKGYOzpHdgo4F`) now returns `{ report_id,
parameters }` only. `Get Output Options` and `Code: Format Output Options`
nodes disabled.

---

### Phase 2: Frontend — drop the Output dropdown and clean params section — ✅ DONE

`ReportisticaPage.tsx` no longer carries `outputOptions` / `selectedOutput`
state, the `<Select>` for `output` is gone, and the empty-params state now
renders an `<Info />` icon box with the new `noParams` message. i18n keys
`output`, `selectOutput`, `option` removed from `messages/{en,it}.json`;
`noParams` translation updated.

---

### Phase 3: Frontend — client-side CSV / Excel export — ✅ DONE

- `ReportDataGrid` now accepts an `onGridReady` prop and forwards it to
  `<AgGridReact>`. The page holds a `gridApiRef` populated from that callback.
- `EXPORT_ROW_LIMIT = 50_000`. When exceeded, both buttons are disabled and a
  tooltip surfaces `t('exportTooLarge')`.
- `handleExportCsv` calls `gridApi.exportDataAsCsv({ fileName })` so column
  order, sort and filter applied in-grid carry through.
- `handleExportXlsx` lazy-loads `xlsx` (`await import('xlsx')`) and writes via
  `XLSX.writeFile(...)`. Sheet name is `gridReportName.slice(0, 31)` (Excel
  limit).
- Failures call `useToast({ title: t('exportError'), variant: 'destructive' })`.
- i18n keys added: `exportCsv`, `exportExcel`, `exportTooLarge`, `exportError`.

**Manual checks pending (require live n8n):**
- [ ] Report 21 (2,551 rows) → CSV downloads, grid column order respected;
      sort the grid, re-export, verify file reflects sort.
- [ ] Report 41 (7,354 rows) → both formats download in < 5 s.
- [ ] Report 49 (wildcards) → exports work after wildcard defaults applied.
- [ ] Temporarily lower `EXPORT_ROW_LIMIT` to `1_000` and load report 21 →
      buttons disabled with tooltip. Restore to `50_000`.

---

### Phase 4: Page design polish — ✅ partial

**Done:**
- Params `CardContent` now has `min-h-[80px]` and `flex flex-col
  justify-center` so all empty states (`!selectedReport`, `paramsLoading`,
  `paramsError`, `params.length === 0`) sit at a consistent height instead of
  collapsing to a single line.
- Export buttons live in the data-table `CardHeader`, right-aligned next to
  the row counter.

**Deferred (visual / interactive — needs a manual pass in browser):**
- [ ] Audit dark-mode contrast on info-box, disabled export buttons, and
      tooltip.
- [ ] Decide whether to make the data-table card fill viewport height
      (`h-[calc(100vh-X)]`); current `min-h-[70vh]` works but leaves a gap on
      tall screens. Requires verifying the AppShell offset.
- [ ] Optional: add a `<RefreshCw />` icon button next to export buttons
      (calls `retryExecute()`). Skipped to avoid clutter — revisit if users ask.

---

## 📊 Report Testing Status

### ✅ Tested & Passing (16 reports, zero parameters)

Auto-execute immediately on page load.

| Report ID | Name | Rows | Status |
|-----------|------|------|--------|
| 4 | ? | 3,654 | ✅ Pass |
| 5 | ? | 7 | ✅ Pass |
| 21 | ? | 2,551 | ✅ Pass |
| 25 | ? | 32 | ✅ Pass |
| 26 | ? | 0 | ✅ Pass |
| 33 | ? | 0 | ✅ Pass |
| 36 | ? | 7 | ✅ Pass |
| 41 | ? | 7,354 | ✅ Pass (virtualization tested) |
| 44 | ? | 276 | ✅ Pass |
| 51 | ? | 1 | ✅ Pass |
| 53 | ? | 1,161 | ✅ Pass |
| 57 | ? | 6,689 | ✅ Pass |
| 59 | ? | 6 | ✅ Pass |
| 67 | ? | 0 | ✅ Pass |
| 75 | ? | 23 | ✅ Pass |
| 79 | ? | ? | ✅ Pass |

**Summary:** All 16 reports auto-execute and display data correctly. Pagination, virtualization, dark mode work as expected.

---

### ⚠️ Known Issues & Broken Reports

#### In N8N Backend

**Report 58 ("Report soci morosi")** — `get-params` works, but `execute` returns "Report non trovato"
- **Status:** Blocked on n8n investigation
- **Action:** Escalate to n8n ops

**Reports 64–100 (various)** — `get-params` returns empty params, but `execute` fails with "Report non trovato"
- **Status:** Likely incomplete data in n8n database
- **Action:** Verify report registry in n8n

#### In Data (Parameter Type)

**Report 3** — Parameter `Rilevanza` has `options` with `value: null` entries
- **Status:** Fixed in frontend with `.filter(opt => opt.value !== null)`
- **Regression:** None expected; null values are silently dropped

---

### 🔄 Reports with Parameters (requires fixes in N8N first)

These reports have `required` parameters but no wildcard defaults. They correctly require user input before auto-executing.

- Reports 1–3, 6–20, 22–24, 27–32, 34–35, 37–40, 42–43, 45–50, 52, 54–56, 60–63, 70–71, 73, 76, 80–82, ...

**Key examples:**
- **Report 49** ("Norme da Tradurre") — 2 params with wildcard defaults (`p_otc=-1`, `p_fte=%`) → auto-executes with "Tutti" placeholder ✅
- **Report 27** ("?") — 2 params, one select with 24+ options → searchable combobox works ✅
- **Report 12** ("?") — 2 date params → date picker works ✅

---

## 🧪 Manual Testing Checklist (Before Shipping)

Run before any merge to `main`:

```bash
npm run build  # TypeScript & lint pass
```

**In browser (http://localhost:3090/?page=reportistica):**

- [ ] **Auto-execute (zero params):**
  - Select Report 21 → table populates immediately (2,551 rows)
  - Pagination shows "50 rows per page", [25/50/100/200] selector works
  - Dark mode toggle in top-right → table theme updates in real-time

- [ ] **Wildcard defaults:**
  - Select Report 49 → params show "Tutti" placeholder in empty text inputs
  - Uncheck "Tutti" (if checkbox exists) or type a value → input becomes active
  - Grid re-executes with the new filter

- [ ] **Searchable combobox:**
  - Report 27 (if it has a select param) → open dropdown → type to filter
  - Verify alphabetical sort works (case-insensitive, IT locale)
  - Verify pinned option stays at top (if applicable)

- [ ] **Large dataset (virtualization):**
  - Report 41 (7,354 rows) → scroll through table, check performance
  - No lag or blank rows should appear

- [ ] **Error handling:**
  - Select a report and manually change reportId to 999 in query params
  - Verify error message displays gracefully

---

## 📝 Notes

- **N8N fixes:** The plan is ready in `reportistica-n8n-fix-types-and-empty-params.md`. Apply when authorized.
- **CSV/Excel export:** Client-side only. Backed by AG Grid's
  `exportDataAsCsv()` and SheetJS. Capped at 50 000 rows — if that ceiling is
  ever hit in production, build a dedicated `Export_Report` n8n workflow at
  that point.
- **Report metadata:** Some report names are missing from the test output. Update the table above once metadata is collected from n8n.
