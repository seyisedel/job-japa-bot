// Client-side admin whitelist. Configured via REACT_APP_ADMIN_EMAILS
// (comma-separated). This is a UI guard; the real authz boundary is Supabase.

const raw = process.env.REACT_APP_ADMIN_EMAILS || "";
const list = raw
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const ADMIN_EMAILS = new Set(list);
export const ADMIN_EMAILS_LIST = list;

export function isWhitelistedEmail(email) {
  if (!email) return false;
  return ADMIN_EMAILS.has(String(email).trim().toLowerCase());
}
