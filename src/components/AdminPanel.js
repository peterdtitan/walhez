"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import {
  createEquipmentAction,
  createReportEntryAction,
} from "@/app/admin/actions";
import {
  CATEGORY_LABELS,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "@/lib/report-options";
import { formatCurrency } from "@/lib/formatting";

const initialActionState = {
  success: false,
  message: "",
};

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
        state.success
          ? "bg-green-50 text-green-700"
          : "bg-red-50 text-red-700"
      }`}
    >
      {state.message}
    </p>
  );
}

export default function AdminPanel({ equipment, recentEntries }) {
  const [equipmentState, equipmentAction] = useFormState(
    createEquipmentAction,
    initialActionState
  );
  const [reportState, reportAction] = useFormState(
    createReportEntryAction,
    initialActionState
  );
  const [reportType, setReportType] = useState("EXPENSE");
  const [imageMode, setImageMode] = useState("STATIC");
  const equipmentFormRef = useRef(null);
  const reportFormRef = useRef(null);

  const categories = useMemo(
    () => (reportType === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES),
    [reportType]
  );

  useEffect(() => {
    if (equipmentState.success) {
      equipmentFormRef.current?.reset();
      setImageMode("STATIC");
    }
  }, [equipmentState.success]);

  useEffect(() => {
    if (reportState.success) {
      reportFormRef.current?.reset();
      setReportType("EXPENSE");
    }
  }, [reportState.success]);

  return (
    <section className="bg-[#f3efe5]">
      <div className="px-4 py-6 md:px-8 md:py-8">
        <div className="rounded-[2rem] bg-[#1E2D44] px-6 py-8 text-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] md:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primaryYellow">
                Admin workspace
              </p>
              <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
                Admin dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
                Create equipment records with public asset paths or uploaded images, then log expense and income entries against each machine.
              </p>
            </div>

            <Link
              href="/admin/reports"
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-primaryYellow hover:text-primaryYellow"
            >
              View reports
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9c3d2b]">
                Add equipment
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                New equipment profile
              </h2>

              <form ref={equipmentFormRef} action={equipmentAction} className="mt-6 space-y-5">
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

                <StateMessage state={equipmentState} />
                <SaveButton label="Save equipment" pendingLabel="Saving equipment..." />
              </form>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9c3d2b]">
                Equipment list
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Current database records
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {equipment.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-lg font-semibold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">
                      {item.company} • {item.model}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                      {item.imagePath}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9c3d2b]">
                Add report entry
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Expense and income ledger
              </h2>

              <form ref={reportFormRef} action={reportAction} className="mt-6 space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Equipment</span>
                    <select name="equipmentId" className="w-full rounded-xl border border-slate-200 px-4 py-3">
                      <option value="">Select equipment</option>
                      {equipment.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} • {item.company} {item.model}
                        </option>
                      ))}
                    </select>
                  </label>

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
                    <select name="category" className="w-full rounded-xl border border-slate-200 px-4 py-3">
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Title</span>
                    <input name="title" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Amount (NGN)</span>
                    <input type="number" min="1" name="amount" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Description</span>
                    <textarea name="description" rows="4" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Entry date</span>
                    <input type="date" name="entryDate" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
                  </label>
                </div>

                <StateMessage state={reportState} />
                <SaveButton label="Save report entry" pendingLabel="Saving entry..." />
              </form>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9c3d2b]">
                Recent activity
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Latest ledger entries
              </h2>

              <div className="mt-6 space-y-4">
                {recentEntries.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{entry.title}</p>
                        <p className="text-sm text-slate-500">{entry.equipment.name}</p>
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
                      <span>{CATEGORY_LABELS[entry.category]}</span>
                      <span>{formatCurrency(entry.amount)}</span>
                      <span>{new Date(entry.entryDate).toLocaleDateString("en-GB")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
