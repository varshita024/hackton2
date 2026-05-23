"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";

interface Transaction {
  id: string;
  user: string;
  timestamp: string;
  amount: number;
  fraudType: string;
  status: "approved" | "flagged" | "blocked" | "pending";
  riskPercentage: number;
  merchant: string;
  location: string;
  device: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN-78291",
    user: "john@example.com",
    timestamp: "2024-01-15 14:32:00",
    amount: 4521.00,
    fraudType: "None",
    status: "approved",
    riskPercentage: 2,
    merchant: "Amazon Web Services",
    location: "New York, US",
    device: "iPhone 15 Pro",
  },
  {
    id: "TXN-78290",
    user: "sarah@example.com",
    timestamp: "2024-01-15 14:28:00",
    amount: 12890.50,
    fraudType: "Suspicious Location",
    status: "flagged",
    riskPercentage: 78,
    merchant: "Unknown Merchant",
    location: "Lagos, NG",
    device: "Desktop Chrome",
  },
  {
    id: "TXN-78289",
    user: "mike@example.com",
    timestamp: "2024-01-15 14:15:00",
    amount: 8234.00,
    fraudType: "Velocity Exceeded",
    status: "blocked",
    riskPercentage: 94,
    merchant: "Electronics Store",
    location: "London, UK",
    device: "MacBook Pro",
  },
  {
    id: "TXN-78288",
    user: "emma@example.com",
    timestamp: "2024-01-15 13:45:00",
    amount: 2345.00,
    fraudType: "None",
    status: "approved",
    riskPercentage: 5,
    merchant: "Grocery Store",
    location: "San Francisco, US",
    device: "iPhone 14",
  },
  {
    id: "TXN-78287",
    user: "alex@example.com",
    timestamp: "2024-01-15 13:30:00",
    amount: 45678.00,
    fraudType: "New Device",
    status: "flagged",
    riskPercentage: 65,
    merchant: "Luxury Retail",
    location: "Paris, FR",
    device: "iPad Pro",
  },
  {
    id: "TXN-78286",
    user: "john@example.com",
    timestamp: "2024-01-15 12:15:00",
    amount: 1250.00,
    fraudType: "None",
    status: "approved",
    riskPercentage: 3,
    merchant: "Restaurant",
    location: "New York, US",
    device: "iPhone 15 Pro",
  },
  {
    id: "TXN-78285",
    user: "sarah@example.com",
    timestamp: "2024-01-15 11:30:00",
    amount: 8900.00,
    fraudType: "IP Mismatch",
    status: "blocked",
    riskPercentage: 88,
    merchant: "Online Transfer",
    location: "Moscow, RU",
    device: "Desktop Firefox",
  },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fraudTypeFilter, setFraudTypeFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("timestamp");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = transactions
    .filter(tx => {
      const matchesSearch = tx.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
      const matchesFraudType = fraudTypeFilter === "all" || tx.fraudType === fraudTypeFilter;
      const matchesRisk = riskFilter === "all" ||
        (riskFilter === "high" && tx.riskPercentage >= 80) ||
        (riskFilter === "medium" && tx.riskPercentage >= 50 && tx.riskPercentage < 80) ||
        (riskFilter === "low" && tx.riskPercentage < 50);
      return matchesSearch && matchesStatus && matchesFraudType && matchesRisk;
    })
    .sort((a, b) => {
      if (sortBy === "timestamp") return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      if (sortBy === "amount") return b.amount - a.amount;
      if (sortBy === "risk") return b.riskPercentage - a.riskPercentage;
      return 0;
    });

  const uniqueFraudTypes = Array.from(new Set(transactions.map(t => t.fraudType).filter(t => t !== "None")));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Transactions</h1>
          <p className="text-muted-foreground">View and analyze all transaction history</p>
        </div>
        <Button>Export Data</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                placeholder="Search transactions..."
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
                <option value="approved">Approved</option>
                <option value="flagged">Flagged</option>
                <option value="blocked">Blocked</option>
                <option value="pending">Pending</option>
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
              <label className="block text-sm font-medium mb-2">Risk Level</label>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Levels</option>
                <option value="high">High (80%+)</option>
                <option value="medium">Medium (50-79%)</option>
                <option value="low">Low (&lt;50%)</option>
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
                <option value="amount">Amount</option>
                <option value="risk">Risk %</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <EmptyState
              title="No transactions found"
              description="There are no transactions matching your current filters. Try adjusting your search or filter criteria."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Transaction ID</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">User</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Timestamp</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Merchant</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Fraud Type</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Risk %</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map(tx => (
                    <TransactionRow
                      key={tx.id}
                      transaction={tx}
                      onViewDetails={() => setSelectedTransaction(tx)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Detail Modal */}
      <Modal
        isOpen={selectedTransaction !== null}
        onClose={() => setSelectedTransaction(null)}
        title="Transaction Details"
      >
        {selectedTransaction && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Transaction ID</p>
                <p className="font-medium">{selectedTransaction.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">User</p>
                <p className="font-medium">{selectedTransaction.user}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-semibold text-lg">${selectedTransaction.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Risk Percentage</p>
                <Badge variant={selectedTransaction.riskPercentage >= 80 ? "danger" : selectedTransaction.riskPercentage >= 50 ? "warning" : "success"}>
                  {selectedTransaction.riskPercentage}%
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Merchant</p>
                <p className="font-medium">{selectedTransaction.merchant}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={selectedTransaction.status === "blocked" ? "danger" : selectedTransaction.status === "flagged" ? "warning" : "success"}>
                  {selectedTransaction.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{selectedTransaction.location}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Device</p>
                <p className="font-medium">{selectedTransaction.device}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fraud Type</p>
                <p className="font-medium">{selectedTransaction.fraudType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Timestamp</p>
                <p className="font-medium">{selectedTransaction.timestamp}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function TransactionRow({ transaction, onViewDetails }: { transaction: Transaction; onViewDetails: () => void }) {
  const statusVariant = transaction.status === "blocked" ? "danger" : transaction.status === "flagged" ? "warning" : transaction.status === "pending" ? "info" : "success";

  const riskColor = transaction.riskPercentage >= 80 ? "text-red-600" : transaction.riskPercentage >= 50 ? "text-amber-600" : "text-emerald-600";

  return (
    <tr className="border-b hover:bg-muted/50 transition-colors">
      <td className="p-3 font-medium">{transaction.id}</td>
      <td className="p-3 text-sm">{transaction.user}</td>
      <td className="p-3 text-sm text-muted-foreground">{transaction.timestamp}</td>
      <td className="p-3 font-semibold">${transaction.amount.toFixed(2)}</td>
      <td className="p-3 text-sm">{transaction.merchant}</td>
      <td className="p-3 text-sm">{transaction.fraudType}</td>
      <td className="p-3">
        <Badge variant={statusVariant}>{transaction.status}</Badge>
      </td>
      <td className={`p-3 font-semibold ${riskColor}`}>{transaction.riskPercentage}%</td>
      <td className="p-3">
        <Button size="sm" variant="outline" onClick={onViewDetails}>
          View Details
        </Button>
      </td>
    </tr>
  );
}
