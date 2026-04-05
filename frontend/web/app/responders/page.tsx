"use client";

import { useMemo, useEffect, useState } from "react";
import { fetchResponders, type BackendResponder } from "@/lib/api";

export default function RespondersPage() {
  const [responders, setResponders] = useState<BackendResponder[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredResponders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return responders;
    }

    return responders.filter((responder) => {
      return [responder.name, responder.role, responder.phone_number]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [responders, searchQuery]);

  const roleCounts = useMemo(() => {
    const counts = responders.reduce(
      (accumulator, responder) => {
        const role = responder.role.toLowerCase();

        if (role.includes("admin") || role.includes("coordinator")) {
          accumulator.admin += 1;
        } else {
          accumulator.responder += 1;
        }

        return accumulator;
      },
      { responder: 0, admin: 0 },
    );

    return counts;
  }, [responders]);

  return (
    <div className="app-page">
      <div className="app-page-inner space-y-6">
        <header className="app-directory-header">
          <div>
            <p className="app-directory-kicker">Directory</p>
            <h1 className="app-directory-title">Responders and Admins</h1>
            <p className="app-directory-text">Track registered responder and station admin accounts.</p>
          </div>

          <div className="app-directory-stats">
            <div className="app-directory-stat">
              <span className="app-directory-stat-label">Total</span>
              <strong className="app-directory-stat-value">{responders.length}</strong>
            </div>
            <div className="app-directory-stat">
              <span className="app-directory-stat-label">Responders</span>
              <strong className="app-directory-stat-value">{roleCounts.responder}</strong>
            </div>
            <div className="app-directory-stat">
              <span className="app-directory-stat-label">Admins</span>
              <strong className="app-directory-stat-value">{roleCounts.admin}</strong>
            </div>
          </div>
        </header>

        <section className="app-directory-toolbar">
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="app-directory-search"
            placeholder="Search by name, role, or phone number"
            aria-label="Search responders"
          />
        </section>

        {loadError ? (
          <section className="app-card">
            <h2 className="app-card-title">Backend Connection Error</h2>
            <p className="app-card-body">{loadError}</p>
          </section>
        ) : null}

        <section className="app-directory-grid">
          {filteredResponders.map((responder) => (
            <article key={responder.id} className="app-directory-card">
              <div className="app-directory-card-header">
                <div>
                  <h2 className="app-directory-card-title">{responder.name}</h2>
                  <p className="app-directory-card-subtitle">{responder.role}</p>
                </div>
                <span className="app-tone-pill app-tone-pill--blue">ID {responder.id}</span>
              </div>

              <div className="app-directory-card-body">
                <div className="app-directory-field">
                  <span className="app-directory-field-label">Phone</span>
                  <span className="app-directory-field-value">{responder.phone_number}</span>
                </div>
                <div className="app-directory-field">
                  <span className="app-directory-field-label">Joined</span>
                  <span className="app-directory-field-value">{responder.created_at ? new Date(responder.created_at).toLocaleDateString() : "Unknown"}</span>
                </div>
                <div className="app-directory-field">
                  <span className="app-directory-field-label">Verifications</span>
                  <span className="app-directory-field-value">{responder.verification_count}</span>
                </div>
                <div className="app-directory-field">
                  <span className="app-directory-field-label">Reports</span>
                  <span className="app-directory-field-value">{responder.report_count}</span>
                </div>
              </div>
            </article>
          ))}

          {!loadError && filteredResponders.length === 0 ? (
            <article className="app-card">
              <h2 className="app-card-title">No matching accounts</h2>
              <p className="app-card-body">Try a different search term or add responder and admin accounts in the backend.</p>
            </article>
          ) : null}
        </section>
      </div>
    </div>
  );
}
