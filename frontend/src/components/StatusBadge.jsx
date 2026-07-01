import React from "react";

const STATUS_MAP = {
  // subscription
  pro: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Pro" },
  free: { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200", label: "Free" },
  expired: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "Expired" },
  // payments
  success: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Success" },
  pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "Pending" },
  failed: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", label: "Failed" },
};

export default function StatusBadge({ status, testid }) {
  const key = (status || "").toLowerCase();
  const s =
    STATUS_MAP[key] || {
      bg: "bg-gray-100",
      text: "text-gray-700",
      border: "border-gray-200",
      label: status || "—",
    };
  return (
    <span
      data-testid={testid}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          key === "pro" || key === "success"
            ? "bg-emerald-500"
            : key === "pending" || key === "expired"
            ? "bg-amber-500"
            : key === "failed"
            ? "bg-red-500"
            : "bg-gray-400"
        }`}
      />
      {s.label}
    </span>
  );
}
