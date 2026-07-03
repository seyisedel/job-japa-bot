import React, { useState } from "react";
import { LogIn, Lock, AlertTriangle, Mail, Eye, EyeOff } from "lucide-react";
import { ADMIN_EMAILS_LIST } from "../lib/adminEmails";

export default function LoginPage({ onSignIn, notice }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = await onSignIn(email, password);
    setBusy(false);
    if (!res.ok) setError(res.message);
  };

  return (
    <div
      data-testid="login-page"
      className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-10 font-body"
    >
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-11 w-11 grid place-items-center bg-brand text-white rounded-sm font-heading font-bold text-lg">
            JJ
          </div>
          <div>
            <div className="font-heading font-bold text-gray-900 text-lg leading-none">
              JobJapa
            </div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500 mt-1">
              Admin Console
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm p-8">
          <div className="mb-6">
            <h1 className="font-heading text-2xl font-bold text-gray-900 tracking-tight">
              Sign in
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Restricted to whitelisted JobJapa operators.
            </p>
          </div>

          {notice && (
            <div
              data-testid="login-notice"
              className="mb-4 flex items-start gap-2 border border-amber-200 bg-amber-50 text-amber-900 rounded-sm px-3 py-2 text-sm"
            >
              <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500 mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="admin-email"
                  data-testid="login-email-input"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jobjapa.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="admin-password"
                  data-testid="login-password-input"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-300 rounded-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                />
                <button
                  type="button"
                  data-testid="login-toggle-password"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand rounded-sm"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                data-testid="login-error"
                className="flex items-start gap-2 border border-red-200 bg-red-50 text-red-800 rounded-sm px-3 py-2 text-sm"
              >
                <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              data-testid="login-submit-btn"
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 bg-brand text-white hover:bg-brand-hover rounded-sm px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-70"
            >
              {busy ? (
                "Signing in…"
              ) : (
                <>
                  <LogIn size={14} /> Sign in
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="text-[11px] uppercase tracking-[0.14em] text-gray-500 mb-2">
              Session policy
            </div>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li>15 minutes of inactivity signs you out.</li>
              <li>Sessions expire after 8 hours regardless of activity.</li>
            </ul>
          </div>
        </div>

        {ADMIN_EMAILS_LIST.length === 0 && (
          <div
            data-testid="login-config-warning"
            className="mt-4 border border-red-200 bg-red-50 text-red-800 rounded-sm p-3 text-xs"
          >
            <strong>No admin emails configured.</strong> Set{" "}
            <code className="font-mono-num">REACT_APP_ADMIN_EMAILS</code> in{" "}
            <code className="font-mono-num">/app/frontend/.env</code> (comma-separated),
            then restart the frontend.
          </div>
        )}
      </div>
    </div>
  );
}
