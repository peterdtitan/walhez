"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORY_LABELS, TYPE_LABELS } from "@/lib/report-options";
import { formatCurrency } from "@/lib/formatting";
import ReportPdfButton from "./ReportPdfButton";

const RANGE_OPTIONS = [
  { value: "7_DAYS", label: "Past 7 days" },
  { value: "1_MONTH", label: "1 month" },
  { value: "3_MONTHS", label: "3 months" },
  { value: "CUSTOM", label: "Custom range" },
];

function SummaryCard({ label, value, note, accent }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9c3d2b]">
        {label}
      </p>
      <p className={`mt-3 text-3xl font-semibold ${accent}`}>{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{note}</p>
    </div>
  );
}

function formatDateInput(date) {
  return date.toISOString().slice(0, 10);
}

function shiftMonths(date, monthCount) {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() - monthCount);
  return nextDate;
}

function subtractDays(date, dayCount) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() - dayCount);
  return nextDate;
}

function withinRange(date, startDate, endDate) {
  return date >= startDate && date <= endDate;
}

function getDateKey(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function formatDateLabel(value) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function OperationsReport({
  report,
  pdfMode = false,
  initialEquipmentId,
  initialTypeFilter = "ALL",
  initialRangeFilter = "7_DAYS",
  initialCustomStartDate,
  initialCustomEndDate,
}) {
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(
    initialEquipmentId || report.equipment[0]?.id || ""
  );
  const [typeFilter, setTypeFilter] = useState(initialTypeFilter);
  const [rangeFilter, setRangeFilter] = useState(initialRangeFilter);

  const latestEntryDate = useMemo(() => {
    if (!report.entries.length) {
      return new Date();
    }

    return report.entries.reduce((latest, entry) => {
      const entryDate = new Date(entry.entryDate);
      return entryDate > latest ? entryDate : latest;
    }, new Date(report.entries[0].entryDate));
  }, [report.entries]);

  const [customStartDate, setCustomStartDate] = useState(
    initialCustomStartDate || formatDateInput(subtractDays(latestEntryDate, 6))
  );
  const [customEndDate, setCustomEndDate] = useState(
    initialCustomEndDate || formatDateInput(latestEntryDate)
  );

  useEffect(() => {
    if (!selectedEquipmentId && report.equipment[0]?.id) {
      setSelectedEquipmentId(report.equipment[0].id);
    }
  }, [report.equipment, selectedEquipmentId]);

  const activeEquipment = useMemo(
    () =>
      report.equipment.find((equipment) => equipment.id === selectedEquipmentId) ||
      report.equipment[0] ||
      null,
    [report.equipment, selectedEquipmentId]
  );

  const dateWindow = useMemo(() => {
    const endDate = new Date(latestEntryDate);
    endDate.setHours(23, 59, 59, 999);

    if (rangeFilter === "CUSTOM") {
      const startDate = new Date(customStartDate || customEndDate);
      const finalEndDate = new Date(customEndDate || customStartDate);

      startDate.setHours(0, 0, 0, 0);
      finalEndDate.setHours(23, 59, 59, 999);

      return {
        startDate: startDate <= finalEndDate ? startDate : finalEndDate,
        endDate: finalEndDate >= startDate ? finalEndDate : startDate,
      };
    }

    const startDate =
      rangeFilter === "1_MONTH"
        ? shiftMonths(endDate, 1)
        : rangeFilter === "3_MONTHS"
          ? shiftMonths(endDate, 3)
          : subtractDays(endDate, 6);

    startDate.setHours(0, 0, 0, 0);

    return { startDate, endDate };
  }, [customEndDate, customStartDate, latestEntryDate, rangeFilter]);

  const equipmentEntries = useMemo(() => {
    if (!activeEquipment) {
      return [];
    }

    return report.entries.filter((entry) => entry.equipmentId === activeEquipment.id);
  }, [activeEquipment, report.entries]);

  const filteredEntries = useMemo(() => {
    return equipmentEntries.filter((entry) => {
      const entryDate = new Date(entry.entryDate);
      const typeMatches = typeFilter === "ALL" || entry.type === typeFilter;

      return typeMatches && withinRange(entryDate, dateWindow.startDate, dateWindow.endDate);
    });
  }, [dateWindow.endDate, dateWindow.startDate, equipmentEntries, typeFilter]);

  const totals = useMemo(() => {
    return filteredEntries.reduce(
      (accumulator, entry) => {
        if (entry.type === "EXPENSE") {
          accumulator.expense += entry.amount;
        } else {
          accumulator.income += entry.amount;
        }

        return accumulator;
      },
      { expense: 0, income: 0, net: 0 }
    );
  }, [filteredEntries]);

  totals.net = totals.income - totals.expense;

  const categoryTotals = useMemo(() => {
    const totalsMap = new Map();

    for (const entry of filteredEntries) {
      const current = totalsMap.get(entry.category) || {
        category: entry.category,
        label: entry.categoryLabel,
        type: entry.type,
        total: 0,
      };

      current.total += entry.amount;
      totalsMap.set(entry.category, current);
    }

    return [...totalsMap.values()].sort((left, right) => right.total - left.total);
  }, [filteredEntries]);

  const rangeLabel = useMemo(() => {
    return `${dateWindow.startDate.toLocaleDateString("en-GB")} - ${dateWindow.endDate.toLocaleDateString("en-GB")}`;
  }, [dateWindow.endDate, dateWindow.startDate]);

  const dateGroups = useMemo(() => {
    const groups = new Map();

    for (const entry of filteredEntries) {
      const dateKey = getDateKey(entry.entryDate);
      const current = groups.get(dateKey) || {
        dateKey,
        label: formatDateLabel(entry.entryDate),
        items: [],
      };

      current.items.push(entry);
      groups.set(dateKey, current);
    }

    return [...groups.values()].sort((left, right) =>
      right.dateKey.localeCompare(left.dateKey)
    );
  }, [filteredEntries]);

  const [activeDateKey, setActiveDateKey] = useState("");

  useEffect(() => {
    if (!dateGroups.length) {
      setActiveDateKey("");
      return;
    }

    const hasCurrentDate = dateGroups.some((group) => group.dateKey === activeDateKey);

    if (!hasCurrentDate) {
      setActiveDateKey(dateGroups[0].dateKey);
    }
  }, [activeDateKey, dateGroups]);

  const activeDateGroup = useMemo(() => {
    if (!dateGroups.length) {
      return null;
    }

    return (
      dateGroups.find((group) => group.dateKey === activeDateKey) || dateGroups[0]
    );
  }, [activeDateKey, dateGroups]);

  const pdfHref = useMemo(() => {
    if (!activeEquipment) {
      return "/admin/reports/pdf";
    }

    const params = new URLSearchParams({
      equipmentId: activeEquipment.id,
      type: typeFilter,
      range: rangeFilter,
      startDate: customStartDate,
      endDate: customEndDate,
    });

    return `/admin/reports/pdf?${params.toString()}`;
  }, [activeEquipment, customEndDate, customStartDate, rangeFilter, typeFilter]);

  return (
    <section className={pdfMode ? "bg-white" : "bg-[#f3efe5]"}>
      <div className={`px-4 py-6 md:px-8 ${pdfMode ? "print:px-0" : "md:py-8"}`}>
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
          <div className="relative overflow-hidden bg-[#1e2d44] px-6 py-8 text-white md:px-10 md:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(242,201,76,0.28),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(156,61,43,0.24),_transparent_28%)]" />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#f2c94c]">
                  Operations report
                </p>
                <h1 className="mt-3 text-3xl font-semibold md:text-5xl">
                  {activeEquipment ? activeEquipment.name : "Equipment"} report ledger
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 md:text-base">
                  Review income and expense records for one equipment at a time, then narrow the ledger by rolling date window or a custom range.
                </p>
              </div>

              {!pdfMode ? (
                <div className="flex flex-wrap gap-3 print:hidden">
                  <ReportPdfButton
                    label="Print / Save as PDF"
                    href={pdfHref}
                    className="rounded-full bg-[#f2c94c] px-5 py-3 text-sm font-semibold text-[#1e2d44] transition hover:bg-[#ffd86c]"
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 border-b border-slate-200 bg-[#fffaf0] px-6 py-6 md:grid-cols-2 xl:grid-cols-4 md:px-10">
            <SummaryCard
              label="Total expense"
              value={formatCurrency(totals.expense)}
              note="Filtered preventive, routine, breakdown, and operational spending."
              accent="text-red-700"
            />
            <SummaryCard
              label="Total income"
              value={formatCurrency(totals.income)}
              note="Filtered revenue entries for the selected machine."
              accent="text-green-700"
            />
            <SummaryCard
              label="Net position"
              value={formatCurrency(totals.net)}
              note={`Range: ${rangeLabel}`}
              accent={totals.net >= 0 ? "text-[#1E2D44]" : "text-[#9c3d2b]"}
            />
            <SummaryCard
              label="Entries"
              value={String(filteredEntries.length)}
              note={activeEquipment ? `${activeEquipment.name} • ${activeEquipment.company} ${activeEquipment.model}` : "No equipment records found yet."}
              accent="text-slate-900"
            />
          </div>

          <div className={`grid gap-6 px-6 py-8 md:px-10 ${pdfMode ? "" : "xl:grid-cols-[0.7fr_1.3fr]"}`}>
            {!pdfMode ? (
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9c3d2b]">
                  Equipment list
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Select equipment
                </h2>

                <div className="mt-6 space-y-3">
                  {report.equipment.map((equipment) => {
                    const active = equipment.id === activeEquipment?.id;

                    return (
                      <button
                        key={equipment.id}
                        type="button"
                        onClick={() => setSelectedEquipmentId(equipment.id)}
                        className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                          active
                            ? "border-[#1E2D44] bg-[#102033] text-white"
                            : "border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-300"
                        }`}
                      >
                        <p className="text-lg font-semibold">{equipment.name}</p>
                        <p className={`mt-1 text-sm ${active ? "text-slate-300" : "text-slate-500"}`}>
                          {equipment.company} {equipment.model}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9c3d2b]">
                  Reporting notes
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  What is captured
                </h2>

                <div className="mt-6 grid gap-4">
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-lg font-semibold text-slate-900">{label}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {key === "OPERATIONAL_EXPENSE"
                          ? "Use this for diesel, operator allowances, oil, and other day-to-day running cost items."
                          : key === "PREVENTIVE_MAINTENANCE"
                            ? "Use this for planned maintenance work before failure occurs."
                            : key === "ROUTINE_SERVICING"
                              ? "Use this for normal servicing cycles, fluids, and scheduled workshop checks."
                              : key === "BREAKDOWN_REPAIR"
                                ? "Use this for reactive repair work after an equipment fault or stoppage."
                                : "Use this for money earned from rentals, projects, or other approved income sources."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            ) : null}

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9c3d2b]">
                      Report filters
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                      Equipment ledger
                    </h2>
                  </div>

                  {!pdfMode ? (
                    <div className="grid gap-3 md:grid-cols-3">
                      <select
                        value={typeFilter}
                        onChange={(event) => setTypeFilter(event.target.value)}
                        className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
                      >
                        <option value="ALL">All types</option>
                        <option value="EXPENSE">Expense only</option>
                        <option value="INCOME">Income only</option>
                      </select>
                      <select
                        value={rangeFilter}
                        onChange={(event) => setRangeFilter(event.target.value)}
                        className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
                      >
                        {RANGE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        {rangeLabel}
                      </div>
                    </div>
                  ) : null}

                  {!pdfMode && rangeFilter === "CUSTOM" ? (
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-slate-700">Start date</span>
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(event) => setCustomStartDate(event.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-slate-700">End date</span>
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={(event) => setCustomEndDate(event.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                        />
                      </label>
                    </div>
                  ) : null}
                </div>

                {!pdfMode && dateGroups.length ? (
                  <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
                    {dateGroups.map((group) => {
                      const active = group.dateKey === activeDateGroup?.dateKey;

                      return (
                        <button
                          key={group.dateKey}
                          type="button"
                          onClick={() => setActiveDateKey(group.dateKey)}
                          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                            active
                              ? "border-[#1E2D44] bg-[#102033] text-white"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {group.label}
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                <div className="mt-6 space-y-6">
                  {pdfMode ? (
                    dateGroups.map((group) => (
                      <div key={group.dateKey} className="overflow-hidden rounded-[1.5rem] border border-slate-200">
                        <div className="border-b border-slate-200 bg-[#fffaf0] px-5 py-4">
                          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#9c3d2b]">
                            {group.label}
                          </p>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-left text-sm">
                            <thead className="bg-slate-100 text-xs uppercase tracking-[0.24em] text-slate-500">
                              <tr>
                                <th className="border-b border-slate-200 px-4 py-3">Date</th>
                                <th className="border-b border-slate-200 px-4 py-3">Expense category</th>
                                <th className="border-b border-slate-200 px-4 py-3">Title</th>
                                <th className="border-b border-slate-200 px-4 py-3">Amount</th>
                                <th className="border-b border-slate-200 px-4 py-3">Notes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.items.map((entry, index) => (
                                <tr
                                  key={entry.id}
                                  className={index % 2 === 0 ? "bg-slate-100" : "bg-white"}
                                >
                                  <td className="border-b border-slate-200 px-4 py-4 text-slate-700">
                                    {formatDateLabel(entry.entryDate)}
                                  </td>
                                  <td className="border-b border-slate-200 px-4 py-4 text-slate-700">
                                    <p className="font-medium text-slate-900">{entry.categoryLabel}</p>
                                    <p className="mt-1 text-xs text-slate-500">{TYPE_LABELS[entry.type]}</p>
                                  </td>
                                  <td className="border-b border-slate-200 px-4 py-4 font-semibold text-slate-900">
                                    {entry.title}
                                  </td>
                                  <td className="border-b border-slate-200 px-4 py-4 font-semibold text-slate-900">
                                    {formatCurrency(entry.amount)}
                                  </td>
                                  <td className="border-b border-slate-200 px-4 py-4 text-slate-600">
                                    {entry.description}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))
                  ) : activeDateGroup ? (
                    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200">
                      <div className="border-b border-slate-200 bg-[#fffaf0] px-5 py-4">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#9c3d2b]">
                          {activeDateGroup.label}
                        </p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                          <thead className="bg-slate-100 text-xs uppercase tracking-[0.24em] text-slate-500">
                            <tr>
                              <th className="border-b border-slate-200 px-4 py-3">Date</th>
                              <th className="border-b border-slate-200 px-4 py-3">Expense category</th>
                              <th className="border-b border-slate-200 px-4 py-3">Title</th>
                              <th className="border-b border-slate-200 px-4 py-3">Amount</th>
                              <th className="border-b border-slate-200 px-4 py-3">Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeDateGroup.items.map((entry, index) => (
                              <tr
                                key={entry.id}
                                className={index % 2 === 0 ? "bg-slate-100" : "bg-white"}
                              >
                                <td className="border-b border-slate-200 px-4 py-4 text-slate-700">
                                  {formatDateLabel(entry.entryDate)}
                                </td>
                                <td className="border-b border-slate-200 px-4 py-4 text-slate-700">
                                  <p className="font-medium text-slate-900">{entry.categoryLabel}</p>
                                  <p className="mt-1 text-xs text-slate-500">{TYPE_LABELS[entry.type]}</p>
                                </td>
                                <td className="border-b border-slate-200 px-4 py-4 font-semibold text-slate-900">
                                  {entry.title}
                                </td>
                                <td className="border-b border-slate-200 px-4 py-4 font-semibold text-slate-900">
                                  {formatCurrency(entry.amount)}
                                </td>
                                <td className="border-b border-slate-200 px-4 py-4 text-slate-600">
                                  {entry.description}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-500">
                      No report entries match the current equipment and date filters.
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[2rem] border border-slate-200 bg-[#102033] p-6 text-white shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primaryYellow">
                    Equipment snapshot
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    Current position
                  </h2>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-lg font-semibold">{activeEquipment?.name || "No equipment"}</p>
                      <p className="mt-2 text-sm text-slate-300">
                        {activeEquipment ? `${activeEquipment.company} ${activeEquipment.model}` : "No equipment selected."}
                      </p>
                    </div>
                    <div className="grid gap-3 text-sm text-slate-200">
                      <p>Expense: {formatCurrency(totals.expense)}</p>
                      <p>Income: {formatCurrency(totals.income)}</p>
                      <p>Net: {formatCurrency(totals.net)}</p>
                      <p>Entries: {filteredEntries.length}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9c3d2b]">
                    Category totals
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                    Filtered totals
                  </h2>

                  <div className="mt-6 grid gap-4">
                    {categoryTotals.length ? (
                      categoryTotals.map((category) => (
                        <div key={category.category} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                            {TYPE_LABELS[category.type]}
                          </p>
                          <p className="mt-2 text-lg font-semibold text-slate-900">
                            {category.label}
                          </p>
                          <p className="mt-3 text-2xl font-semibold text-[#1E2D44]">
                            {formatCurrency(category.total)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                        No category totals are available for the current filter window.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
