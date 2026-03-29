import { formatCurrency } from "@/lib/formatting";

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value) {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function labelizeKind(kind) {
  if (!kind) {
    return "Unknown";
  }

  return kind
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function EntryUnitNote({ entry }) {
  if (!entry.quantity || !entry.unitPrice) {
    return null;
  }

  const unitLabel = entry.operationalExpenseType === "SAND_PURCHASE" ? "trips" : "kegs";

  return (
    <p className="mt-1 text-xs text-slate-500">
      {entry.quantity} {unitLabel} x {formatCurrency(entry.unitPrice)}
    </p>
  );
}

function StatCard({ label, value, note, accent = "text-slate-900" }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9c3d2b]">
        {label}
      </p>
      <p className={`mt-3 text-3xl font-semibold ${accent}`}>{value}</p>
      {note ? <p className="mt-2 text-sm text-slate-600">{note}</p> : null}
    </div>
  );
}

function TableCard({ title, note, children, className = "" }) {
  return (
    <section
      className={`comprehensive-report-card rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm md:p-6 print:p-3 ${className}`}
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          {note ? <p className="mt-2 text-sm text-slate-600">{note}</p> : null}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function ComprehensiveReportPdf({ report }) {
  return (
    <section className="bg-white text-slate-900">
      <style>{`
        @page {
          margin: 8mm;
        }

        @media print {
          .comprehensive-report-shell {
            max-width: none !important;
            padding: 0 !important;
          }

          .comprehensive-report-card {
            border-radius: 16px !important;
            box-shadow: none !important;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .comprehensive-report-flow-card {
            break-inside: auto !important;
            page-break-inside: auto !important;
          }

          .comprehensive-report-table {
            width: 100%;
            table-layout: auto;
          }

          .comprehensive-report-ledger-table {
            table-layout: fixed !important;
          }

          .comprehensive-report-table th,
          .comprehensive-report-table td {
            vertical-align: top;
          }

          .comprehensive-report-amount {
            white-space: nowrap !important;
            width: 1%;
          }

          .comprehensive-report-description {
            min-width: 220px;
            word-break: break-word;
            overflow-wrap: anywhere;
          }

          .comprehensive-report-ledger-date-col {
            width: 72px;
          }

          .comprehensive-report-ledger-type-col {
            width: 96px;
          }

          .comprehensive-report-ledger-amount-col {
            width: 128px;
          }

          .comprehensive-report-ledger-description-col {
            width: 18%;
          }

          .comprehensive-report-ledger-table .comprehensive-report-description {
            min-width: 0 !important;
            font-size: 10px !important;
            line-height: 1.35 !important;
            white-space: normal !important;
            word-break: break-word !important;
            overflow-wrap: anywhere !important;
          }

          .comprehensive-report-ledger-table .comprehensive-report-target,
          .comprehensive-report-ledger-table .comprehensive-report-category,
          .comprehensive-report-ledger-table .comprehensive-report-title {
            min-width: 0 !important;
            white-space: normal !important;
            word-break: break-word !important;
            overflow-wrap: anywhere !important;
          }

          .comprehensive-report-ledger-table .comprehensive-report-target {
            font-size: 10px !important;
            line-height: 1.35 !important;
          }

          .comprehensive-report-ledger-table .comprehensive-report-category {
            font-size: 10px !important;
            line-height: 1.35 !important;
          }

          .comprehensive-report-ledger-table .comprehensive-report-title {
            font-size: 10px !important;
            line-height: 1.35 !important;
          }

          .comprehensive-report-ledger-table .comprehensive-report-type-badge {
            display: inline-flex !important;
            max-width: 100% !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 3px 6px !important;
            font-size: 9px !important;
            line-height: 1.2 !important;
            letter-spacing: 0.06em !important;
            text-align: center !important;
            white-space: nowrap !important;
          }

          .comprehensive-report-ledger-table .comprehensive-report-amount {
            min-width: 128px !important;
            max-width: 128px !important;
            overflow: hidden !important;
            text-align: right !important;
          }

          .comprehensive-report-summary-grid {
            grid-template-columns: minmax(0, 1fr) !important;
          }

          .comprehensive-report-summary-row {
            display: grid !important;
            grid-template-columns: minmax(0, 1fr) auto !important;
            align-items: start !important;
            gap: 12px !important;
          }

          .comprehensive-report-ledger-group {
            break-inside: auto;
            page-break-inside: auto;
          }
        }
      `}</style>

      <div className="comprehensive-report-shell mx-auto max-w-[1600px] px-2 py-6 md:px-4 print:max-w-none print:px-0">
        <header className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[#102033] px-6 py-8 text-white md:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#f2c94c]">
            Walhez comprehensive report
          </p>
          <h1 className="mt-4 text-3xl font-semibold md:text-5xl">
            Complete financial and reporting export
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 md:text-base">
            This export combines all recorded expenses, incomes, target summaries,
            operational breakdowns, equipment records, and the full reporting ledger
            into one print-friendly document.
          </p>
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-200">
            <p>Generated: {formatDateTime(report.generatedAt)}</p>
            <p>{report.totals.totalEntries} total entries</p>
            <p>{report.totals.totalEquipment} tracked equipment records</p>
          </div>
        </header>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard
            label="Total expense"
            value={formatCurrency(report.totals.totalExpense)}
            accent="text-red-700"
          />
          <StatCard
            label="Total income"
            value={formatCurrency(report.totals.totalIncome)}
            accent="text-green-700"
          />
          <StatCard
            label="Net position"
            value={formatCurrency(report.totals.netPosition)}
            accent={report.totals.netPosition >= 0 ? "text-[#1E2D44]" : "text-[#9c3d2b]"}
          />
          <StatCard
            label="Targets with entries"
            value={String(report.totals.totalTargetsWithEntries)}
          />
          <StatCard
            label="Equipment records"
            value={String(report.totals.totalEquipment)}
          />
        </div>

        <div className="comprehensive-report-summary-grid mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <TableCard
            title="Monthly overview"
            note="All expense and income movement across recorded reporting months."
          >
            <div className="overflow-x-auto">
              <table className="comprehensive-report-table min-w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-[0.24em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Month</th>
                    <th className="px-4 py-3">Entries</th>
                    <th className="px-4 py-3">Expense</th>
                    <th className="px-4 py-3">Income</th>
                    <th className="px-4 py-3">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {report.monthlyTotals.map((item, index) => (
                    <tr key={item.monthKey} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="border-b border-slate-200 px-4 py-4 font-medium text-slate-900">
                        {item.label}
                      </td>
                      <td className="border-b border-slate-200 px-4 py-4 text-slate-600">
                        {item.entries}
                      </td>
                      <td className="comprehensive-report-amount whitespace-nowrap border-b border-slate-200 px-4 py-4 text-red-700">
                        {formatCurrency(item.expense)}
                      </td>
                      <td className="comprehensive-report-amount whitespace-nowrap border-b border-slate-200 px-4 py-4 text-green-700">
                        {formatCurrency(item.income)}
                      </td>
                      <td className="comprehensive-report-amount whitespace-nowrap border-b border-slate-200 px-4 py-4 font-semibold text-slate-900">
                        {formatCurrency(item.income - item.expense)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TableCard>

          <TableCard
            title="Category totals"
            note="Overall totals across all recorded report categories."
          >
            <div className="space-y-3">
              {report.categoryTotals.map((item) => (
                <div key={item.category} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="comprehensive-report-summary-row flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                        {item.type}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">{item.entries} entries</p>
                    </div>
                    <p className="comprehensive-report-amount whitespace-nowrap text-lg font-semibold text-[#1E2D44]">
                      {formatCurrency(item.total)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TableCard>
        </div>

        <div className="comprehensive-report-summary-grid mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <TableCard
            title="Operational expense breakdown"
            note="Totals grouped by the operational item selected on each entry."
          >
            <div className="space-y-3">
              {report.operationalExpenseTotals.length ? (
                report.operationalExpenseTotals.map((item) => (
                  <div key={item.type} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="comprehensive-report-summary-row flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{item.label}</p>
                        <p className="mt-1 text-sm text-slate-600">{item.entries} entries</p>
                      </div>
                      <p className="comprehensive-report-amount whitespace-nowrap text-lg font-semibold text-[#1E2D44]">
                        {formatCurrency(item.total)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  No operational expense entries recorded yet.
                </div>
              )}
            </div>
          </TableCard>

          <TableCard
            title="Target summaries"
            note="Performance by equipment, project, salary section, and other operational section."
          >
            <div className="overflow-x-auto">
              <table className="comprehensive-report-table min-w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-[0.24em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Target</th>
                    <th className="px-4 py-3">Kind</th>
                    <th className="px-4 py-3">Entries</th>
                    <th className="px-4 py-3">Expense</th>
                    <th className="px-4 py-3">Income</th>
                    <th className="px-4 py-3">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {report.targetSummaries.map((item, index) => (
                    <tr key={item.targetKey} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="border-b border-slate-200 px-4 py-4">
                        <p className="font-semibold text-slate-900">{item.targetName}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.targetDescription}</p>
                      </td>
                      <td className="border-b border-slate-200 px-4 py-4 text-slate-600">
                        {labelizeKind(item.targetKind)}
                      </td>
                      <td className="border-b border-slate-200 px-4 py-4 text-slate-600">
                        {item.entries}
                      </td>
                      <td className="comprehensive-report-amount whitespace-nowrap border-b border-slate-200 px-4 py-4 text-red-700">
                        {formatCurrency(item.expense)}
                      </td>
                      <td className="comprehensive-report-amount whitespace-nowrap border-b border-slate-200 px-4 py-4 text-green-700">
                        {formatCurrency(item.income)}
                      </td>
                      <td className="comprehensive-report-amount whitespace-nowrap border-b border-slate-200 px-4 py-4 font-semibold text-slate-900">
                        {formatCurrency(item.net)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TableCard>
        </div>

        <div className="mt-6" style={{ breakBefore: "page" }}>
          <TableCard
            className="comprehensive-report-flow-card"
            title="Target ledgers"
            note="Detailed expense and income entries grouped under each target summary."
          >
            <div className="space-y-6">
              {report.targetEntryGroups.map((group) => (
                <div
                  key={group.targetKey}
                  className="comprehensive-report-ledger-group overflow-hidden rounded-[1.5rem] border border-slate-200"
                >
                  <div className="border-b border-slate-200 bg-[#fffaf0] px-5 py-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#9c3d2b]">
                          {labelizeKind(group.targetKind)}
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                          {group.targetName}
                        </h3>
                        <p className="mt-2 text-sm text-slate-600">
                          {group.targetDescription}
                        </p>
                      </div>
                      <div className="grid gap-2 text-sm text-slate-600 md:text-right">
                        <p>{group.entries} entries</p>
                        <p className="comprehensive-report-amount whitespace-nowrap">
                          Expense: {formatCurrency(group.expense)}
                        </p>
                        <p className="comprehensive-report-amount whitespace-nowrap">
                          Income: {formatCurrency(group.income)}
                        </p>
                        <p className="comprehensive-report-amount whitespace-nowrap font-semibold text-slate-900">
                          Net: {formatCurrency(group.net)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="comprehensive-report-table comprehensive-report-ledger-table min-w-full text-left text-xs md:text-sm">
                      <colgroup>
                        <col className="comprehensive-report-ledger-date-col" />
                        <col className="comprehensive-report-ledger-type-col" />
                        <col />
                        <col />
                        <col className="comprehensive-report-ledger-description-col" />
                        <col className="comprehensive-report-ledger-amount-col" />
                      </colgroup>
                      <thead className="bg-slate-100 text-xs uppercase tracking-[0.22em] text-slate-500">
                        <tr>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Type</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Title</th>
                          <th className="px-4 py-3">Description</th>
                          <th className="px-4 py-3">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.ledgerEntries.map((entry, index) => (
                          <tr
                            key={entry.id}
                            className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                          >
                            <td className="border-b border-slate-200 px-4 py-4 text-slate-700">
                              {formatDate(entry.entryDate)}
                            </td>
                            <td className="border-b border-slate-200 px-4 py-4">
                              <span
                                className={`comprehensive-report-type-badge rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                                  entry.type === "EXPENSE"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {entry.type}
                              </span>
                            </td>
                            <td className="comprehensive-report-category border-b border-slate-200 px-4 py-4 text-slate-700">
                              <p className="font-medium text-slate-900">
                                {entry.operationalExpenseLabel || entry.categoryLabel}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {entry.operationalExpenseLabel ? entry.categoryLabel : entry.type}
                              </p>
                            </td>
                            <td className="comprehensive-report-title border-b border-slate-200 px-4 py-4 font-semibold text-slate-900">
                              {entry.title}
                            </td>
                            <td className="comprehensive-report-description border-b border-slate-200 px-4 py-4 text-slate-600">
                              <p>{entry.description}</p>
                              <EntryUnitNote entry={entry} />
                            </td>
                            <td className="comprehensive-report-amount whitespace-nowrap border-b border-slate-200 px-4 py-4 font-semibold text-slate-900">
                              {formatCurrency(entry.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </TableCard>
        </div>

        <div className="mt-6" style={{ breakBefore: "page" }}>
          <TableCard
            className="comprehensive-report-flow-card"
            title="Full ledger"
            note="Every expense and income entry captured in the reporting system."
          >
            <div className="overflow-x-auto">
              <table className="comprehensive-report-table comprehensive-report-ledger-table min-w-full text-left text-xs md:text-sm">
                <colgroup>
                  <col className="comprehensive-report-ledger-date-col" />
                  <col />
                  <col className="comprehensive-report-ledger-type-col" />
                  <col />
                  <col />
                  <col className="comprehensive-report-ledger-description-col" />
                  <col className="comprehensive-report-ledger-amount-col" />
                </colgroup>
                <thead className="bg-slate-100 text-xs uppercase tracking-[0.22em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Target</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Notes</th>
                    <th className="px-4 py-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {report.entries.map((entry, index) => (
                    <tr key={entry.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="border-b border-slate-200 px-4 py-4 text-slate-700">
                        {formatDate(entry.entryDate)}
                      </td>
                      <td className="comprehensive-report-target border-b border-slate-200 px-4 py-4">
                        <p className="font-medium text-slate-900">{entry.targetName}</p>
                        <p className="mt-1 text-xs text-slate-500">{entry.targetDescription}</p>
                      </td>
                      <td className="border-b border-slate-200 px-4 py-4">
                        <span
                          className={`comprehensive-report-type-badge rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                            entry.type === "EXPENSE"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {entry.type}
                        </span>
                      </td>
                      <td className="comprehensive-report-category border-b border-slate-200 px-4 py-4 text-slate-700">
                        <p className="font-medium text-slate-900">
                          {entry.operationalExpenseLabel || entry.categoryLabel}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {entry.operationalExpenseLabel ? entry.categoryLabel : entry.type}
                        </p>
                      </td>
                      <td className="comprehensive-report-title border-b border-slate-200 px-4 py-4 font-semibold text-slate-900">
                        {entry.title}
                      </td>
                      <td className="comprehensive-report-description border-b border-slate-200 px-4 py-4 text-slate-600">
                        <p>{entry.description}</p>
                        <EntryUnitNote entry={entry} />
                      </td>
                      <td className="comprehensive-report-amount whitespace-nowrap border-b border-slate-200 px-4 py-4 font-semibold text-slate-900">
                        {formatCurrency(entry.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TableCard>
        </div>
      </div>
    </section>
  );
}
