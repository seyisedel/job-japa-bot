import React from "react";

export default function StatCard({ label, value, icon: Icon, accent = "brand", helper, testid }) {
  const accentClasses =
    accent === "accent"
      ? "text-accent bg-amber-50 border-amber-100"
      : accent === "neutral"
      ? "text-gray-700 bg-gray-100 border-gray-200"
      : "text-brand bg-emerald-50 border-emerald-100";

  return (
    <div
      data-testid={testid}
      className="bg-white border border-gray-200 rounded-sm p-6 flex flex-col justify-between min-h-[132px] transition-colors hover:border-gray-300"
    >
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
          {label}
        </span>
        {Icon ? (
          <span className={`h-8 w-8 grid place-items-center rounded-sm border ${accentClasses}`}>
            <Icon size={16} strokeWidth={2.2} />
          </span>
        ) : null}
      </div>
      <div className="mt-4">
        <div
          data-testid={`${testid}-value`}
          className="font-heading text-3xl font-bold text-gray-900 tracking-tight font-mono-num"
        >
          {value}
        </div>
        {helper ? (
          <div className="mt-1 text-xs text-gray-500">{helper}</div>
        ) : null}
      </div>
    </div>
  );
}
