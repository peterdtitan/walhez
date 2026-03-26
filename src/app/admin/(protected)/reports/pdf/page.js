import { getOperationsReportData } from "@/lib/walhez-data";
import OperationsReport from "@/components/OperationsReport";
import ReportPdfButton from "@/components/ReportPdfButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Reports PDF | Walhez",
  description: "Print-friendly protected equipment income and expense reporting.",
};

export default async function AdminReportsPdfPage({ searchParams }) {
  const report = await getOperationsReportData();
  const equipmentId = String(searchParams?.equipmentId || "").trim();
  const type = String(searchParams?.type || "ALL").trim();
  const range = String(searchParams?.range || "7_DAYS").trim();
  const startDate = String(searchParams?.startDate || "").trim();
  const endDate = String(searchParams?.endDate || "").trim();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-6 print:hidden md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-slate-200 bg-[#fffaf0] px-5 py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9c3d2b]">
              Admin PDF export
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Use your browser&apos;s Save as PDF option after clicking the button.
            </p>
          </div>
          <ReportPdfButton
            label="Print / Save as PDF"
            className="rounded-full bg-[#1e2d44] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2a405f]"
          />
        </div>
      </div>

      <OperationsReport
        report={report}
        pdfMode
        initialEquipmentId={equipmentId}
        initialTypeFilter={type}
        initialRangeFilter={range}
        initialCustomStartDate={startDate}
        initialCustomEndDate={endDate}
      />
    </div>
  );
}
