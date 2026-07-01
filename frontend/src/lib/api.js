import { supabase, USE_MOCK_DATA } from "./supabaseClient";
import { MOCK_USERS, MOCK_PAYMENTS } from "./mockData";

// ---------- Helpers ----------
export function formatNaira(amount) {
  const n = Number(amount || 0);
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  })
    .format(n)
    .replace("NGN", "₦");
}

export function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-NG", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------- Data fetchers ----------
export async function fetchUsers() {
  if (USE_MOCK_DATA) {
    await new Promise((r) => setTimeout(r, 250));
    return { data: MOCK_USERS, error: null, source: "mock" };
  }
  // Try with `name` column first; if it doesn't exist, fall back gracefully.
  let { data, error } = await supabase
    .from("users")
    .select("id, name, phone_number, subscription_status, cv_rewrites_used, created_at")
    .order("created_at", { ascending: false });
  if (error && /column .*name.* does not exist/i.test(error.message || "")) {
    const retry = await supabase
      .from("users")
      .select("id, phone_number, subscription_status, cv_rewrites_used, created_at")
      .order("created_at", { ascending: false });
    data = retry.data;
    error = retry.error;
  }
  return { data: data || [], error, source: "supabase" };
}

export async function fetchPayments() {
  if (USE_MOCK_DATA) {
    await new Promise((r) => setTimeout(r, 250));
    return { data: MOCK_PAYMENTS, error: null, source: "mock" };
  }
  const { data, error } = await supabase
    .from("payments")
    .select("id, reference, amount, type, status, created_at")
    .order("created_at", { ascending: false });
  return { data: data || [], error, source: "supabase" };
}

// ---------- Stats ----------
export function computeStats(users, payments) {
  const totalUsers = users.length;
  const totalPro = users.filter(
    (u) => (u.subscription_status || "").toLowerCase() === "pro"
  ).length;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyRevenue = payments
    .filter(
      (p) =>
        (p.status || "").toLowerCase() === "success" &&
        p.created_at &&
        new Date(p.created_at) >= monthStart
    )
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return { totalUsers, totalPro, monthlyRevenue };
}
