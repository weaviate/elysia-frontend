# Piano: Preview + "Genera Report" nella Reportistica

> Branch: `feat/02-edit-result-display` · Worktree: `.worktrees/reportistica-aggrid`
> Piano sorgente: `~/.claude/plans/crea-un-worktree-in-valiant-tarjan.md`

## Context

Oggi nella pagina Reportistica (`app/pages/ReportisticaPage.tsx`), appena l'utente seleziona un report e completa i parametri obbligatori, parte automaticamente l'esecuzione **completa** del report (POST `/n8n/webhook/execute`, debounce 400ms). Per query pesanti questo è costoso e può sorprendere l'utente che sta ancora "esplorando".

Vogliamo invece un flusso a due step:

1. **Preview automatica** delle prime 100 righe (2 pagine da 50) appena i parametri obbligatori sono compilati — etichettata chiaramente come tale.
2. **Esecuzione completa** solo quando l'utente clicca esplicitamente **"Genera Report"**.

Una volta in modalità Full, qualsiasi cambio di parametro ri-esegue il report completo (l'utente ha già acconsentito al costo). Il bottone diventa **"Rigenera Report"** con stile meno enfatico.

---

## Step 1 — Costanti e stato in `ReportisticaPage.tsx`

**File:** `app/pages/ReportisticaPage.tsx`

### Nuove costanti (vicino a riga 33–40)

```ts
const PREVIEW_ROW_LIMIT = 100;
const PREVIEW_PAGE_SIZE = 50; // 2 pagine × 50 = 100
```

### Nuovo stato (intorno a riga 61–92)

- `viewMode: 'preview' | 'full'` (default `'preview'`)
- `generatingFull: boolean` (loading specifico del bottone)

`executing` rimane per la preview auto-eseguita. `gridRowCount` continua a riflettere il numero di righe attualmente in tabella.

### Reset

Quando cambia `selectedReport` (useEffect esistente intorno a riga 206), resettare `viewMode = 'preview'` e `generatingFull = false`.

---

## Step 2 — Refactor della funzione execute

L'auto-execute attuale (useEffect riga 300–384) viene estratto in una funzione riutilizzabile:

```ts
const executeReport = useCallback(async (mode: 'preview' | 'full') => {
  // ...stesso flusso attuale, con due differenze:
  const body = {
    reportId,
    params,
    output: 'json',
    ...(mode === 'preview' ? { limit: PREVIEW_ROW_LIMIT } : {}),
  };
  // ...fetch
  let rows = response.data ?? [];
  if (mode === 'preview' && rows.length > PREVIEW_ROW_LIMIT) {
    rows = rows.slice(0, PREVIEW_ROW_LIMIT); // safety net frontend
  }
  setGridData(rows);
  setGridRowCount(rows.length);
  setViewMode(mode);
}, [/* deps */]);
```

**Loading state separato:**
- mode === 'preview' → setta/resetta `executing`
- mode === 'full' → setta/resetta `generatingFull`

**Auto-execute useEffect** ora chiama `executeReport(viewMode)` (preview di default; full se l'utente è già passato in full).

```ts
useEffect(() => {
  if (!selectedReport || !requiredFilled) return;
  const handle = setTimeout(() => {
    executeReport(viewMode);
  }, EXECUTE_DEBOUNCE_MS);
  return () => clearTimeout(handle);
}, [formSignature, requiredFilled, executeKey, viewMode, executeReport]);
```

---

## Step 3 — Bottone "Genera Report" / "Rigenera Report"

**Posizione:** nel `CardHeader` del grid (riga 625–680), nel gruppo flex destro insieme agli export.

**Ordine (sx → dx):** [badge "Preview · 100 righe" | spazio | bottone Genera/Rigenera | Export CSV | Export Excel]

```tsx
<Button
  variant={viewMode === 'preview' ? 'default' : 'outline'}
  size="sm"
  onClick={() => executeReport('full')}
  disabled={!selectedReport || !requiredFilled || executing || generatingFull}
>
  {generatingFull ? (
    <>
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="ml-1.5">{t('generatingReport')}</span>
    </>
  ) : (
    <>
      <Play className="h-4 w-4" />
      <span className="ml-1.5">
        {viewMode === 'preview' ? t('generateReport') : t('regenerateReport')}
      </span>
    </>
  )}
</Button>
```

**Stato visivo:**
- **Preview attiva** → `variant="default"` (colore primario, azione consigliata) — "Genera Report"
- **Full attivo** → `variant="outline"` (più discreto) — "Rigenera Report"
- **Loading** → spinner + "Generazione..." + disabled

**Comportamento "mantieni preview + spinner":** durante `generatingFull`, NON tocchiamo `gridData`; lo aggiorniamo solo dopo che la response è arrivata. L'utente continua a vedere la preview sotto il bottone caricato.

---

## Step 4 — Badge "Preview"

A sinistra del CardHeader del grid (sostituisce/affianca il `rowsLoaded` esistente alla riga 637–639).

```tsx
{viewMode === 'preview' && gridRowCount > 0 && (
  <span className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/40 px-2 py-1 text-xs font-medium text-secondary">
    <Eye className="h-3.5 w-3.5" />
    {t('previewBadge', { count: gridRowCount })}
  </span>
)}
{viewMode === 'full' && gridRowCount > 0 && (
  <span className="text-secondary text-xs">
    {t('rowsLoaded', { count: gridRowCount.toLocaleString() })}
  </span>
)}
```

Stile coerente con il pattern esistente (`bg-muted/40`, `border-border/60`, `text-secondary`) usato già nei vari "info box" della pagina.

---

## Step 5 — Export disabilitato in Preview

Modificare i bottoni Export (riga 645–680). Aggiungere alla `disabled` prop:

```ts
disabled={... || viewMode === 'preview'}
```

E avvolgere ogni bottone in un `Tooltip` (pattern shadcn già usato altrove nella pagina) con messaggio:

```
t('exportInPreviewDisabled')
// IT: "Genera il report completo prima di esportare"
// EN: "Generate the full report before exporting"
```

---

## Step 6 — Pagination del grid in Preview

**File:** `app/components/reportistica/ReportDataGrid.tsx`

Attuale: `paginationPageSize={50}`, `paginationPageSizeSelector={[25, 50, 100, 200]}` (righe 114–115).

In Preview, 100 righe / 50 per pagina = 2 pagine, già allineato al requisito. **Nessuna modifica obbligatoria** al `ReportDataGrid`.

Opzionale: passare un nuovo prop `pageSize?: number` per forzare 50 in preview. Da valutare durante implementazione.

---

## Step 7 — Traduzioni i18n

**File:** `messages/it.json` e `messages/en.json` (namespace `reportistica`).

Nuove chiavi:

| Chiave | IT | EN |
|---|---|---|
| `previewBadge` | "Preview · {count} righe" | "Preview · {count} rows" |
| `generateReport` | "Genera Report" | "Generate Report" |
| `regenerateReport` | "Rigenera Report" | "Regenerate Report" |
| `generatingReport` | "Generazione…" | "Generating…" |
| `exportInPreviewDisabled` | "Genera il report completo prima di esportare" | "Generate the full report before exporting" |

---

## File critici da modificare

| File | Cambiamento |
|---|---|
| `app/pages/ReportisticaPage.tsx` | Stato, executeReport refactor, bottone, badge, export disabled |
| `app/components/reportistica/ReportDataGrid.tsx` | (opzionale) prop `pageSize` |
| `messages/it.json` | 5 nuove chiavi sotto `reportistica` |
| `messages/en.json` | 5 nuove chiavi sotto `reportistica` |

Nessun nuovo file di componente: il bottone e il badge sono inline nella page.

---

## Compatibilità backend

Il piano invia `limit: 100` nel POST `/n8n/webhook/execute`. **Il workflow n8n potrebbe non onorarlo** (non risulta documentato). Lo slice frontend è la safety net che garantisce comunque max 100 righe in Preview. Se il backend ignora `limit`, l'unico costo è che la query SQL gira completa anche in Preview — ma la UX rimane corretta. Se in futuro si vuole risparmiare anche al DB, basta aggiornare il workflow n8n perché legga `body.limit`.

---

## Verifica end-to-end

```bash
# Da .worktrees/reportistica-aggrid:
npm run lint
npm run build       # deve passare (requisito CLAUDE.md)
npm run dev:server  # parte su :3090
```

**Test manuali nel browser:**

1. Login con `demo@uni.local` / `demo123`.
2. Naviga in Reportistica.
3. **Preview path:** Seleziona categoria → seleziona report → compila required params → entro ~400ms parte la preview. Verifica:
   - Badge **"Preview · 100 righe"** appare in alto a sinistra del grid (o meno se il report ha <100 righe — in quel caso badge mostra il count effettivo).
   - Grid mostra al massimo 100 righe su 2 pagine da 50.
   - Bottoni Export CSV/Excel disabilitati con tooltip "Genera il report completo prima di esportare".
   - Bottone **"Genera Report"** visibile, stile primario (`variant="default"`).
4. **Full path:** Click su "Genera Report".
   - Bottone diventa spinner + "Generazione…", disabled.
   - Grid continua a mostrare la preview (non si svuota).
   - A fine fetch: badge sparisce, appare contatore `"X righe caricate"`, bottoni Export abilitati, bottone diventa "Rigenera Report" con `variant="outline"`.
5. **Param change in Full:** Cambia un parametro → ri-parte automaticamente l'esecuzione completa (no fallback a preview), bottone resta "Rigenera Report".
6. **Cambio report:** Selezionando un altro report dalla tendina, lo stato torna a `viewMode='preview'` e parte la nuova preview.
7. **Network tab:** verifica che la POST a `/n8n/webhook/execute` in preview abbia `"limit": 100` nel body, e in full no.
8. **Edge case:** Report che ritorna meno di 100 righe → badge mostra il count reale, comunque in modalità Preview, "Genera Report" comunque cliccabile (e sovrascrive con stessi dati).
9. **Edge case:** Errore di rete in Full → la preview deve restare visibile, mostrare errore tramite toast esistente.

Nessun test automatico richiesto (`npm test` esegue solo lint).
