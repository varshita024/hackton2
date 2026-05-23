"use client";

import React, { useState, useEffect } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, BarChart, DonutChart } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { useAttackState } from "@/lib/attack-state";

export default function DashboardPage() {
  const { attackState } = useAttackState();
  const [isLoading, setIsLoading] = useState(true);
  const [liveTransactionCount, setLiveTransactionCount] = useState(127);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);

    // Simulate live transaction count updates
    const interval = setInterval(() => {
      setLiveTransactionCount(prev => prev + Math.floor(Math.random() * 10) - 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your fraud detection metrics</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                <div className="h-8 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your fraud detection metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">Live</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Transactions"
          value="24,521"
          change="+12.5% from last month"
          changeType="positive"
        />
        <StatCard
          title="Safe Transactions"
          value="24,179"
          change="+13.2% from last month"
          changeType="positive"
        />
        <StatCard
          title="Risky Transactions"
          value="342"
          change="-8.2% from last month"
          changeType="positive"
        />
        <StatCard
          title="Fraud Percentage"
          value="1.4%"
          change="-0.3% from last month"
          changeType="positive"
        />
      </div>

      {/* Live Status */}
      <Card className={`border-l-4 ${attackState.isAttacking ? "border-l-red-500" : "border-l-emerald-500"}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${attackState.isAttacking ? "bg-red-500 animate-pulse" : "bg-emerald-500 animate-pulse"}`} />
            Live Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {attackState.isAttacking && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
              <p className="font-semibold text-red-800 dark:text-red-400">
                🚨 ATTACK IN PROGRESS: {attackState.attackType}
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <LiveStatusItem label="Ongoing Monitoring" value="Active" status="active" />
            <LiveStatusItem label="AI Detection" value="Running" status="active" />
            <LiveStatusItem label="Fraud Engine" value={attackState.isAttacking ? "Alert" : "Operational"} status={attackState.isAttacking ? "inactive" : "active"} />
            <LiveStatusItem label="Protected Users" value="12,847" status="active" />
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Live Transaction Count</span>
              <span className="text-2xl font-bold text-primary">{liveTransactionCount}/sec</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fraud Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={[12, 19, 15, 25, 22, 18, 14]}
              labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
              height={200}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Safe vs Risky Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={[
                { value: 98.6, label: "Safe", color: "#10b981" },
                { value: 1.4, label: "Risky", color: "#ef4444" },
              ]}
              size={200}
            />
          </CardContent>
        </Card>
      </div>

      {/* More Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={[45, 52, 38, 65, 48, 55, 42]}
              labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
              color="#f59e0b"
              height={200}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={[3200, 3800, 3500, 4200, 3900, 2800, 3100]}
              labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
              height={200}
            />
          </CardContent>
        </Card>
      </div>

      {/* Fraud Category Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Fraud Category Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <DonutChart
            data={[
              { value: 35, label: "Account Takeover", color: "#ef4444" },
              { value: 28, label: "Payment Fraud", color: "#f59e0b" },
              { value: 20, label: "Identity Theft", color: "#3b82f6" },
              { value: 12, label: "Phishing", color: "#8b5cf6" },
              { value: 5, label: "Other", color: "#6b7280" },
            ]}
            size={250}
          />
        </CardContent>
      </Card>

      {/* Recent Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Transaction ID</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">User</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Fraud Type</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Risk %</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                <TransactionRow
                  id="TXN-78291"
                  user="john@example.com"
                  amount="$4,521.00"
                  fraudType="None"
                  status="Approved"
                  risk="2"
                  timestamp="2 min ago"
                />
                <TransactionRow
                  id="TXN-78290"
                  user="sarah@example.com"
                  amount="$12,890.50"
                  fraudType="Suspicious Location"
                  status="Reviewing"
                  risk="78"
                  timestamp="15 min ago"
                />
                <TransactionRow
                  id="TXN-78289"
                  user="mike@example.com"
                  amount="$8,234.00"
                  fraudType="Velocity Exceeded"
                  status="Flagged"
                  risk="94"
                  timestamp="1 hour ago"
                />
                <TransactionRow
                  id="TXN-78288"
                  user="emma@example.com"
                  amount="$2,345.00"
                  fraudType="None"
                  status="Approved"
                  risk="5"
                  timestamp="2 hours ago"
                />
                <TransactionRow
                  id="TXN-78287"
                  user="alex@example.com"
                  amount="$45,678.00"
                  fraudType="New Device"
                  status="Reviewing"
                  risk="65"
                  timestamp="3 hours ago"
                />
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AlertItem
              title="Suspicious Transaction Detected"
              description="Transaction of $45,000 from unusual IP location"
              time="2 minutes ago"
              severity="high"
            />
            <AlertItem
              title="Unusual Location Activity"
              description="Multiple transactions from different geographic locations"
              time="15 minutes ago"
              severity="medium"
            />
            <AlertItem
              title="Multiple Failed Login Attempts"
              description="15 failed attempts from same IP address"
              time="1 hour ago"
              severity="high"
            />
            <AlertItem
              title="Velocity Limit Exceeded"
              description="Transaction velocity threshold exceeded"
              time="2 hours ago"
              severity="medium"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LiveStatusItem({ label, value, status }: { label: string; value: string; status: "active" | "inactive" }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold mt-1">{value}</p>
      </div>
      <div className={`w-2 h-2 rounded-full ${status === "active" ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
    </div>
  );
}

function TransactionRow({ id, user, amount, fraudType, status, risk, timestamp }: {
  id: string;
  user: string;
  amount: string;
  fraudType: string;
  status: string;
  risk: string;
  timestamp: string;
}) {
  const statusColors = {
    Approved: "text-emerald-600 dark:text-emerald-400",
    Reviewing: "text-amber-600 dark:text-amber-400",
    Flagged: "text-red-600 dark:text-red-400",
  };

  const riskColor = parseInt(risk) > 70 ? "text-red-600" : parseInt(risk) > 40 ? "text-amber-600" : "text-emerald-600";

  return (
    <tr className="border-b hover:bg-muted/50 transition-colors">
      <td className="p-3 font-medium">{id}</td>
      <td className="p-3 text-sm">{user}</td>
      <td className="p-3 font-semibold">{amount}</td>
      <td className="p-3 text-sm">{fraudType}</td>
      <td className="p-3">
        <Badge variant={status === "Flagged" ? "danger" : status === "Reviewing" ? "warning" : "success"}>
          {status}
        </Badge>
      </td>
      <td className={`p-3 font-semibold ${riskColor}`}>{risk}%</td>
      <td className="p-3 text-sm text-muted-foreground">{timestamp}</td>
    </tr>
  );
}

function AlertItem({ title, description, time, severity }: { title: string; description: string; time: string; severity: "high" | "medium" | "low" }) {
  const variant = severity === "high" ? "danger" : severity === "medium" ? "warning" : "info";
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
      <div className={`w-2 h-2 rounded-full mt-2 ${severity === "high" ? "bg-red-500" : severity === "medium" ? "bg-amber-500" : "bg-blue-500"}`} />
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <Badge variant={variant}>{severity}</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{time}</p>
      </div>
    </div>
  );
}
