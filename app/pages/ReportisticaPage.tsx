"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { FileSpreadsheet, FileText, Info, Loader2 } from "lucide-react";
import type { GridApi, GridReadyEvent } from "ag-grid-community";
import ReportDataGrid from "@/app/components/reportistica/ReportDataGrid";
import ParamCombobox from "@/app/components/reportistica/ParamCombobox";
import { useToast } from "@/hooks/useToast";

const CATEGORIES_URL = "/n8n/webhook/get-categories";
const REPORTS_URL = "/n8n/webhook/get-reports";
const PARAMS_URL = "/n8n/webhook/get-params";
const EXECUTE_URL = "/n8n/webhook/execute";
const FETCH_TIMEOUT_MS = 30_000;
const EXECUTE_DEBOUNCE_MS = 400;
const EXPORT_ROW_LIMIT = 50_000;
const WILDCARD_DEFAULTS = ["%", "-1"] as const;

const isWildcardDefault = (def: string | null | undefined): boolean =>
  def !== null && def !== undefined &&
  WILDCARD_DEFAULTS.includes(def as (typeof WILDCARD_DEFAULTS)[number]);

interface ParamOption {
  value: string;
  label: string;
}

interface ReportParam {
  name: string;
  label: string;
  type: "select" | "text" | "date" | "number";
  required: boolean;
  default: string | null;
  order: number;
  options: ParamOption[] | null;
}

export default function ReportisticaPage() {
  const t = useTranslations("reportistica");
  const tc = useTranslations("common");
  const { toast } = useToast();
  const gridApiRef = useRef<GridApi | null>(null);
  const [exporting, setExporting] = useState<"csv" | "xlsx" | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [reports, setReports] = useState<Array<{ id: number; report_name: string; report_description: string }>>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);
  const [reportsFetchKey, setReportsFetchKey] = useState(0);

  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [params, setParams] = useState<ReportParam[]>([]);
  const [paramsLoading, setParamsLoading] = useState(false);
  const [paramsError, setParamsError] = useState<string | null>(null);
  const [paramsFetchKey, setParamsFetchKey] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const [executing, setExecuting] = useState(false);
  const [executeError, setExecuteError] = useState<string | null>(null);
  const [gridColumns, setGridColumns] = useState<string[]>([]);
  const [gridData, setGridData] = useState<Record<string, unknown>[]>([]);
  const [gridReportName, setGridReportName] = useState<string>("");
  const [gridRowCount, setGridRowCount] = useState<number>(0);
  const [executeKey, setExecuteKey] = useState(0);

  const retryCategories = useCallback(() => {
    setFetchKey((k) => k + 1);
  }, []);

  const retryReports = useCallback(() => {
    setReportsFetchKey((k) => k + 1);
  }, []);

  const retryParams = useCallback(() => {
    setParamsFetchKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    setCategoriesLoading(true);
    setCategoriesError(null);

    fetch(CATEGORIES_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (!text) throw new Error(t('emptyResponse'));
        const parsed = JSON.parse(text);
        // Normalizza: accetta sia { categories: [...] } / [{ categories: [...] }]
        // sia il formato n8n con chiavi numeriche: [{ "1": "Cat A", "2": "Cat B" }]
        const raw = Array.isArray(parsed) ? parsed[0] : parsed;
        if (raw?.categories && Array.isArray(raw.categories)) {
          return (raw.categories as string[]).map((c) => ({ id: c, name: c }));
        }
        // Formato n8n: chiavi numeriche = ID categoria → preserva la mappatura
        return Object.entries(raw ?? {}).map(([id, name]) => ({ id, name: name as string }));
      })
      .then((cats) => {
        if (!cancelled) {
          setCategories(cats);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          if (err.name === "AbortError") {
            setCategoriesError(t('timeout'));
          } else {
            setCategoriesError(err.message);
          }
        }
      })
      .finally(() => {
        clearTimeout(timeout);
        if (!cancelled) setCategoriesLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timeout);
    };
  }, [fetchKey]);

  useEffect(() => {
    if (!selectedCategory) {
      setReports([]);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    setReportsLoading(true);
    setReportsError(null);

    const url = `${REPORTS_URL}?category=${encodeURIComponent(selectedCategory)}`;

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (!text) throw new Error(t('emptyResponse'));
        return JSON.parse(text) as { reports: Array<{ id: number; report_name: string; report_description: string }> };
      })
      .then((data) => {
        if (!cancelled) {
          setReports(data?.reports ?? []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          if (err.name === "AbortError") {
            setReportsError(t('timeout'));
          } else {
            setReportsError(err.message);
          }
        }
      })
      .finally(() => {
        clearTimeout(timeout);
        if (!cancelled) setReportsLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timeout);
    };
  }, [selectedCategory, reportsFetchKey]);

  useEffect(() => {
    if (!selectedReport) {
      setParams([]);
      setFormValues({});
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    setParamsLoading(true);
    setParamsError(null);

    const url = `${PARAMS_URL}?reportId=${encodeURIComponent(selectedReport)}`;

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (!text) throw new Error(t('emptyResponse'));
        const parsed = JSON.parse(text);
        return (Array.isArray(parsed) ? parsed[0] : parsed) as {
          report_id: number;
          parameters: ReportParam[];
        };
      })
      .then((data) => {
        if (!cancelled) {
          const p = data?.parameters ?? [];
          setParams(p);
          // Per i param "wildcard" (default %, -1) lasciamo l'input vuoto:
          // l'utente vede placeholder "Tutti", e al submit sostituiamo col jolly.
          const defaults: Record<string, string> = {};
          p.forEach((param) => {
            if (param.default && !isWildcardDefault(param.default)) {
              defaults[param.name] = param.default;
            }
          });
          setFormValues(defaults);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          if (err.name === "AbortError") {
            setParamsError(t('timeout'));
          } else {
            setParamsError(err.message);
          }
        }
      })
      .finally(() => {
        clearTimeout(timeout);
        if (!cancelled) setParamsLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timeout);
    };
  }, [selectedReport, paramsFetchKey]);

  const updateFormValue = useCallback((name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Reset grid data when the selected report changes
  useEffect(() => {
    setGridColumns([]);
    setGridData([]);
    setGridReportName("");
    setGridRowCount(0);
    setExecuteError(null);
  }, [selectedReport]);

  const requiredFilled =
    !!selectedReport &&
    !paramsLoading &&
    !paramsError &&
    params.every((p) => {
      if (!p.required) return true;
      // Param required ma con default jolly: vuoto è considerato "Tutti" → ok
      if (isWildcardDefault(p.default)) return true;
      return (formValues[p.name] ?? "").toString().length > 0;
    });

  const formSignature = useMemo(
    () => JSON.stringify({ id: selectedReport, v: formValues }),
    [selectedReport, formValues]
  );

  // Auto-execute the report once selection + required params are complete.
  useEffect(() => {
    if (!selectedReport || !requiredFilled) {
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const debounce = setTimeout(() => {
      setExecuting(true);
      setExecuteError(null);

      // Per i param con default jolly (%, -1) sostituisci l'input vuoto
      // col jolly atteso dal backend.
      const submitParams: Record<string, string> = { ...formValues };
      params.forEach((p) => {
        if (
          isWildcardDefault(p.default) &&
          (submitParams[p.name] ?? "").length === 0
        ) {
          submitParams[p.name] = p.default as string;
        }
      });

      fetch(EXECUTE_URL, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: Number(selectedReport),
          params: submitParams,
          output: "json",
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.text();
        })
        .then((text) => {
          if (!text) throw new Error(t("emptyResponse"));
          const parsed = JSON.parse(text);
          const body = Array.isArray(parsed) ? parsed[0] : parsed;
          if (!body || body.success === false) {
            throw new Error(body?.error || t("executeError"));
          }
          if (!cancelled) {
            setGridColumns(Array.isArray(body.columns) ? body.columns : []);
            setGridData(Array.isArray(body.data) ? body.data : []);
            setGridReportName(body.reportName ?? "");
            setGridRowCount(
              typeof body.rowCount === "number"
                ? body.rowCount
                : Array.isArray(body.data)
                  ? body.data.length
                  : 0
            );
          }
        })
        .catch((err) => {
          if (cancelled) return;
          if (err.name === "AbortError") {
            setExecuteError(t("timeout"));
          } else {
            setExecuteError(err.message || t("executeError"));
          }
          setGridColumns([]);
          setGridData([]);
          setGridRowCount(0);
        })
        .finally(() => {
          clearTimeout(timeout);
          if (!cancelled) setExecuting(false);
        });
    }, EXECUTE_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timeout);
      clearTimeout(debounce);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formSignature, requiredFilled, executeKey]);

  const retryExecute = useCallback(() => {
    setExecuteKey((k) => k + 1);
  }, []);

  const handleGridReady = useCallback((event: GridReadyEvent) => {
    gridApiRef.current = event.api;
  }, []);

  const exportFileBase = useMemo(() => {
    const date = new Date().toISOString().slice(0, 10);
    return `report_${selectedReport ?? "unknown"}_${date}`;
  }, [selectedReport]);

  const handleExportCsv = useCallback(() => {
    if (!gridApiRef.current || gridData.length === 0) return;
    setExporting("csv");
    try {
      gridApiRef.current.exportDataAsCsv({
        fileName: `${exportFileBase}.csv`,
      });
    } catch (err) {
      toast({
        title: t("exportError"),
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setExporting(null);
    }
  }, [exportFileBase, gridData.length, t, toast]);

  const handleExportXlsx = useCallback(async () => {
    if (gridData.length === 0) return;
    setExporting("xlsx");
    try {
      const XLSX = await import("xlsx");
      const ws = XLSX.utils.json_to_sheet(gridData, { header: gridColumns });
      const wb = XLSX.utils.book_new();
      const sheetName = (gridReportName || "Report").slice(0, 31);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      XLSX.writeFile(wb, `${exportFileBase}.xlsx`);
    } catch (err) {
      toast({
        title: t("exportError"),
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setExporting(null);
    }
  }, [exportFileBase, gridColumns, gridData, gridReportName, t, toast]);

  const exportTooLarge = gridRowCount > EXPORT_ROW_LIMIT;
  const exportDisabled =
    !selectedReport ||
    executing ||
    gridData.length === 0 ||
    exportTooLarge ||
    exporting !== null;

  const renderParam = (param: ReportParam) => {
    const wildcardPlaceholder = isWildcardDefault(param.default)
      ? t('allValues')
      : undefined;
    switch (param.type) {
      case "select":
        return (
          <ParamCombobox
            value={formValues[param.name] || undefined}
            onChange={(v) => updateFormValue(param.name, v)}
            placeholder={t('select')}
            pinnedValue={param.default ?? undefined}
            pinnedLabel={
              isWildcardDefault(param.default) ? t('allValues') : undefined
            }
            options={(param.options ?? [])
              .filter((opt) => opt.value !== null && opt.value !== undefined)
              .map((opt) => ({
                value: opt.value,
                label: opt.label ?? opt.value,
              }))}
          />
        );
      case "date":
        return (
          <Input
            type="date"
            value={formValues[param.name] ?? ""}
            onChange={(e) => updateFormValue(param.name, e.target.value)}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={formValues[param.name] ?? ""}
            placeholder={wildcardPlaceholder}
            onChange={(e) => updateFormValue(param.name, e.target.value)}
          />
        );
      default:
        return (
          <Input
            type="text"
            value={formValues[param.name] ?? ""}
            placeholder={wildcardPlaceholder}
            onChange={(e) => updateFormValue(param.name, e.target.value)}
          />
        );
    }
  };

  return (
    <div
      className="flex flex-col w-full gap-4 items-start justify-start"
      tabIndex={0}
    >
      <p className="text-primary text-xl font-heading font-bold">
        {t('title')}
      </p>

      {/* Riga superiore: 2 Select + Form dinamica */}
      <div className="flex flex-row gap-4 w-full">
        <Card className="w-[220px] shrink-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t('reportCategory')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Select disabled={categoriesLoading || !!categoriesError} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    categoriesLoading
                      ? t('loading')
                      : categoriesError
                        ? t('loadError')
                        : t('select')
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categoriesError && (
              <div className="flex flex-col gap-1">
                <p className="text-destructive text-xs">{categoriesError}</p>
                <Button variant="outline" size="sm" onClick={retryCategories}>
                  {tc('retry')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="w-[220px] shrink-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t('reportName')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Select disabled={!selectedCategory || reportsLoading || !!reportsError} onValueChange={setSelectedReport}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !selectedCategory
                      ? t('selectCategory')
                      : reportsLoading
                        ? t('loading')
                        : reportsError
                          ? t('loadError')
                          : t('select')
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {reports.map((report) => (
                  <SelectItem key={report.id} value={String(report.id)}>
                    {report.report_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {reportsError && (
              <div className="flex flex-col gap-1">
                <p className="text-destructive text-xs">{reportsError}</p>
                <Button variant="outline" size="sm" onClick={retryReports}>
                  {tc('retry')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t('parameters')}</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[80px] flex flex-col justify-center">
            {!selectedReport ? (
              <p className="text-secondary text-sm">
                {t('selectReport')}
              </p>
            ) : paramsLoading ? (
              <p className="text-secondary text-sm">{t('loadingParams')}</p>
            ) : paramsError ? (
              <div className="flex flex-col gap-1">
                <p className="text-destructive text-xs">{paramsError}</p>
                <Button variant="outline" size="sm" onClick={retryParams}>
                  {tc('retry')}
                </Button>
              </div>
            ) : params.length === 0 ? (
              <div className="flex flex-row items-center gap-2 rounded-md border border-border/60 bg-muted/40 px-3 py-2 text-sm text-secondary">
                <Info className="h-4 w-4 shrink-0 opacity-70" />
                <span>{t('noParams')}</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {params.map((param) => (
                  <div key={param.name} className="flex flex-col gap-1.5">
                    <Label>
                      {param.label}
                      {!!param.required && <span className="text-destructive ml-0.5">*</span>}
                    </Label>
                    {renderParam(param)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Riga inferiore: Tabella grande */}
      <Card className="min-h-[70vh] w-full">
        <CardHeader className="pb-2">
          <div className="flex flex-row items-center justify-between gap-3">
            <CardTitle className="text-sm">
              {t('dataTable')}
              {gridReportName && (
                <span className="text-secondary font-normal ml-2">
                  — {gridReportName}
                </span>
              )}
            </CardTitle>
            <div className="flex flex-row items-center gap-3">
              {gridData.length > 0 && (
                <span className="text-secondary text-xs">
                  {t('rowsLoaded', { count: gridRowCount.toLocaleString() })}
                </span>
              )}
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportCsv}
                        disabled={exportDisabled}
                      >
                        {exporting === "csv" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                        <span className="ml-1.5">{t('exportCsv')}</span>
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {exportTooLarge && (
                    <TooltipContent>{t('exportTooLarge')}</TooltipContent>
                  )}
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportXlsx}
                        disabled={exportDisabled}
                      >
                        {exporting === "xlsx" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <FileSpreadsheet className="h-4 w-4" />
                        )}
                        <span className="ml-1.5">{t('exportExcel')}</span>
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {exportTooLarge && (
                    <TooltipContent>{t('exportTooLarge')}</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          {!selectedReport ? (
            <p className="text-secondary text-sm">{t('selectReportToView')}</p>
          ) : !requiredFilled && !executing && gridData.length === 0 ? (
            <p className="text-secondary text-sm">{t('fillRequiredParams')}</p>
          ) : executeError ? (
            <div className="flex flex-col gap-2 items-start">
              <p className="text-destructive text-sm">{executeError}</p>
              <Button variant="outline" size="sm" onClick={retryExecute}>
                {tc('retry')}
              </Button>
            </div>
          ) : executing && gridData.length === 0 ? (
            <p className="text-secondary text-sm">{t('executing')}</p>
          ) : gridData.length === 0 ? (
            <p className="text-secondary text-sm">{t('noRows')}</p>
          ) : (
            <ReportDataGrid
              columns={gridColumns}
              data={gridData}
              loading={executing}
              onGridReady={handleGridReady}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
