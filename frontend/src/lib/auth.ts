// Student/user auth client for the local Express backend.
// Stores the access token under `tricube_token` (already read by payments/courses).
import { API_BASE } from "./payments";

const TOKEN_KEY = "tricube_token";
const REFRESH_KEY = "tricube_refresh";
const USER_KEY = "tricube_user";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: "student" | "admin" | "super_admin" | "trainer" | "guest";
  phone?: string | null;
  avatarUrl?: string | null;
  emailVerified?: boolean;
  student?: {
    college?: string | null;
    branch?: string | null;
    yearOfStudy?: number | null;
    city?: string | null;
    linkedin?: string | null;
    github?: string | null;
  } | null;
};

type LoginResponse = {
  ok: true;
  access: string;
  refresh: string;
  user: AuthUser;
};

// ---------- storage ----------

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function getRefresh(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}
export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function persist({ access, refresh, user }: LoginResponse) {
  localStorage.setItem(TOKEN_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("tricube:auth"));
}

export function signOut() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("tricube:auth"));
}

// ---------- fetch helpers ----------

async function post<T>(path: string, body: unknown, auth = false): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const t = getToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const r = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `Request failed (${r.status})`);
  return j as T;
}

// ---------- endpoints ----------

export async function register(input: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<{ ok: true; userId: number; mailSent?: boolean; devOtp?: string }> {
  return post("/api/auth/register", input);
}

export async function verifyOtp(email: string, otp: string): Promise<LoginResponse> {
  const res = await post<LoginResponse>("/api/auth/verify-otp", { email, otp });
  persist(res);
  return res;
}

export async function resendOtp(
  email: string,
): Promise<{ ok: true; mailSent?: boolean; devOtp?: string }> {
  return post("/api/auth/resend-otp", { email });
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await post<LoginResponse>("/api/auth/login", { email, password });
  persist(res);
  return res;
}

export async function forgotPassword(
  email: string,
): Promise<{ ok: true; mailSent?: boolean; devOtp?: string }> {
  return post("/api/auth/forgot-password", { email });
}

export async function resetPassword(
  email: string,
  otp: string,
  password: string,
): Promise<{ ok: true }> {
  return post("/api/auth/reset-password", { email, otp, password });
}

export async function fetchMe(): Promise<AuthUser | null> {
  const t = getToken();
  if (!t) return null;
  const r = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${t}` },
  });
  if (r.status === 401) {
    signOut();
    return null;
  }
  if (!r.ok) throw new Error("Failed to load profile");
  const j = await r.json();
  const user = j.user as AuthUser;
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

// ---------- react hook ----------

import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  useEffect(() => {
    const sync = () => setUser(getStoredUser());
    window.addEventListener("tricube:auth", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("tricube:auth", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return { user, isAuthenticated: !!user, signOut };
}
