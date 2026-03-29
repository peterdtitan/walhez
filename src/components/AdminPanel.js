"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  createEquipmentAction,
  createReportEntryAction,
} from "@/app/admin/actions";
import {
  CATEGORY_LABELS,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  OPERATIONAL_EXPENSE_LABELS,
  OPERATIONAL_EXPENSE_TYPES,
  REPORT_TARGET_OPTIONS,
  REPORT_TARGET_TYPE_OPTIONS,
  SALARY_OPERATIONAL_EXPENSE_VALUES,
  SPECIAL_REPORT_TARGET_DEFAULTS,
  getReportTargetsForType,
} from "@/lib/report-options";
import { getAdminDisplayName } from "@/lib/admin-users";
import { formatCurrency } from "@/lib/formatting";

const initialActionState = {
  success: false,
  message: "",
};

const chartPalette = ["#102033", "#9c3d2b", "#f2c94c", "#3e7b6f", "#d97706", "#64748b"];

function SaveButton({ label, pendingLabel }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-[#1E2D44] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#263a57] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

function StateMessage({ state }) {
  if (!state.message) {
    return null;
  }

  return (
    <p
      className={`rounded-xl px-4 py-3 text-sm ${
        state.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
      }`}
    >
      {state.message}
    </p>
  );
}

function MetricCard({ label, value, note, accent = "text-slate-900" }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9c3d2b]">
        {label}
      </p>
      <p className={`mt-3 text-3xl font-semibold ${accent}`}>{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{note}</p>
    </div>
  );
}

function Modal({ title, subtitle, open, onClose, children }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/55 px-4 py-8">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.22)]">
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9c3d2b]">
              Admin action
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            Close
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}

function EquipmentForm({
  state,
  action,
  formRef,
  imageMode,
  setImageMode,
}) {
  return (
    <form ref={formRef} action={action} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Name</span>
          <input name="name" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Company</span>
          <input name="company" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Model</span>
          <input name="model" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Image source</span>
          <select
            name="imageMode"
            value={imageMode}
            onChange={(event) => setImageMode(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
          >
            <option value="STATIC">Use public/static file path</option>
            <option value="UPLOAD">Upload local image file</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">Description</span>
        <textarea
          name="description"
          rows="4"
          className="w-full rounded-xl border border-slate-200 px-4 py-3"
          placeholder="Describe what the equipment is used for and any important operating notes."
        />
      </label>

      {imageMode === "STATIC" ? (
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Public image path</span>
          <input
            name="imagePath"
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
            placeholder="/tractor.png"
          />
        </label>
      ) : (
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Upload image</span>
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            className="w-full rounded-xl border border-dashed border-slate-300 px-4 py-3"
          />
        </label>
      )}

      <div>
        <p className="text-sm font-medium text-slate-700">Characteristic rows</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="rounded-2xl bg-slate-50 p-4">
              <input
                name={`charTitle${index}`}
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
                placeholder={`Characteristic title ${index + 1}`}
              />
              <input
                name={`charValue${index}`}
                className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3"
                placeholder={`Characteristic value ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      <StateMessage state={state} />
      <SaveButton label="Save equipment" pendingLabel="Saving equipment..." />
    </form>
  );
}

function ReportForm({
  equipment,
  state,
  action,
  formRef,
  reportTargetType,
  setReportTargetType,
  selectedEquipmentId,
  setSelectedEquipmentId,
  selectedNamedTarget,
  setSelectedNamedTarget,
  reportType,
  setReportType,
  reportCategory,
  setReportCategory,
  operationalExpenseType,
  setOperationalExpenseType,
  fuelQuantity,
  setFuelQuantity,
  fuelUnitPrice,
  setFuelUnitPrice,
  computedFuelAmount,
}) {
  const isSpecialOperationalTarget =
    reportTargetType === "SALARY" || reportTargetType === "OTHER_OPERATIONAL";
  const effectiveReportType = isSpecialOperationalTarget ? "EXPENSE" : reportType;
  const effectiveReportCategory = isSpecialOperationalTarget
    ? "OPERATIONAL_EXPENSE"
    : reportCategory;
  const categories =
    effectiveReportType === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const isOperationalExpense =
    effectiveReportType === "EXPENSE" &&
    effectiveReportCategory === "OPERATIONAL_EXPENSE";
  const isMeasuredPurchase =
    operationalExpenseType === "DIESEL_PURCHASE" ||
    operationalExpenseType === "FUEL_PURCHASE" ||
    operationalExpenseType === "SAND_PURCHASE";
  const salaryOperationalExpenseValues = new Set(SALARY_OPERATIONAL_EXPENSE_VALUES);
  const visibleOperationalExpenseTypes = isSpecialOperationalTarget
    ? OPERATIONAL_EXPENSE_TYPES.filter((item) =>
        reportTargetType === "SALARY"
          ? salaryOperationalExpenseValues.has(item.value)
          : !salaryOperationalExpenseValues.has(item.value)
      )
    : OPERATIONAL_EXPENSE_TYPES;
  const quantityLabel =
    operationalExpenseType === "SAND_PURCHASE" ? "Number of trips" : "Number of kegs";
  const unitPriceLabel =
    operationalExpenseType === "SAND_PURCHASE"
      ? "Unit price per trip (NGN)"
      : "Unit price per keg (NGN)";
  const projectTargets = getReportTargetsForType("PROJECT");

  return (
    <form ref={formRef} action={action} className="space-y-5">
      <input
        type="hidden"
        name="equipmentId"
        value={reportTargetType === "EQUIPMENT" ? selectedEquipmentId : ""}
      />
      <input
        type="hidden"
        name="reportTarget"
        value={reportTargetType === "EQUIPMENT" ? "" : selectedNamedTarget}
      />
      {isSpecialOperationalTarget ? (
        <>
          <input type="hidden" name="type" value="EXPENSE" />
          <input type="hidden" name="category" value="OPERATIONAL_EXPENSE" />
        </>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Target type</span>
          <select
            value={reportTargetType}
            onChange={(event) => {
              const nextType = event.target.value;
              setReportTargetType(nextType);
              setSelectedEquipmentId("");
              setSelectedNamedTarget(SPECIAL_REPORT_TARGET_DEFAULTS[nextType] || "");
              setReportType("EXPENSE");
              setReportCategory(
                nextType === "SALARY" || nextType === "OTHER_OPERATIONAL"
                  ? "OPERATIONAL_EXPENSE"
                  : EXPENSE_CATEGORIES[0]?.value || ""
              );
              setOperationalExpenseType("");
              setFuelQuantity("");
              setFuelUnitPrice("");
            }}
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
          >
            {REPORT_TARGET_TYPE_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        {reportTargetType === "EQUIPMENT" ? (
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Equipment</span>
            <select
              value={selectedEquipmentId}
              onChange={(event) => setSelectedEquipmentId(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
            >
              <option value="">Select equipment</option>
              {equipment.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} • {item.company} {item.model}
                </option>
              ))}
            </select>
          </label>
        ) : reportTargetType === "PROJECT" ? (
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Project</span>
            <select
              value={selectedNamedTarget}
              onChange={(event) => setSelectedNamedTarget(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
            >
              <option value="">Select project</option>
              {projectTargets.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">
              {reportTargetType === "SALARY"
                ? "Salary entries"
                : "Other operational entries"}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {reportTargetType === "SALARY"
                ? "Use this section for crew salary and allowance entries that are not tied to a listed equipment."
                : "Use this section for operational entries that belong to equipment not added yet."}
            </p>
          </div>
        )}

        {isSpecialOperationalTarget ? (
          <>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">Type</p>
              <p className="mt-2 text-base font-semibold text-slate-900">Expense</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">Category</p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                Operational expense
              </p>
            </div>
          </>
        ) : (
          <>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Type</span>
              <select
                name="type"
                value={reportType}
                onChange={(event) => setReportType(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Category</span>
              <select
                name="category"
                value={reportCategory}
                onChange={(event) => {
                  setReportCategory(event.target.value);
                  setOperationalExpenseType("");
                  setFuelQuantity("");
                  setFuelUnitPrice("");
                }}
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        {isOperationalExpense ? (
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Operational expense item
            </span>
            <select
              name="operationalExpenseType"
              value={operationalExpenseType}
              onChange={(event) => {
                setOperationalExpenseType(event.target.value);
                setFuelQuantity("");
                setFuelUnitPrice("");
              }}
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
            >
              <option value="">Select item</option>
              {visibleOperationalExpenseTypes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Title</span>
          <input
            name="title"
            placeholder={
              isOperationalExpense && operationalExpenseType
                ? OPERATIONAL_EXPENSE_LABELS[operationalExpenseType]
                : "Short title for this entry"
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
          />
        </label>

        {isMeasuredPurchase ? (
          <>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">{quantityLabel}</span>
              <input
                type="number"
                min="1"
                name="quantity"
                value={fuelQuantity}
                onChange={(event) => setFuelQuantity(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">{unitPriceLabel}</span>
              <input
                type="number"
                min="1"
                name="unitPrice"
                value={fuelUnitPrice}
                onChange={(event) => setFuelUnitPrice(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Calculated amount (NGN)
              </span>
              <input
                type="number"
                min="1"
                name="amount"
                readOnly
                value={computedFuelAmount > 0 ? String(computedFuelAmount) : ""}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600"
              />
            </label>
          </>
        ) : (
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Amount (NGN)</span>
            <input type="number" min="1" name="amount" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
          </label>
        )}

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-medium text-slate-700">Description</span>
          <textarea name="description" rows="4" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-medium text-slate-700">Entry date</span>
          <input type="date" name="entryDate" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
        </label>
      </div>

      <p className="text-sm text-slate-500">
        Select the report section first, then complete the entry for the relevant equipment, project, salary, or other operational record.
      </p>

      <StateMessage state={state} />
      <SaveButton label="Save report entry" pendingLabel="Saving entry..." />
    </form>
  );
}

function ReportEntryFormInstance({ equipment, setFormInstanceKey }) {
  const [reportState, reportAction] = useFormState(
    createReportEntryAction,
    initialActionState
  );
  const [reportType, setReportType] = useState("EXPENSE");
  const [reportTargetType, setReportTargetType] = useState("EQUIPMENT");
  const [selectedEquipmentId, setSelectedEquipmentId] = useState("");
  const [selectedNamedTarget, setSelectedNamedTarget] = useState("");
  const [reportCategory, setReportCategory] = useState("PREVENTIVE_MAINTENANCE");
  const [operationalExpenseType, setOperationalExpenseType] = useState("");
  const [measuredQuantity, setMeasuredQuantity] = useState("");
  const [measuredUnitPrice, setMeasuredUnitPrice] = useState("");
  const reportFormRef = useRef(null);

  const computedMeasuredAmount = useMemo(() => {
    const quantity = Number(measuredQuantity || 0);
    const unitPrice = Number(measuredUnitPrice || 0);

    if (!Number.isFinite(quantity) || !Number.isFinite(unitPrice)) {
      return 0;
    }

    return quantity * unitPrice;
  }, [measuredQuantity, measuredUnitPrice]);

  useEffect(() => {
    if (reportState.success) {
      setFormInstanceKey((current) => current + 1);
    }
  }, [reportState.success, setFormInstanceKey]);

  useEffect(() => {
    const defaultCategory =
      reportType === "INCOME"
        ? INCOME_CATEGORIES[0]?.value || ""
        : EXPENSE_CATEGORIES[0]?.value || "";

    setReportCategory(defaultCategory);
    setOperationalExpenseType("");
    setMeasuredQuantity("");
    setMeasuredUnitPrice("");
  }, [reportType]);

  return (
    <ReportForm
      equipment={equipment}
      state={reportState}
      action={reportAction}
      formRef={reportFormRef}
      reportTargetType={reportTargetType}
      setReportTargetType={setReportTargetType}
      selectedEquipmentId={selectedEquipmentId}
      setSelectedEquipmentId={setSelectedEquipmentId}
      selectedNamedTarget={selectedNamedTarget}
      setSelectedNamedTarget={setSelectedNamedTarget}
      reportType={reportType}
      setReportType={setReportType}
      reportCategory={reportCategory}
      setReportCategory={setReportCategory}
      operationalExpenseType={operationalExpenseType}
      setOperationalExpenseType={setOperationalExpenseType}
      fuelQuantity={measuredQuantity}
      setFuelQuantity={setMeasuredQuantity}
      fuelUnitPrice={measuredUnitPrice}
      setFuelUnitPrice={setMeasuredUnitPrice}
      computedFuelAmount={computedMeasuredAmount}
    />
  );
}

function ReportEntryModalContent({ equipment }) {
  const [formInstanceKey, setFormInstanceKey] = useState(0);

  return (
    <ReportEntryFormInstance
      key={formInstanceKey}
      equipment={equipment}
      setFormInstanceKey={setFormInstanceKey}
    />
  );
}

function DashboardChartCard({ kicker, title, children, note }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9c3d2b]">
        {kicker}
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h2>
      <div className="mt-6 h-72">{children}</div>
      {note ? <p className="mt-4 text-sm text-slate-500">{note}</p> : null}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-md">
      {label ? <p className="text-sm font-semibold text-slate-900">{label}</p> : null}
      <div className="mt-2 space-y-1 text-sm text-slate-600">
        {payload.map((item) => (
          <p key={item.name}>
            {item.name}: {formatCurrency(Number(item.value || 0))}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function AdminPanel({ admin, equipment, recentEntries, dashboardMetrics }) {
  const displayName = getAdminDisplayName(admin);
  const [equipmentState, equipmentAction] = useFormState(
    createEquipmentAction,
    initialActionState
  );
  const [imageMode, setImageMode] = useState("STATIC");
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const equipmentFormRef = useRef(null);

  useEffect(() => {
    if (equipmentState.success) {
      equipmentFormRef.current?.reset();
      setImageMode("STATIC");
      setEquipmentModalOpen(false);
    }
  }, [equipmentState.success]);

  return (
    <section className="bg-[#f3efe5]">
      <div className="px-4 py-6 md:px-8 md:py-8">
        <div className="rounded-[2rem] bg-[#1E2D44] px-6 py-8 text-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] md:px-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
                Welcome back{" "}
                <span className="italic text-primaryYellow">{displayName}!</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
                Monitor equipment cost behavior, spot the biggest spenders, and launch new records from modal actions when you need to add equipment or financial entries.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setEquipmentModalOpen(true)}
                className="rounded-full bg-[#f2c94c] px-5 py-3 text-sm font-semibold text-[#102033] transition hover:bg-[#ffd86c]"
              >
                New equipment profile
              </button>
              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-primaryYellow hover:text-primaryYellow"
              >
                New report entry
              </button>
              <Link
                href="/admin/reports"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-primaryYellow hover:text-primaryYellow"
              >
                View reports
              </Link>
              <Link
                href="/admin/access"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-primaryYellow hover:text-primaryYellow"
              >
                Manage admins
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total equipment"
            value={String(dashboardMetrics.totalEquipment)}
            note="Machines currently tracked in the database."
          />
          <MetricCard
            label="Total expense"
            value={formatCurrency(dashboardMetrics.totalExpense)}
            note="All expense entries recorded across equipment."
            accent="text-red-700"
          />
          <MetricCard
            label="Total income"
            value={formatCurrency(dashboardMetrics.totalIncome)}
            note="All income entries linked to equipment usage."
            accent="text-green-700"
          />
          <MetricCard
            label="Net position"
            value={formatCurrency(dashboardMetrics.netPosition)}
            note={`${dashboardMetrics.totalEntries} total entries recorded so far.`}
            accent={
              dashboardMetrics.netPosition >= 0 ? "text-[#1E2D44]" : "text-[#9c3d2b]"
            }
          />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <DashboardChartCard
            kicker="Spending trend"
            title="Expense vs income over time"
            note="Movement grouped by the recorded entry date selected on each report entry."
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardMetrics.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="expense" stroke="#9c3d2b" strokeWidth={3} dot={{ r: 4 }} name="Expense" />
                <Line type="monotone" dataKey="income" stroke="#102033" strokeWidth={3} dot={{ r: 4 }} name="Income" />
              </LineChart>
            </ResponsiveContainer>
          </DashboardChartCard>

          <DashboardChartCard
            kicker="Highest expenses"
            title="Top expense categories"
            note="Largest expense categories recorded so far."
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardMetrics.topExpenseCategories}
                  dataKey="total"
                  nameKey="label"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  {dashboardMetrics.topExpenseCategories.map((item, index) => (
                    <Cell key={item.category} fill={chartPalette[index % chartPalette.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </DashboardChartCard>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <DashboardChartCard
            kicker="Equipment spend"
            title="Highest expense by equipment"
            note="Compare which machines are absorbing the most direct cost."
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardMetrics.highestExpenseEquipment}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="equipmentName" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="expense" radius={[8, 8, 0, 0]} name="Expense">
                  {dashboardMetrics.highestExpenseEquipment.map((item, index) => (
                    <Cell key={item.equipmentId} fill={chartPalette[index % chartPalette.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </DashboardChartCard>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9c3d2b]">
              Equipment ranking
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Cost and usage leaderboard
            </h2>
            <div className="mt-6 space-y-4">
              {dashboardMetrics.equipmentPerformance.map((item, index) => (
                <div key={item.equipmentId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-slate-900">
                      {index + 1}. {item.equipmentName}
                    </p>
                    <p className="text-sm font-medium text-slate-500">
                      {item.entries} entries
                    </p>
                  </div>
                  <div className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-3">
                    <p>Expense: {formatCurrency(item.expense)}</p>
                    <p>Income: {formatCurrency(item.income)}</p>
                    <p>Net: {formatCurrency(item.net)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9c3d2b]">
            Latest entries
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Recent activity
          </h2>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {recentEntries.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{entry.title}</p>
                    <p className="text-sm text-slate-500">{entry.targetName}</p>
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                      entry.type === "EXPENSE"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {entry.type}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{entry.description}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                  <span>{entry.operationalExpenseLabel || CATEGORY_LABELS[entry.category]}</span>
                  {entry.quantity && entry.unitPrice ? (
                    <span>
                      {entry.quantity}{" "}
                      {entry.operationalExpenseType === "SAND_PURCHASE" ? "trips" : "kegs"} x{" "}
                      {formatCurrency(entry.unitPrice)}
                    </span>
                  ) : null}
                  <span>{formatCurrency(entry.amount)}</span>
                  <span>{new Date(entry.entryDate).toLocaleDateString("en-GB")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        title="New equipment profile"
        subtitle="Create a new equipment record with either a static public file path or an uploaded image."
        open={equipmentModalOpen}
        onClose={() => setEquipmentModalOpen(false)}
      >
        <EquipmentForm
          state={equipmentState}
          action={equipmentAction}
          formRef={equipmentFormRef}
          imageMode={imageMode}
          setImageMode={setImageMode}
        />
      </Modal>

      <Modal
        title="New report entry"
        subtitle="Create an entry for equipment, projects, salary records, or other operational records without breaking the main reporting flow."
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      >
        <ReportEntryModalContent equipment={equipment} />
      </Modal>
    </section>
  );
}
