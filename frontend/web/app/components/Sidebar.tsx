"use client";

import Link from "next/link";
import { useState } from "react";

const navigationItems = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Reports", href: "/reports", icon: "📋" },
  { label: "Map", href: "/map", icon: "🗺️" },
  { label: "Responders", href: "/responders", icon: "👥" },
  { label: "Settings", href: "/settings", icon: "⚙️" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-[#24374f] text-white p-2 rounded"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-[#24374f] to-[#1a2637] border-r border-[rgba(190,215,255,0.12)] p-6 transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:w-56`}
      >
        {/* Brand */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#fff] tracking-tight">ResQ</h1>
          <p className="text-xs text-[#a8bce8] mt-1">Admin Portal</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#d6e6ff] hover:bg-[#2f4766] hover:text-white transition-all duration-200 group"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="border-t border-[rgba(190,215,255,0.12)] pt-4">
            <button className="w-full text-left px-4 py-2 rounded-lg text-xs text-[#a8bce8] hover:text-white hover:bg-[#2f4766] transition-all">
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
