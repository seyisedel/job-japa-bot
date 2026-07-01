import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Pagination } from "./UsersTable";
import { formatDateTime, formatNaira } from "../lib/api";

const PAGE_SIZE = 10;

const TYPE_LABELS = {
  pro_monthly: "Pro Monthly",
  pro_yearly: "Pro Yearly",
  cv_rewrite: "CV Rewrite",
  one_time: "One-time",
};

export default function PaymentsTable({ payments, loading }) {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return payments.filter((p) => {
      const matchQ =
        !query ||
        (p.reference || "").toLowerCase().includes(query) ||
        (p.type || "").toLowerCase().includes(query);
      const matchS =
        statusFilter === "all" ||
        (p.status || "").toLowerCase() === statusFilter;
      return matchQ && matchS;
    });
  }, [payments, q, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  const STATUSES = [
    { key: "all", label: "All" },
    { key: "success", label: "Success" },
    { key: "pending", label: "Pending" },
    { key: "failed", label: "Failed" },
  ];

  return (
    <section
      data-testid="payments-section"
      className="bg-white border border-gray-200 rounded-sm"
    >
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-5 border-b border-gray-200">
        <div>
          <h2 className="font-heading text-xl font-bold text-gray-900">
            Payments
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {filtered.length} of {payments.length} matching
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              data-testid="payments-search-input"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search reference…"
              className="pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand w-56"
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden">
            {STATUSES.map((s) => (
              <button
                key={s.key}
                data-testid={`payments-filter-${s.key}`}
                onClick={() => {
                  setStatusFilter(s.key);
                  setPage(1);
                }}
                className={`px-3 py-2 text-xs font-semibold transition-colors ${
                  statusFilter === s.key
                    ? "bg-brand text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="table-scroll">
        <table
          data-testid="payments-table"
          className="w-full text-sm border-collapse"
        >
          <thead className="bg-gray-50">
            <tr>
              <Th>Reference</Th>
              <Th align="right">Amount</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th align="right">Date</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows cols={5} />
            ) : rows.length === 0 ? (
              <tr>
                <td
                  data-testid="payments-empty"
                  colSpan={5}
                  className="px-6 py-14 text-center text-sm text-gray-500"
                >
                  No payments match the current filters.
                </td>
              </tr>
            ) : (
              rows.map((p) => (
                <tr
                  key={p.id}
                  data-testid={`payment-row-${p.id}`}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3 font-mono-num text-gray-900">
                    {p.reference}
                  </td>
                  <td className="px-6 py-3 text-right font-mono-num font-semibold text-emerald-900">
                    {formatNaira(p.amount)}
                  </td>
                  <td className="px-6 py-3 text-gray-700">
                    {TYPE_LABELS[p.type] || p.type || "—"}
                  </td>
                  <td className="px-6 py-3">
                    <StatusBadge status={p.status} testid={`payment-status-${p.id}`} />
                  </td>
                  <td className="px-6 py-3 text-right text-gray-600 font-mono-num">
                    {formatDateTime(p.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        testidPrefix="payments"
      />
    </section>
  );
}

function Th({ children, align = "left" }) {
  return (
    <th
      scope="col"
      className={`px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 border-b border-gray-200 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function SkeletonRows({ cols = 5, rows = 6 }) {
  return Array.from({ length: rows }).map((_, i) => (
    <tr key={i} className="border-b border-gray-100">
      {Array.from({ length: cols }).map((__, j) => (
        <td key={j} className="px-6 py-4">
          <div className="h-3 bg-gray-100 rounded-sm animate-pulse" />
        </td>
      ))}
    </tr>
  ));
}
