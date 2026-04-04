"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { getStoredUser, loginStaff, saveSession, type BackendUser } from "@/lib/api";

export default function HomePage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<BackendUser | null>(null);

  useEffect(() => {
    setCurrentUser(getStoredUser());
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginStaff(phoneNumber, password);
      saveSession(response.token, response.user, rememberMe);
      setCurrentUser(response.user);
      setPassword("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not log in.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app-page">
      <div className="app-page-inner-narrow app-hero-card">
        <h1 className="app-hero-title">ResQ Admin Portal</h1>
        <p className="app-hero-text">
          This portal connects to the FastAPI backend for live reports, map coverage, and station monitoring.
        </p>

        {currentUser ? (
          <section className="rounded-2xl border border-white/10 bg-[#1a2433] p-6">
            <p className="text-sm text-slate-300">Signed in as</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">{currentUser.name}</h2>
            <p className="mt-1 text-sm text-slate-400">
              {currentUser.role} • {currentUser.phone_number}
            </p>

            <div className="app-grid-2 mt-6">
              <Link href="/dashboard" className="app-link-button text-center">
                Go To Dashboard
              </Link>
              <Link href="/reports" className="app-link-button text-center">
                View Reports
              </Link>
            </div>
          </section>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-[#1a2433] p-6">
              <h2 className="text-xl font-semibold text-white">Staff Login</h2>
              <p className="mt-2 text-sm text-slate-300">
                Use a responder or station admin account from the backend.
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="phone-number">
                    Phone Number
                  </label>
                  <input
                    id="phone-number"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-[#24374f] px-4 py-3 text-white outline-none focus:border-sky-400"
                    placeholder="09123456789"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-[#24374f] px-4 py-3 text-white outline-none focus:border-sky-400"
                    placeholder="Enter password"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  Keep me signed in on this browser
                </label>

                {error ? <p className="text-sm text-red-300">{error}</p> : null}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-lg bg-[#2f4766] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#3d5a8a] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </div>
            </form>

            <section className="rounded-2xl border border-white/10 bg-[#1a2433] p-6">
              <h2 className="text-xl font-semibold text-white">Connected Modules</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p>Dashboard uses live backend reports to build charts and activity summaries.</p>
                <p>Reports page reads real incidents and keeps the current filters.</p>
                <p>Map and responder views stay on the web portal only, since the mobile dispatch app is out of scope.</p>
              </div>
            </section>
          </section>
        )}
      </div>
    </div>
  );
}
