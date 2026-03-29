import ComprehensiveReportPdf from "@/components/ComprehensiveReportPdf";
import ReportPdfButton from "@/components/ReportPdfButton";
import { getComprehensiveReportData } from "@/lib/walhez-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Comprehensive Report PDF",
  description: "Print-friendly comprehensive export of all Walhez report data.",
};

export default async function AdminComprehensiveReportsPdfPage() {
  const report = await getComprehensiveReportData();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-6 print:hidden md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-slate-200 bg-[#fffaf0] px-5 py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9c3d2b]">
              Comprehensive PDF export
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

      <ComprehensiveReportPdf report={report} />
    </div>
  );
}
