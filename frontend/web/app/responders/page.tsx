"use client";

import { useEffect, useState } from "react";
import { fetchResponders, type BackendResponder } from "@/lib/api";

export default function RespondersPage() {
  const [responders, setResponders] = useState<BackendResponder[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadResponders = async () => {
      try {
        const payload = await fetchResponders();
        if (!active) {
          return;
        }
        setResponders(payload);
      } catch (error) {
        if (!active) {
          return;
        }
        setLoadError(error instanceof Error ? error.message : "Failed to load responders.");
      }
    };

    loadResponders();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="app-page">
      <div className="app-page-inner space-y-6">
        <p className="app-hero-text">Track registered responder and station admin accounts connected to the backend.</p>

        {loadError ? (
          <section className="app-card">
            <h2 className="app-card-title">Backend Connection Error</h2>
            <p className="app-card-body">{loadError}</p>
          </section>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {responders.map((responder) => (
            <article key={responder.id} className="app-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">{responder.name}</h2>
                  <p className="mt-1 text-sm text-slate-300">{responder.role}</p>
                </div>
                <span className="app-tone-pill app-tone-pill--blue">ID {responder.id}</span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <p>Phone: {responder.phone_number}</p>
                <p>Joined: {responder.created_at ? new Date(responder.created_at).toLocaleDateString() : "Unknown"}</p>
                <p>Verifications: {responder.verification_count}</p>
                <p>Reports submitted: {responder.report_count}</p>
              </div>
            </article>
          ))}

          {!loadError && responders.length === 0 ? (
            <article className="app-card">
              <h2 className="app-card-title">No responders yet</h2>
              <p className="app-card-body">Create responder or station admin accounts in the backend to populate this view.</p>
            </article>
          ) : null}
        </section>
      </div>
    </div>
  );
}
