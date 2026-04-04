"use client";

import { useEffect, useState } from "react";
import { fetchCurrentUser, type BackendUser } from "@/lib/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_RESQ_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000";

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<BackendUser | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      try {
        const payload = await fetchCurrentUser();
        if (!active) {
          return;
        }
        setCurrentUser(payload);
      } catch (error) {
        if (!active) {
          return;
        }
        setLoadError(error instanceof Error ? error.message : "Failed to load account settings.");
      }
    };

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="app-page">
      <div className="app-page-inner space-y-6">
        <p className="app-hero-text">Review the backend connection and the staff account currently being used by this dashboard.</p>

        {loadError ? (
          <section className="app-card">
            <h2 className="app-card-title">Backend Connection Error</h2>
            <p className="app-card-body">{loadError}</p>
          </section>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="app-card">
            <h2 className="app-card-title">Backend Connection</h2>
            <div className="space-y-2 text-sm text-slate-300">
              <p>API Base URL: {API_BASE_URL}</p>
              <p>Status: Connected through FastAPI</p>
            </div>
          </article>

          <article className="app-card">
            <h2 className="app-card-title">Current Account</h2>
            {currentUser ? (
              <div className="space-y-2 text-sm text-slate-300">
                <p>Name: {currentUser.name}</p>
                <p>Phone Number: {currentUser.phone_number}</p>
                <p>Role: {currentUser.role}</p>
                <p>Created: {currentUser.created_at ? new Date(currentUser.created_at).toLocaleString() : "Unknown"}</p>
              </div>
            ) : (
              <p className="app-card-body">No authenticated staff account found yet.</p>
            )}
          </article>
        </section>
      </div>
    </div>
  );
}
