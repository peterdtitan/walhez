"use client";

import { useRouter } from "next/navigation";

export default function ReportPdfButton({
  className = "",
  label = "Download as PDF",
  href,
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (href) {
          router.push(href);
          return;
        }

        window.print();
      }}
      className={className}
    >
      {label}
    </button>
  );
}
