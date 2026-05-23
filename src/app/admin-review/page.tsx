"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAttackState } from "@/lib/attack-state";
import { EmptyState } from "@/components/ui/empty-state";

interface SuspiciousTransaction {
  id: string;
  user: string;
  amount: number;
  riskScore: number;
  reason: string;
  time: string;
  status: "pending" | "approved" | "rejected";
}

const suspiciousTransactions: SuspiciousTransaction[] = [
  {
    id: "TXN-78291",
    user: "sarah@example.com",
    amount: 45678.00,
    riskScore: 94,
    reason: "Unusual location + high amount",
    time: "10 minutes ago",
    status: "pending",
  },
  {
    id: "TXN-78290",
    user: "mike@example.com",
    amount: 12340.00,
    riskScore: 87,
    reason: "Velocity limit exceeded",
    time: "25 minutes ago",
    status: "pending",
  },
  {
    id: "TXN-78289",
    user: "alex@example.com",
    amount: 8920.00,
    riskScore: 82,
    reason: "New device + unusual pattern",
    time: "45 minutes ago",
    status: "pending",
  },
  {
    id: "TXN-78288",
    user: "emma@example.com",
    amount: 23450.00,
    riskScore: 79,
    reason: "Geographic anomaly",
    time: "1 hour ago",
    status: "pending",
  },
];

export default function AdminReviewPage() {
  const { attackState } = useAttackState();
  const [transactions, setTransactions] = useState<SuspiciousTransaction[]>(suspiciousTransactions);
  const [selectedTab, setSelectedTab] = useState<"queue" | "history" | "security">("queue");

  const handleApprove = (id: string) => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, status: "approved" } : t));
  };

  const handleReject = (id: string) => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, status: "rejected" } : t));
  };

  const pendingCount = transactions.filter(t => t.status === "pending").length;
  const approvedCount = transactions.filter(t => t.status === "approved").length;
  const rejectedCount = transactions.filter(t => t.status === "rejected").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Review</h1>
          <p className="text-muted-foreground">Review and manage flagged transactions</p>
        </div>
        <Button>Export Report</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ReviewStatCard title="Pending Review" value={pendingCount.toString()} color="amber" />
        <ReviewStatCard title="Approved Today" value={approvedCount.toString()} color="emerald" />
        <ReviewStatCard title="Rejected Today" value={rejectedCount.toString()} color="red" />
        <ReviewStatCard title="Avg Review Time" value="2.3m" color="blue" />
      </div>

      {/* Attack Monitoring */}
      {attackState.isAttacking && (
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Active Attack Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
                <p className="font-semibold text-red-800 dark:text-red-400">
                  🚨 ATTACK IN PROGRESS: {attackState.attackType}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Attack Type</p>
                  <p className="font-medium">{attackState.attackType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Messages Sent</p>
                  <p className="font-medium">{attackState.attackLog.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transactions Flagged</p>
                  <p className="font-medium">{attackState.transactions.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="danger">Active</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={selectedTab === "queue" ? "primary" : "outline"}
          onClick={() => setSelectedTab("queue")}
        >
          Suspicious Queue
        </Button>
        <Button
          variant={selectedTab === "history" ? "primary" : "outline"}
          onClick={() => setSelectedTab("history")}
        >
          Review History
        </Button>
        <Button
          variant={selectedTab === "security" ? "primary" : "outline"}
          onClick={() => setSelectedTab("security")}
        >
          Security Overview
        </Button>
      </div>

      {/* Queue Tab */}
      {selectedTab === "queue" && (
        <Card>
          <CardHeader>
            <CardTitle>Flagged Transactions ({pendingCount})</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingCount === 0 ? (
              <EmptyState
                title="No pending transactions"
                description="All transactions have been reviewed. Great job keeping the system secure!"
              />
            ) : (
              <div className="space-y-4">
                {transactions.filter(t => t.status === "pending").map(tx => (
                  <ReviewItem
                    key={tx.id}
                    transaction={tx}
                    onApprove={() => handleApprove(tx.id)}
                    onReject={() => handleReject(tx.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* History Tab */}
      {selectedTab === "history" && (
        <Card>
          <CardHeader>
            <CardTitle>Review History</CardTitle>
          </CardHeader>
          <CardContent>
            {approvedCount + rejectedCount === 0 ? (
              <EmptyState
                title="No review history"
                description="No transactions have been reviewed yet. Start reviewing flagged transactions to build your history."
              />
            ) : (
              <div className="space-y-4">
                {transactions.filter(t => t.status !== "pending").map(tx => (
                  <HistoryItem key={tx.id} transaction={tx} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Security Tab */}
      {selectedTab === "security" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Overview Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SecurityMetric title="Fraud Attempts Today" value="23" trend="+5" />
                <SecurityMetric title="Blocked Transactions" value="18" trend="+3" />
                <SecurityMetric title="False Positives" value="2" trend="-1" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy & Security Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <SecurityConcept
                  title="Homomorphic Encryption"
                  description="Transaction data is encrypted in a way that allows fraud detection algorithms to operate without ever decrypting the sensitive data. Your financial information remains private while still being protected."
                  status="Active"
                />
                <SecurityConcept
                  title="Zero-Knowledge Proofs"
                  description="Users can prove they are legitimate without revealing any sensitive information. The system verifies identity and authorization without accessing private data."
                  status="Active"
                />
                <SecurityConcept
                  title="Dynamic Key Rotation"
                  description="Encryption keys are automatically rotated every 24 hours, ensuring that even if a key is compromised, the window of exposure is minimized."
                  status="Active"
                />
                <SecurityConcept
                  title="Privacy-Preserving Fraud Analysis"
                  description="All fraud detection models are trained on anonymized data. Individual transactions are never stored in plain text, and all analysis happens in encrypted space."
                  status="Active"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div>
                    <p className="font-medium">Encryption Strength</p>
                    <p className="text-sm text-muted-foreground">AES-256-GCM</p>
                  </div>
                  <Badge variant="success">Military Grade</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div>
                    <p className="font-medium">Data Retention</p>
                    <p className="text-sm text-muted-foreground">90 days with automatic deletion</p>
                  </div>
                  <Badge variant="success">GDPR Compliant</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div>
                    <p className="font-medium">Audit Trail</p>
                    <p className="text-sm text-muted-foreground">Immutable logging of all actions</p>
                  </div>
                  <Badge variant="success">Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function ReviewStatCard({ title, value, color }: { title: string; value: string; color: string }) {
  const colorClasses = {
    amber: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    emerald: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </CardContent>
    </Card>
  );
}

function ReviewItem({ transaction, onApprove, onReject }: { transaction: SuspiciousTransaction; onApprove: () => void; onReject: () => void }) {
  const variant = transaction.riskScore >= 90 ? "danger" : transaction.riskScore >= 75 ? "warning" : "info";

  return (
    <div className="flex items-start justify-between p-4 rounded-lg border bg-card">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-semibold">{transaction.id}</span>
          <Badge variant={variant}>Risk: {transaction.riskScore}%</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{transaction.reason}</p>
        <p className="text-xs text-muted-foreground mt-1">{transaction.time} • {transaction.user}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="font-semibold text-lg">${transaction.amount.toFixed(2)}</span>
        <div className="flex gap-2">
          <Button size="sm" onClick={onApprove} className="bg-emerald-600 hover:bg-emerald-700">
            ✓ Approve
          </Button>
          <Button size="sm" variant="outline" onClick={onReject} className="border-red-500 text-red-600 hover:bg-red-50">
            ✗ Reject
          </Button>
        </div>
      </div>
    </div>
  );
}

function HistoryItem({ transaction }: { transaction: SuspiciousTransaction }) {
  return (
    <div className="flex items-start justify-between p-4 rounded-lg border bg-card opacity-60">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-semibold">{transaction.id}</span>
          <Badge variant={transaction.status === "approved" ? "success" : "danger"}>
            {transaction.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{transaction.reason}</p>
        <p className="text-xs text-muted-foreground mt-1">{transaction.time}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="font-semibold text-lg">${transaction.amount.toFixed(2)}</span>
      </div>
    </div>
  );
}

function SecurityMetric({ title, value, trend }: { title: string; value: string; trend: string }) {
  const isPositive = trend.startsWith("+");
  return (
    <div className="p-4 rounded-lg border bg-card">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className={`text-sm mt-1 ${isPositive ? "text-red-600" : "text-emerald-600"}`}>
        {trend} from yesterday
      </p>
    </div>
  );
}

function SecurityConcept({ title, description, status }: { title: string; description: string; status: string }) {
  return (
    <div className="p-4 rounded-lg border bg-card">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold">{title}</h3>
        <Badge variant="success">{status}</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
