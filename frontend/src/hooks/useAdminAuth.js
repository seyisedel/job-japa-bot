import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { isWhitelistedEmail } from "../lib/adminEmails";

const SIGNED_IN_AT = "jobjapa_admin_signed_in_at";
const LAST_ACTIVITY_AT = "jobjapa_admin_last_activity_at";
const IDLE_MS = 15 * 60 * 1000; // 15 minutes
const ABS_MS = 8 * 60 * 60 * 1000; // 8 hours

const readTs = (key) => Number(localStorage.getItem(key) || 0);
const writeTs = (key, ts = Date.now()) =>
  localStorage.setItem(key, String(ts));
const clearTs = () => {
  localStorage.removeItem(SIGNED_IN_AT);
  localStorage.removeItem(LAST_ACTIVITY_AT);
};

export function useAdminAuth() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const idleTimer = useRef(null);
  const absTimer = useRef(null);

  const doSignOut = useCallback(async (reason) => {
    if (reason) setNotice(reason);
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    if (absTimer.current) window.clearTimeout(absTimer.current);
    clearTs();
    setSession(null);
    if (supabase) {
      try {
        await supabase.auth.signOut({ scope: "local" });
      } catch (_) {
        /* ignore */
      }
    }
  }, []);

  const scheduleTimers = useCallback(() => {
    if (!session) return;

    let signedInAt = readTs(SIGNED_IN_AT);
    let lastActivityAt = readTs(LAST_ACTIVITY_AT);
    const now = Date.now();
    if (!signedInAt) {
      signedInAt = now;
      writeTs(SIGNED_IN_AT, signedInAt);
    }
    if (!lastActivityAt) {
      lastActivityAt = now;
      writeTs(LAST_ACTIVITY_AT, lastActivityAt);
    }

    const idleLeft = IDLE_MS - (now - lastActivityAt);
    const absLeft = ABS_MS - (now - signedInAt);

    if (idleLeft <= 0) {
      doSignOut("Signed out after 15 minutes of inactivity.");
      return;
    }
    if (absLeft <= 0) {
      doSignOut("Session expired — 8-hour limit reached. Please sign in again.");
      return;
    }

    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    if (absTimer.current) window.clearTimeout(absTimer.current);

    idleTimer.current = window.setTimeout(
      () => doSignOut("Signed out after 15 minutes of inactivity."),
      idleLeft
    );
    absTimer.current = window.setTimeout(
      () => doSignOut("Session expired — 8-hour limit reached. Please sign in again."),
      absLeft
    );
  }, [session, doSignOut]);

  // Hydrate from Supabase storage + subscribe to auth changes
  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }
    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data: { session: s } }) => {
        if (!mounted) return;
        setSession(s || null);
        setReady(true);
      })
      .catch(() => mounted && setReady(true));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, next) => {
      if (event === "SIGNED_OUT") {
        clearTs();
        setSession(null);
        return;
      }
      if (next) {
        setSession(next);
        if (event === "SIGNED_IN") writeTs(SIGNED_IN_AT);
        if (event === "SIGNED_IN" || event === "INITIAL_SESSION")
          writeTs(LAST_ACTIVITY_AT);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Enforce whitelist + start timers when session is active
  useEffect(() => {
    if (!session) return undefined;

    if (!isWhitelistedEmail(session.user?.email)) {
      doSignOut("This email is not whitelisted for admin access.");
      return undefined;
    }

    scheduleTimers();

    const touch = () => writeTs(LAST_ACTIVITY_AT);
    const events = ["pointerdown", "keydown", "scroll", "touchstart"];
    events.forEach((e) =>
      window.addEventListener(e, touch, { passive: true })
    );
    // Re-check timers every 30s in case the tab was backgrounded
    const tick = window.setInterval(scheduleTimers, 30_000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, touch));
      window.clearInterval(tick);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      if (absTimer.current) window.clearTimeout(absTimer.current);
    };
  }, [session, scheduleTimers, doSignOut]);

  const signIn = useCallback(async (email, password) => {
    if (!supabase) {
      return {
        ok: false,
        message:
          "Supabase is not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.",
      };
    }
    const normalized = String(email || "").trim().toLowerCase();
    if (!normalized || !password) {
      return { ok: false, message: "Enter your email and password." };
    }
    if (!isWhitelistedEmail(normalized)) {
      return {
        ok: false,
        message: "This email is not whitelisted for admin access.",
      };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalized,
      password,
    });
    if (error) {
      const m = (error.message || "").toLowerCase();
      if (m.includes("invalid login credentials")) {
        return { ok: false, message: "Invalid email or password." };
      }
      if (m.includes("email not confirmed")) {
        return {
          ok: false,
          message:
            "Email not confirmed. Ask the owner to confirm this admin in Supabase Studio.",
        };
      }
      return { ok: false, message: error.message };
    }
    writeTs(SIGNED_IN_AT);
    writeTs(LAST_ACTIVITY_AT);
    setNotice("");
    return { ok: true, session: data.session };
  }, []);

  return {
    session,
    ready,
    notice,
    clearNotice: () => setNotice(""),
    signIn,
    signOut: doSignOut,
  };
}
