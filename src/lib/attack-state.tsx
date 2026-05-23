"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AttackState {
  isAttacking: boolean;
  attackType: string;
  attackLog: string[];
  transactions: any[];
}

const AttackStateContext = createContext<{
  attackState: AttackState;
  updateAttackState: (updates: Partial<AttackState>) => void;
} | null>(null);

const STORAGE_KEY = "fraud-shield-attack-state";

export function AttackStateProvider({ children }: { children: React.ReactNode }) {
  const [attackState, setAttackState] = useState<AttackState>({
    isAttacking: false,
    attackType: "",
    attackLog: [],
    transactions: [],
  });

  // Load initial state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setAttackState(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse attack state:", e);
        }
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(attackState));
    }
  }, [attackState]);

  // Listen for changes from other tabs/pages
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setAttackState(JSON.parse(e.newValue));
        } catch (e) {
          console.error("Failed to parse attack state from storage event:", e);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const updateAttackState = (updates: Partial<AttackState>) => {
    setAttackState(prev => ({ ...prev, ...updates }));
  };

  return (
    <AttackStateContext.Provider value={{ attackState, updateAttackState }}>
      {children}
    </AttackStateContext.Provider>
  );
}

export function useAttackState() {
  const context = useContext(AttackStateContext);
  if (!context) {
    throw new Error("useAttackState must be used within AttackStateProvider");
  }
  return context;
}
