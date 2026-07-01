import React, { useCallback, useEffect, useState } from "react";
import {
  Users as UsersIcon,
  Sparkles,
  Coins,
  RefreshCw,
  Database,
  AlertTriangle,
} from "lucide-react";
import StatCard from "./components/StatCard";
import UsersTable from "./components/UsersTable";
import PaymentsTable from "./components/PaymentsTable";
import {
  computeStats,
  fetchPayments,
  fetchUsers,
  formatNaira,
} from "./lib/api";
import { USE_MOCK_DATA } from "./lib/supabaseClient";
import "./App.css";

export default function App() {
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [source, setSource] = useState("mock");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [u, p] = await Promise.all([fetchUsers(), fetchPayments()]);
      if (u.error) throw u.error;
      if (p.error) throw p.error;
      setUsers(u.data);
      setPayments(p.data);
      setSource(u.source);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e.message || "Failed to load data. Check Supabase configuration.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = computeStats(users, payments);
  const monthLabel = new Date().toLocaleDateString("en-NG", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-body">
      {/* Top bar */}
      <header
        data-testid="app-header"
        className="sticky top-0 z-20 bg-white border-b border-gray-200"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 grid place-items-center bg-brand text-white rounded-sm font-heading font-bold">
              JJ
            </div>
            <div>
              <div className="font-heading font-bold text-gray-900 leading-none">
                JobJapa
              </div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500 mt-0.5">
                Admin Console
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
              <Database size={14} />
              <span data-testid="data-source-indicator">
                Source:{" "}
                <span className="font-semibold text-gray-800">
                  {source === "supabase" ? "Supabase (live)" : "Mock preview"}
                </span>
              </span>
            </div>
            <button
              data-testid="refresh-btn"
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-brand text-white hover:bg-brand-hover rounded-sm px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-70"
            >
              <RefreshCw
                size={14}
                className={loading ? "animate-spin" : undefined}
              />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 md:py-10">
        {/* Page title */}
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <h1
              data-testid="page-title"
              className="font-heading text-3xl md:text-4xl font-bold text-gray-900 tracking-tight"
            >
              Operations Overview
            </h1>
            <p className="mt-2 text-sm text-gray-600 max-w-2xl">
              Monitor users, subscriptions, and revenue across the JobJapa
              platform. Data updates in real time from your Supabase project.
            </p>
          </div>
          {lastUpdated && (
            <div className="hidden md:block text-right">
              <div className="text-[11px] uppercase tracking-[0.14em] text-gray-500">
                Last updated
              </div>
              <div
                data-testid="last-updated"
                className="text-sm font-mono-num text-gray-800 mt-1"
              >
                {lastUpdated.toLocaleTimeString("en-NG")}
              </div>
            </div>
          )}
        </div>

        {USE_MOCK_DATA && (
          <div
            data-testid="mock-banner"
            className="mb-6 flex items-start gap-3 border border-amber-200 bg-amber-50 text-amber-900 rounded-sm px-4 py-3"
          >
            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-semibold">Preview mode:</span> Supabase
              credentials are not set — showing seeded mock data. Set{" "}
              <code className="px-1 py-0.5 bg-white/60 rounded text-xs font-mono-num">
                REACT_APP_SUPABASE_URL
              </code>{" "}
              and{" "}
              <code className="px-1 py-0.5 bg-white/60 rounded text-xs font-mono-num">
                REACT_APP_SUPABASE_ANON_KEY
              </code>{" "}
              in <code className="font-mono-num">/app/frontend/.env</code> to
              connect to your Supabase project.
            </div>
          </div>
        )}

        {error && (
          <div
            data-testid="error-banner"
            className="mb-6 flex items-start gap-3 border border-red-200 bg-red-50 text-red-800 rounded-sm px-4 py-3"
          >
            <AlertTriangle size={16} className="mt-0.5" />
            <div className="text-sm">{error}</div>
          </div>
        )}

        {/* Stats */}
        <div
          data-testid="stats-grid"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10"
        >
          <StatCard
            testid="stat-total-users"
            label="Total Users"
            value={loading ? "—" : stats.totalUsers.toLocaleString("en-NG")}
            helper="All registered accounts"
            icon={UsersIcon}
            accent="brand"
          />
          <StatCard
            testid="stat-total-pro"
            label="Pro Subscribers"
            value={loading ? "—" : stats.totalPro.toLocaleString("en-NG")}
            helper={
              !loading && stats.totalUsers
                ? `${((stats.totalPro / stats.totalUsers) * 100).toFixed(1)}% of user base`
                : "Active Pro accounts"
            }
            icon={Sparkles}
            accent="accent"
          />
          <StatCard
            testid="stat-monthly-revenue"
            label={`Revenue • ${monthLabel}`}
            value={loading ? "—" : formatNaira(stats.monthlyRevenue)}
            helper="Successful payments this month"
            icon={Coins}
            accent="brand"
          />
        </div>

        <div className="grid grid-cols-1 gap-8">
          <UsersTable users={users} loading={loading} />
          <PaymentsTable payments={payments} loading={loading} />
        </div>

        <footer className="mt-16 pb-4 flex items-center justify-between text-xs text-gray-500">
          <span>
            © {new Date().getFullYear()} JobJapa • Internal admin console
          </span>
          <span className="font-mono-num">v0.1.0</span>
        </footer>
      </main>
    </div>
  );
}
