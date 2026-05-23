"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface Alert {
  id: string;
  user: string;
  timestamp: string;
  fraudType: string;
  riskPercentage: number;
  status: "pending" | "investigating" | "resolved" | "blocked";
  actionTaken: string;
  explanation: string;
}

const mockAlerts: Alert[] = [
  {
    id: "ALT-001",
    user: "john@example.com",
    timestamp: "2024-01-15 14:32:00",
    fraudType: "Account Takeover",
    riskPercentage: 94,
    status: "resolved",
    actionTaken: "Blocked - User verified via SMS",
    explanation: "Unusual login from new device in different country",
  },
  {
    id: "ALT-002",
    user: "sarah@example.com",
    timestamp: "2024-01-15 14:28:00",
    fraudType: "Suspicious Transfer",
    riskPercentage: 87,
    status: "investigating",
    actionTaken: "Pending review",
    explanation: "Large transfer to new recipient after account inactivity",
  },
  {
    id: "ALT-003",
    user: "mike@example.com",
    timestamp: "2024-01-15 14:15:00",
    fraudType: "Card Fraud",
    riskPercentage: 78,
    status: "blocked",
    actionTaken: "Transaction blocked automatically",
    explanation: "Card used at multiple locations within 5 minutes",
  },
  {
    id: "ALT-004",
    user: "emma@example.com",
    timestamp: "2024-01-15 13:45:00",
    fraudType: "Phishing",
    riskPercentage: 65,
    status: "resolved",
    actionTaken: "User confirmed legitimate",
    explanation: "Suspicious login pattern detected",
  },
  {
    id: "ALT-005",
    user: "alex@example.com",
    timestamp: "2024-01-15 13:30:00",
    fraudType: "IP/Device Mismatch",
    riskPercentage: 72,
    status: "pending",
    actionTaken: "Awaiting user response",
    explanation: "Login from unrecognized IP address",
  },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fraudTypeFilter, setFraudTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("timestamp");

  const filteredAlerts = alerts
    .filter(alert => {
      const matchesSearch = alert.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.fraudType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
      const matchesFraudType = fraudTypeFilter === "all" || alert.fraudType === fraudTypeFilter;
      return matchesSearch && matchesStatus && matchesFraudType;
    })
    .sort((a, b) => {
      if (sortBy === "timestamp") return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      if (sortBy === "risk") return b.riskPercentage - a.riskPercentage;
      return 0;
    });

  const uniqueFraudTypes = Array.from(new Set(alerts.map(a => a.fraudType)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Alert Log</h1>
        <p className="text-muted-foreground">View and manage fraud alerts with full explainability</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AlertSummaryCard title="Total Alerts" count={alerts.length} color="blue" />
        <AlertSummaryCard title="High Risk" count={alerts.filter(a => a.riskPercentage >= 80).length} color="red" />
        <AlertSummaryCard title="Pending" count={alerts.filter(a => a.status === "pending").length} color="amber" />
        <AlertSummaryCard title="Resolved" count={alerts.filter(a => a.status === "resolved").length} color="emerald" />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fraud Type</label>
              <select
                value={fraudTypeFilter}
                onChange={(e) => setFraudTypeFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Types</option>
                {uniqueFraudTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="timestamp">Timestamp</option>
                <option value="risk">Risk Percentage</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alert History ({filteredAlerts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAlerts.length === 0 ? (
            <EmptyState
              title="No alerts found"
              description="There are no alerts matching your current filters. Try adjusting your search or filter criteria."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Alert ID</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">User</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Timestamp</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Fraud Type</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Risk %</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Action Taken</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Explanation</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAlerts.map(alert => (
                    <AlertRow key={alert.id} alert={alert} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AlertSummaryCard({ title, count, color }: { title: string; count: number; color: string }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    amber: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    emerald: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]}`}>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold mt-2">{count}</p>
    </div>
  );
}

function AlertRow({ alert }: { alert: Alert }) {
  const statusColors = {
    pending: "text-amber-600 dark:text-amber-400",
    investigating: "text-blue-600 dark:text-blue-400",
    resolved: "text-emerald-600 dark:text-emerald-400",
    blocked: "text-red-600 dark:text-red-400",
  };

  const statusVariant = alert.status === "blocked" ? "danger" : alert.status === "pending" ? "warning" : alert.status === "investigating" ? "info" : "success";

  const riskColor = alert.riskPercentage >= 80 ? "text-red-600" : alert.riskPercentage >= 60 ? "text-amber-600" : "text-emerald-600";

  return (
    <tr className="border-b hover:bg-muted/50 transition-colors">
      <td className="p-3 font-medium">{alert.id}</td>
      <td className="p-3 text-sm">{alert.user}</td>
      <td className="p-3 text-sm text-muted-foreground">{alert.timestamp}</td>
      <td className="p-3 text-sm">{alert.fraudType}</td>
      <td className={`p-3 font-semibold ${riskColor}`}>{alert.riskPercentage}%</td>
      <td className="p-3">
        <Badge variant={statusVariant}>{alert.status}</Badge>
      </td>
      <td className="p-3 text-sm">{alert.actionTaken}</td>
      <td className="p-3 text-sm text-muted-foreground max-w-xs truncate">{alert.explanation}</td>
    </tr>
  );
}
