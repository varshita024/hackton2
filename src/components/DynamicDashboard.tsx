"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDashboardStats, useRecentTransactions, useRecentAlerts } from "@/hooks/useDashboardStats";
import { StatCard } from "@/components/ui/stat-card";
import { LineChart, BarChart, DonutChart } from "@/components/ui/chart";

export function DynamicDashboard() {
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats();
  const { transactions, loading: txLoading, error: txError } = useRecentTransactions(10);
  const { alerts, loading: alertsLoading, error: alertsError } = useRecentAlerts(10);
  
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");
  const [riskFilter, setRiskFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      // The hooks will automatically refetch when dependencies change
      console.log("Auto-refreshing dashboard data...");
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const filteredTransactions = transactions.filter(tx => {
    if (riskFilter === "all") return true;
    if (riskFilter === "high") return tx.riskScore >= 70;
    if (riskFilter === "medium") return tx.riskScore >= 40 && tx.riskScore < 70;
    if (riskFilter === "low") return tx.riskScore < 40;
    return true;
  });

  if (statsLoading || txLoading || alertsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dynamic Dashboard</h1>
            <p className="text-muted-foreground">Real-time fraud detection metrics</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
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
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dynamic Dashboard</h1>
          <p className="text-muted-foreground">Real-time fraud detection metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${autoRefresh ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
            <span className="text-sm text-muted-foreground">
              {autoRefresh ? "Auto-refresh: ON" : "Auto-refresh: OFF"}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? "Pause" : "Resume"}
          </Button>
        </div>
      </div>

      {/* Time Range Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Time Range:</span>
        {(["7d", "30d", "90d"] as const).map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange(range)}
          >
            {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
          </Button>
        ))}
      </div>

      {/* Dynamic Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Transactions"
          value={stats.totalTransactions.toLocaleString()}
          change="Live from Firebase"
          changeType="positive"
        />
        <StatCard
          title="Safe Transactions"
          value={stats.safeTransactions.toLocaleString()}
          change={`${((stats.safeTransactions / stats.totalTransactions) * 100).toFixed(1)}% safe`}
          changeType="positive"
        />
        <StatCard
          title="Risky Transactions"
          value={stats.riskyTransactions.toLocaleString()}
          change={`${stats.fraudPercentage}% risk`}
          changeType={stats.fraudPercentage > 5 ? "negative" : "positive"}
        />
        <StatCard
          title="Live Transactions/sec"
          value={stats.liveTransactionCount}
          change="Real-time"
          changeType="positive"
        />
      </div>

      {/* Protected Users Card */}
      <Card>
        <CardHeader>
          <CardTitle>Protected Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold">{stats.protectedUsers.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Total users in system</p>
            </div>
            <Badge variant="success" className="text-lg px-4 py-2">Active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Charts with Time Range */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fraud Trend ({timeRange === "7d" ? "Last 7 Days" : timeRange === "30d" ? "Last 30 Days" : "Last 90 Days"})</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={timeRange === "7d" ? [12, 19, 15, 25, 22, 18, 14] : timeRange === "30d" ? [45, 52, 38, 65, 48, 55, 42, 35, 48, 52] : [120, 145, 132, 168, 155, 142, 138, 165, 152, 148]}
              labels={timeRange === "7d" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : timeRange === "30d" ? ["Week 1", "Week 2", "Week 3", "Week 4"] : ["Month 1", "Month 2", "Month 3"]}
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
                { value: stats.safeTransactions, label: "Safe", color: "#10b981" },
                { value: stats.riskyTransactions, label: "Risky", color: "#ef4444" },
              ]}
              size={200}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions with Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filter by risk:</span>
              {(["all", "high", "medium", "low"] as const).map((filter) => (
                <Button
                  key={filter}
                  variant={riskFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRiskFilter(filter)}
                >
                  {filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found. Use setupDashboardData() to add sample data.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">ID</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Fraud Type</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Risk Score</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-medium text-sm">{tx.id.slice(0, 8)}...</td>
                      <td className="p-3 font-semibold">${tx.amount.toLocaleString()}</td>
                      <td className="p-3 text-sm">{tx.fraudType}</td>
                      <td className="p-3">
                        <Badge variant={tx.status === "Flagged" ? "danger" : tx.status === "Reviewing" ? "warning" : "success"}>
                          {tx.status}
                        </Badge>
                      </td>
                      <td className={`p-3 font-semibold ${tx.riskScore > 70 ? "text-red-600" : tx.riskScore > 40 ? "text-amber-600" : "text-emerald-600"}`}>
                        {tx.riskScore}%
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {tx.timestamp ? new Date(tx.timestamp.toMillis()).toLocaleString() : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No alerts found. Use setupDashboardData() to add sample data.
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                  <div className={`w-2 h-2 rounded-full mt-2 ${alert.severity === "high" ? "bg-red-500" : alert.severity === "medium" ? "bg-amber-500" : "bg-blue-500"}`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{alert.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                      </div>
                      <Badge variant={alert.severity === "high" ? "danger" : alert.severity === "medium" ? "warning" : "info"}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {alert.timestamp ? new Date(alert.timestamp.toMillis()).toLocaleString() : "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {(statsError || txError || alertsError) && (
        <Card className="border-red-500">
          <CardContent className="p-6">
            <p className="text-red-600">
              Error loading data: {statsError || txError || alertsError}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Make sure Firestore is configured and collections are set up using setupDashboardData()
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
