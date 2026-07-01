// Mock dataset used when Supabase env vars aren't provided.
// Shape mirrors the expected Supabase tables so swap-in is seamless.

const NIGERIAN_PREFIXES = ["803", "806", "813", "814", "816", "703", "706", "810", "704", "812", "907", "908", "705"];
const PAY_TYPES = ["pro_monthly", "pro_yearly", "cv_rewrite", "one_time"];
const PAY_STATUSES = ["success", "pending", "failed"];
const SUB_STATUSES = ["free", "pro", "pro", "pro", "expired", "free"];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function phone() {
  return `+234${pick(NIGERIAN_PREFIXES)}${rand(1000000, 9999999)}`;
}

function isoDate(daysAgoMax = 240) {
  const d = new Date();
  d.setDate(d.getDate() - rand(0, daysAgoMax));
  d.setHours(rand(0, 23), rand(0, 59), rand(0, 59), 0);
  return d.toISOString();
}

function ref() {
  const s = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "JJ-";
  for (let i = 0; i < 10; i++) out += s[Math.floor(Math.random() * s.length)];
  return out;
}

const seedUsers = () => {
  const rows = [];
  for (let i = 0; i < 47; i++) {
    const sub = pick(SUB_STATUSES);
    rows.push({
      id: `u_${i + 1}`,
      phone_number: phone(),
      subscription_status: sub,
      cv_rewrites_used: sub === "pro" ? rand(0, 12) : rand(0, 3),
      created_at: isoDate(300),
    });
  }
  return rows;
};

const seedPayments = () => {
  const rows = [];
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const isoInCurrentMonth = () => {
    const d = new Date(monthStart);
    const daysIntoMonth = Math.min(
      Math.max(0, Math.floor((now - monthStart) / (1000 * 60 * 60 * 24))),
      27
    );
    d.setDate(d.getDate() + rand(0, daysIntoMonth));
    d.setHours(rand(0, 23), rand(0, 59), rand(0, 59), 0);
    return d.toISOString();
  };

  for (let i = 0; i < 68; i++) {
    const type = pick(PAY_TYPES);
    // First 18 payments: successful and dated within the current month so the
    // "Monthly Revenue" stat has a meaningful value in preview/mock mode.
    const forceCurrentMonthSuccess = i < 18;
    const status = forceCurrentMonthSuccess ? "success" : pick(PAY_STATUSES);
    const amount =
      type === "pro_yearly"
        ? 25000
        : type === "pro_monthly"
        ? 3500
        : type === "cv_rewrite"
        ? 1500
        : rand(500, 5000);
    rows.push({
      id: `p_${i + 1}`,
      reference: ref(),
      amount,
      type,
      status,
      created_at: forceCurrentMonthSuccess ? isoInCurrentMonth() : isoDate(120),
    });
  }
  return rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

export const MOCK_USERS = seedUsers();
export const MOCK_PAYMENTS = seedPayments();
