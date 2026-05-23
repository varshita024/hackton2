"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useAttackState } from "@/lib/attack-state";
import { useToast } from "@/components/ui/toast";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FirestoreUser {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  role?: string;
  createdAt?: string;
  attackStatus: "idle" | "attacking";
  attackType: string;
}

interface LiveTransaction {
  id: string;
  user: string;
  amount: string;
  type: string;
  risk: number;
  location: string;
  time: string;
  status: "safe" | "suspicious" | "blocked";
}

// ─── Constants ────────────────────────────────────────────────────────────────

const fraudTypes = [
  "OTP Fraud",
  "Phishing",
  "Card Fraud",
  "ATM Fraud",
  "Account Takeover",
  "Suspicious Transfer",
  "IP/Device Mismatch",
];

const txTypes = [
  "UPI Transfer", "Net Banking", "Card Payment", "ATM Withdrawal",
  "IMPS Transfer", "NEFT Transfer", "Wallet Top-up", "International Wire",
];

const locations = [
  "Mumbai, IN", "Delhi, IN", "Bangalore, IN", "Lagos, NG",
  "London, UK", "Unknown VPN", "Moscow, RU", "Dubai, UAE",
  "Chennai, IN", "Hyderabad, IN", "Kolkata, IN", "Singapore, SG",
];

const names = [
  "Rahul K.", "Priya S.", "Amit V.", "Sneha M.", "Kiran P.",
  "Deepak R.", "Anita L.", "Vijay T.", "Meera J.", "Suresh B.",
];

function generateTransaction(): LiveTransaction {
  const risk = Math.floor(Math.random() * 100);
  return {
    id: `TXN-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
    user: names[Math.floor(Math.random() * names.length)],
    amount: "₹" + (Math.random() * 99000 + 1000).toFixed(2),
    type: txTypes[Math.floor(Math.random() * txTypes.length)],
    risk,
    location: locations[Math.floor(Math.random() * locations.length)],
    time: new Date().toLocaleTimeString(),
    status: risk >= 75 ? "blocked" : risk >= 45 ? "suspicious" : "safe",
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LiveTrackingPage() {
  const { attackState, updateAttackState } = useAttackState();
  const { showToast } = useToast();

  // Firestore users
  const [firestoreUsers, setFirestoreUsers] = useState<FirestoreUser[]>([]);
  const [firestoreLoading, setFirestoreLoading] = useState(true);

  // Per-user fraud type dropdown
  const [userFraudType, setUserFraudType] = useState<Record<string, string>>({});

  // Dynamic transactions
  const [transactions, setTransactions] = useState<LiveTransaction[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [totalGenerated, setTotalGenerated] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPausedRef = useRef(false);

  // Attack state
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackLog, setAttackLog] = useState<string[]>([]);
  const [warningModal, setWarningModal] = useState<{ show: boolean; transaction: any }>({ show: false, transaction: null });
  const [cooldown, setCooldown] = useState(false);

  // ── Firestore real-time listener ─────────────────────────────────────────
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        setFirestoreUsers((prev) => {
          const prevMap = Object.fromEntries(prev.map((u) => [u.uid, u]));
          return snapshot.docs.map((doc) => {
            const data = doc.data();
            const existing = prevMap[doc.id];
            return {
              uid: doc.id,
              fullName: data.fullName || "Unknown User",
              email: data.email || "—",
              phone: data.phone || "N/A",
              role: data.role || "user",
              createdAt: data.createdAt?.toDate?.()?.toLocaleDateString() || "—",
              attackStatus: existing?.attackStatus ?? "idle",
              attackType: existing?.attackType ?? "",
            };
          });
        });
        setFirestoreLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setFirestoreLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // ── AI transaction generator (20/min = 1 every 3 s) ─────────────────────
  const startGenerator = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (isPausedRef.current) return;
      const tx = generateTransaction();
      setTransactions((prev) => [tx, ...prev].slice(0, 100)); // keep last 100
      setTotalGenerated((n) => n + 1);
    }, 3000); // 3 s → 20 per minute
  }, []);

  useEffect(() => {
    startGenerator();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startGenerator]);

  const togglePause = () => {
    isPausedRef.current = !isPausedRef.current;
    setIsPaused(isPausedRef.current);
    showToast(isPausedRef.current ? "⏸ Transaction feed paused" : "▶ Transaction feed resumed", "success");
  };

  // ── Attack helpers ────────────────────────────────────────────────────────
  const startAttackOnUser = async (uid: string) => {
    const fraudType = userFraudType[uid] || fraudTypes[0];
    setFirestoreUsers((prev) =>
      prev.map((u) => u.uid === uid ? { ...u, attackStatus: "attacking", attackType: fraudType } : u)
    );
    setIsAttacking(true);
    updateAttackState({ isAttacking: true, attackType: fraudType });
    const target = firestoreUsers.find((u) => u.uid === uid);
    showToast(`🚨 Attack started: ${fraudType} on ${target?.fullName}`, "warning");

    const messages = [
      `⚠️ ALERT: ${fraudType} detected for ${target?.fullName}`,
      `🔒 Security: Suspicious activity flagged on account`,
      `📱 SMS: Verify transaction — Reply YES or NO`,
      `⏰ Time-sensitive: Immediate action required`,
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        const msg = messages[i];
        setAttackLog((prev) => [...prev, msg]);
        updateAttackState({ attackLog: [...attackState.attackLog, msg] });
        i++;
      } else {
        clearInterval(interval);
        setWarningModal({
          show: true,
          transaction: {
            id: `TXN-${Date.now()}`,
            amount: "₹" + (Math.random() * 50000 + 5000).toFixed(2),
            fraudType,
            targetName: target?.fullName,
            risk: Math.floor(Math.random() * 30) + 70,
          },
        });
      }
    }, 1500);
  };

  const stopAttackOnUser = (uid: string) => {
    setFirestoreUsers((prev) =>
      prev.map((u) => u.uid === uid ? { ...u, attackStatus: "idle", attackType: "" } : u)
    );
    setIsAttacking(false);
    setAttackLog((prev) => [...prev, `🛑 Attack stopped`]);
    updateAttackState({ isAttacking: false, attackType: "" });
    showToast("✅ Attack stopped", "success");
  };

  const handleTransactionDecision = (decision: "yes" | "no") => {
    const tx = warningModal.transaction;
    if (decision === "yes") {
      const msg = `✅ Transaction ${tx.id} APPROVED by user`;
      setAttackLog((prev) => [...prev, msg]);
      updateAttackState({ attackLog: [...attackState.attackLog, msg], transactions: [...attackState.transactions, { ...tx, status: "approved" }] });
      showToast("✅ Transaction approved", "success");
    } else {
      const msg = `🚫 Transaction ${tx.id} BLOCKED by user`;
      setAttackLog((prev) => [...prev, msg]);
      updateAttackState({ attackLog: [...attackState.attackLog, msg], transactions: [...attackState.transactions, { ...tx, status: "blocked" }] });
      setCooldown(true);
      setTimeout(() => setCooldown(false), 5000);
      showToast("🚫 Transaction blocked — Security cooldown active", "error");
    }
    setWarningModal({ show: false, transaction: null });
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const safeTx = transactions.filter((t) => t.status === "safe").length;
  const suspTx = transactions.filter((t) => t.status === "suspicious").length;
  const blockedTx = transactions.filter((t) => t.status === "blocked").length;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Live Attack Simulation</h1>
        <p className="text-muted-foreground">AI-generated transactions stream in real-time. Target real users with simulated fraud attacks.</p>
      </div>

      {/* ── Stats Bar ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Generated", value: totalGenerated, color: "text-primary" },
          { label: "Safe", value: safeTx, color: "text-emerald-500" },
          { label: "Suspicious", value: suspTx, color: "text-amber-500" },
          { label: "Blocked", value: blockedTx, color: "text-red-500" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── AI Transaction Feed ───────────────────────────────────────────── */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full ${isPaused ? "bg-amber-400" : "bg-blue-500 animate-pulse"}`} />
            AI Transaction Feed
            <Badge variant="default" className="text-xs ml-1">~20/min</Badge>
            <div className="ml-auto flex gap-2">
              <Button size="sm" variant={isPaused ? "primary" : "outline"} onClick={togglePause}>
                {isPaused ? "▶ Resume" : "⏸ Pause"}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPaused && (
            <div className="mb-3 p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium">
              ⏸ Feed paused — click Resume to continue
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b">
                  <th className="text-left py-2 pr-4">Time</th>
                  <th className="text-left py-2 pr-4">User</th>
                  <th className="text-left py-2 pr-4">Type</th>
                  <th className="text-left py-2 pr-4">Amount</th>
                  <th className="text-left py-2 pr-4">Location</th>
                  <th className="text-left py-2 pr-4">Risk</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Generating transactions...</td></tr>
                ) : (
                  transactions.slice(0, 20).map((tx) => (
                    <tr key={tx.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-2 pr-4 text-xs text-muted-foreground">{tx.time}</td>
                      <td className="py-2 pr-4 font-medium">{tx.user}</td>
                      <td className="py-2 pr-4 text-xs">{tx.type}</td>
                      <td className="py-2 pr-4 font-semibold">{tx.amount}</td>
                      <td className="py-2 pr-4 text-xs">{tx.location}</td>
                      <td className="py-2 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${tx.risk >= 75 ? "bg-red-500" : tx.risk >= 45 ? "bg-amber-500" : "bg-emerald-500"}`}
                              style={{ width: `${tx.risk}%` }}
                            />
                          </div>
                          <span className="text-xs">{tx.risk}%</span>
                        </div>
                      </td>
                      <td className="py-2">
                        <Badge variant={tx.status === "blocked" ? "danger" : tx.status === "suspicious" ? "warning" : "success"}>
                          {tx.status === "blocked" ? "🚫 Blocked" : tx.status === "suspicious" ? "⚠️ Suspicious" : "✅ Safe"}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Targeted Users ────────────────────────────────────────────────── */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isAttacking ? "bg-red-500 animate-pulse" : "bg-orange-500"}`} />
            Targeted Users
            <Badge variant="default" className="ml-auto text-xs">{firestoreUsers.length} registered</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {firestoreLoading ? (
            <div className="flex items-center gap-3 py-6 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Loading users from database...
            </div>
          ) : firestoreUsers.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">👥</div>
              <p className="text-muted-foreground">No users have signed up yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Signed-up users will appear here automatically in real-time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {firestoreUsers.map((user) => (
                <div
                  key={user.uid}
                  className={`rounded-xl border p-4 transition-all duration-300 ${
                    user.attackStatus === "attacking"
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20 shadow-lg shadow-red-500/10"
                      : "bg-card border-border hover:shadow-md"
                  }`}
                >
                  {/* Profile Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      <p className="text-xs text-muted-foreground">{user.phone}</p>
                    </div>
                    <Badge variant={user.attackStatus === "attacking" ? "danger" : "default"} className="shrink-0 text-xs">
                      {user.attackStatus === "attacking" ? "🔴 Targeted" : "🟢 Safe"}
                    </Badge>
                  </div>

                  {/* Profile Info */}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div className="bg-muted/50 rounded-lg p-2">
                      <p className="text-muted-foreground">Role</p>
                      <p className="font-medium capitalize">{user.role || "user"}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <p className="text-muted-foreground">Joined</p>
                      <p className="font-medium">{user.createdAt}</p>
                    </div>
                  </div>

                  {/* Attack type indicator */}
                  {user.attackStatus === "attacking" && (
                    <div className="mb-3 p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-xs">
                      <p className="font-semibold text-red-700 dark:text-red-400">⚠️ {user.attackType}</p>
                    </div>
                  )}

                  {/* Fraud Type Dropdown — only for targeted users */}
                  <div className="mb-3">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Select Attack Type</label>
                    <select
                      value={userFraudType[user.uid] || fraudTypes[0]}
                      onChange={(e) => setUserFraudType((prev) => ({ ...prev, [user.uid]: e.target.value }))}
                      disabled={user.attackStatus === "attacking"}
                      className="w-full px-3 py-2 text-xs rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    >
                      {fraudTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Attack / Stop Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => startAttackOnUser(user.uid)}
                      disabled={isAttacking || cooldown}
                      className="flex-1 text-xs"
                    >
                      🚀 Attack
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => stopAttackOnUser(user.uid)}
                      disabled={user.attackStatus !== "attacking"}
                      variant="outline"
                      className="flex-1 text-xs"
                    >
                      🛑 Stop
                    </Button>
                  </div>

                  {cooldown && user.attackStatus === "idle" && (
                    <p className="text-xs text-amber-600 mt-2 text-center">⏳ Cooldown active...</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Attack Log ────────────────────────────────────────────────────── */}
      {attackLog.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Attack Log
              <Button size="sm" variant="outline" onClick={() => setAttackLog([])}>Clear</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black/70 rounded-lg p-4 h-48 overflow-y-auto font-mono text-sm space-y-1">
              {attackLog.map((log, i) => (
                <div key={i} className="text-green-400">
                  <span className="text-muted-foreground text-xs">[{new Date().toLocaleTimeString()}]</span> {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Warning Modal ─────────────────────────────────────────────────── */}
      <Modal
        isOpen={warningModal.show}
        onClose={() => setWarningModal({ show: false, transaction: null })}
        title="⚠️ Suspicious Transaction Detected"
      >
        {warningModal.transaction && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30">
              <p className="font-semibold text-red-800 dark:text-red-400">
                {warningModal.transaction.fraudType}
              </p>
              {warningModal.transaction.targetName && (
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Target: {warningModal.transaction.targetName}
                </p>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-medium font-mono">{warningModal.transaction.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-bold text-red-600">{warningModal.transaction.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risk Level:</span>
                <Badge variant="danger">{warningModal.transaction.risk}%</Badge>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-sm">
              <p className="font-medium text-amber-800 dark:text-amber-400">Why this is risky:</p>
              <p className="text-amber-700 dark:text-amber-300 mt-1">
                This transaction matches known patterns for {warningModal.transaction.fraudType}.
                Unusual device fingerprint and location detected.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">Do you want to continue with this transaction?</p>
            <div className="flex gap-3">
              <Button onClick={() => handleTransactionDecision("yes")} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                ✓ Yes, Continue
              </Button>
              <Button onClick={() => handleTransactionDecision("no")} variant="outline" className="flex-1 border-red-500 text-red-600 hover:bg-red-50">
                ✗ No, Block It
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
