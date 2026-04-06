"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser, loginStaff, saveSession, type BackendUser } from "@/lib/api";

export default function HomePage() {
  const router = useRouter();
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
      router.push("/dashboard");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not log in.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app-page app-auth-page">
      <div className="app-page-inner-narrow app-auth-card">
        <img
          src="/resq-header.png"
          alt="ResQ"
          className="app-auth-logo"
        />
        <h1 className="app-auth-title">Admin Portal</h1>
        <p className="app-auth-text">
          Sign in with a staff account to access reports and monitoring tools.
        </p>

        {currentUser ? (
          <p className="app-auth-status">
            Signed in as {currentUser.name}.
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="app-auth-form">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="phone-number">
              Username
            </label>
            <input
              id="phone-number"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              className="w-full rounded-lg border border-white/15 bg-[#24374f] px-4 py-3 text-white outline-none focus:border-sky-400"
              placeholder="admin"
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
              placeholder="1234"
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
        </form>
      </div>
    </div>
  );
}
