"use client";

import { useEffect, useState } from "react";
import { fetchCurrentUser, type BackendUser } from "@/lib/api";

type ThemePreference = "dark" | "light" | "system";

const THEME_STORAGE_KEY = "resq_theme_preference";

function resolveSystemTheme(): "dark" | "light" {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(preference: ThemePreference) {
  if (typeof document === "undefined") {
    return;
  }

  const resolvedTheme = preference === "system" ? resolveSystemTheme() : preference;
  const root = document.documentElement;

  root.classList.remove("theme-dark", "theme-light");
  root.classList.add(`theme-${resolvedTheme}`);
}

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<BackendUser | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [themePreference, setThemePreference] = useState<ThemePreference>("system");

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

  useEffect(() => {
    const storedPreference = localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null;

    if (storedPreference === "dark" || storedPreference === "light" || storedPreference === "system") {
      setThemePreference(storedPreference);
      applyTheme(storedPreference);
    } else {
      applyTheme("system");
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      const latestPreference = (localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null) ?? "system";
      if (latestPreference === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  function handleThemeChange(nextPreference: ThemePreference) {
    setThemePreference(nextPreference);
    localStorage.setItem(THEME_STORAGE_KEY, nextPreference);
    applyTheme(nextPreference);
  }

  return (
    <div className="app-page">
      <div className="app-page-inner space-y-6">
        <header className="app-settings-header">
          <div>
            <p className="app-settings-kicker">System Settings</p>
            <h1 className="app-settings-title">Appearance and Account</h1>
            <p className="app-settings-text">Manage display preferences like dark mode or light mode, then review the current logged-in account.</p>
          </div>

          <div className="app-settings-badge-wrap">
            <span className="app-tone-pill app-tone-pill--green">Theme ready</span>
          </div>
        </header>

        {loadError ? (
          <section className="app-card">
            <h2 className="app-card-title">Backend Connection Error</h2>
            <p className="app-card-body">{loadError}</p>
          </section>
        ) : null}

        <section className="app-settings-grid">
          <article className="app-settings-card">
            <div className="app-settings-card-header">
              <div>
                <h2 className="app-settings-card-title">Display Settings</h2>
                <p className="app-settings-card-subtitle">Choose how the interface should look across the web portal.</p>
              </div>
              <span className="app-tone-pill app-tone-pill--blue">Theme</span>
            </div>

            <div className="app-settings-fields">
              <div className="app-settings-field app-settings-field--wide">
                <span className="app-settings-field-label">Color Theme</span>
                <select
                  className="app-settings-select"
                  value={themePreference}
                  onChange={(event) => handleThemeChange(event.target.value as ThemePreference)}
                >
                  <option value="dark">Dark mode</option>
                  <option value="light">Light mode</option>
                  <option value="system">System default</option>
                </select>
                <p className="mt-2 text-xs text-slate-300">Theme changes are saved automatically for this browser.</p>
              </div>

              <div className="app-settings-field">
                <span className="app-settings-field-label">Preview</span>
                <span className="app-settings-field-value">
                  {themePreference === "system" ? `Following system (${resolveSystemTheme()})` : `${themePreference} mode active`}
                </span>
              </div>
            </div>
          </article>

          <article className="app-settings-card">
            <div className="app-settings-card-header">
              <div>
                <h2 className="app-settings-card-title">Current Account</h2>
                <p className="app-settings-card-subtitle">Staff account currently tied to this session.</p>
              </div>
              <span className="app-tone-pill app-tone-pill--blue">Staff</span>
            </div>

            {currentUser ? (
              <div className="app-settings-fields">
                <div className="app-settings-field app-settings-field--wide">
                  <span className="app-settings-field-label">Name</span>
                  <span className="app-settings-field-value">{currentUser.name}</span>
                </div>
                <div className="app-settings-field">
                  <span className="app-settings-field-label">Phone Number</span>
                  <span className="app-settings-field-value">{currentUser.phone_number}</span>
                </div>
                <div className="app-settings-field">
                  <span className="app-settings-field-label">Role</span>
                  <span className="app-settings-field-value">{currentUser.role}</span>
                </div>
                <div className="app-settings-field app-settings-field--wide">
                  <span className="app-settings-field-label">Created</span>
                  <span className="app-settings-field-value">
                    {currentUser.created_at ? new Date(currentUser.created_at).toLocaleString() : "Unknown"}
                  </span>
                </div>
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
