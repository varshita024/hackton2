"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      document.cookie = "isAuthenticated=; path=/; max-age=0";
    }
    router.push("/");
  };

  return (
    <nav className="fixed top-0 right-0 left-0 h-16 bg-card border-b z-50 lg:hidden">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-semibold text-lg">Fraud Shield AI</span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-card border-b shadow-lg">
          <div className="p-4 space-y-2">
            <MobileNavLink href="/dashboard">Dashboard</MobileNavLink>
            <MobileNavLink href="/live-tracking">Live Tracking</MobileNavLink>
            <MobileNavLink href="/alerts">Alerts</MobileNavLink>
            <MobileNavLink href="/transactions">Transactions</MobileNavLink>
            <MobileNavLink href="/ai-insights">AI Insights</MobileNavLink>
            <MobileNavLink href="/profile">Profile</MobileNavLink>
            <MobileNavLink href="/settings">Settings</MobileNavLink>
            <MobileNavLink href="/admin-review">Admin Review</MobileNavLink>
            <div className="pt-2 border-t">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <a
      href={href}
      className="block px-4 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
    >
      {children}
    </a>
  );
};
