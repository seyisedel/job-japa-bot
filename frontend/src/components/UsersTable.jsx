import React, { useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDate } from "../lib/api";

const PAGE_SIZE = 10;

export default function UsersTable({ users, loading }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return users.filter((u) => {
      const matchQ =
        !query ||
        (u.phone_number || "").toLowerCase().includes(query) ||
        (u.id || "").toLowerCase().includes(query);
      const matchF =
        filter === "all" ||
        (u.subscription_status || "").toLowerCase() === filter;
      return matchQ && matchF;
    });
  }, [users, q, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  const FILTERS = [
    { key: "all", label: "All" },
    { key: "pro", label: "Pro" },
    { key: "free", label: "Free" },
    { key: "expired", label: "Expired" },
  ];

  return (
    <section
      data-testid="users-section"
      className="bg-white border border-gray-200 rounded-sm"
    >
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-5 border-b border-gray-200">
        <div>
          <h2 className="font-heading text-xl font-bold text-gray-900">Users</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {filtered.length} of {users.length} matching
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              data-testid="users-search-input"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search phone…"
              className="pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand w-56"
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                data-testid={`users-filter-${f.key}`}
                onClick={() => {
                  setFilter(f.key);
                  setPage(1);
                }}
                className={`px-3 py-2 text-xs font-semibold transition-colors ${
                  filter === f.key
                    ? "bg-brand text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="table-scroll">
        <table
          data-testid="users-table"
          className="w-full text-sm border-collapse"
        >
          <thead className="bg-gray-50">
            <tr>
              <Th>Phone Number</Th>
              <Th>Subscription</Th>
              <Th align="right">CV Rewrites</Th>
              <Th align="right">Joined</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows cols={4} />
            ) : rows.length === 0 ? (
              <tr>
                <td
                  data-testid="users-empty"
                  colSpan={4}
                  className="px-6 py-14 text-center text-sm text-gray-500"
                >
                  No users match the current filters.
                </td>
              </tr>
            ) : (
              rows.map((u) => (
                <tr
                  key={u.id}
                  data-testid={`user-row-${u.id}`}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3 font-mono-num text-gray-900">
                    {u.phone_number}
                  </td>
                  <td className="px-6 py-3">
                    <StatusBadge
                      status={u.subscription_status}
                      testid={`user-sub-${u.id}`}
                    />
                  </td>
                  <td className="px-6 py-3 text-right font-mono-num text-gray-900">
                    {u.cv_rewrites_used ?? 0}
                  </td>
                  <td className="px-6 py-3 text-right text-gray-600">
                    {formatDate(u.created_at)}
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
        testidPrefix="users"
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

function SkeletonRows({ cols = 4, rows = 6 }) {
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

export function Pagination({ page, totalPages, onPrev, onNext, testidPrefix }) {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50/60">
      <span
        data-testid={`${testidPrefix}-page-indicator`}
        className="text-xs text-gray-600"
      >
        Page <span className="font-semibold text-gray-900">{page}</span> of{" "}
        <span className="font-semibold text-gray-900">{totalPages}</span>
      </span>
      <div className="flex items-center gap-1">
        <button
          data-testid={`${testidPrefix}-prev-btn`}
          disabled={page <= 1}
          onClick={onPrev}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-gray-300 rounded-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={14} /> Prev
        </button>
        <button
          data-testid={`${testidPrefix}-next-btn`}
          disabled={page >= totalPages}
          onClick={onNext}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-gray-300 rounded-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
