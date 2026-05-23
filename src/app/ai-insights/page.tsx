"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SHAPFactor {
  name: string;
  value: number;
  impact: "positive" | "negative";
  description: string;
}

interface TransactionExplanation {
  id: string;
  user: string;
  amount: number;
  riskScore: number;
  modelConfidence: number;
  prediction: "fraud" | "legitimate";
  factors: SHAPFactor[];
  plainLanguageExplanation: string;
}

const mockExplanations: TransactionExplanation[] = [
  {
    id: "TXN-78290",
    user: "sarah@example.com",
    amount: 12890.50,
    riskScore: 78,
    modelConfidence: 94,
    prediction: "fraud",
    factors: [
      {
        name: "Unusual Location",
        value: 0.35,
        impact: "negative",
        description: "Transaction originated from Lagos, Nigeria - user's typical location is New York, USA",
      },
      {
        name: "New Device",
        value: 0.28,
        impact: "negative",
        description: "First transaction from Desktop Chrome - user typically uses iPhone 15 Pro",
      },
      {
        name: "High Amount",
        value: 0.22,
        impact: "negative",
        description: "Transaction amount ($12,890.50) is 4.2x user's average transaction",
      },
      {
        name: "Time of Day",
        value: 0.08,
        impact: "negative",
        description: "Transaction at 2:28 PM - user typically transacts during evening hours",
      },
      {
        name: "Merchant Reputation",
        value: -0.05,
        impact: "positive",
        description: "Merchant has established relationship with platform",
      },
    ],
    plainLanguageExplanation: "This transaction was flagged because it shows multiple unusual patterns. The user typically transacts from New York using an iPhone, but this transaction came from Nigeria using a desktop computer. The amount is also significantly higher than their usual transactions. These combined factors create a high-risk profile that requires verification.",
  },
  {
    id: "TXN-78289",
    user: "mike@example.com",
    amount: 8234.00,
    riskScore: 94,
    modelConfidence: 97,
    prediction: "fraud",
    factors: [
      {
        name: "Velocity Spike",
        value: 0.42,
        impact: "negative",
        description: "5 transactions in 3 minutes - user's normal velocity is 1 transaction per hour",
      },
      {
        name: "Geographic Anomaly",
        value: 0.31,
        impact: "negative",
        description: "Transactions from 3 different countries within 10 minutes",
      },
      {
        name: "Device Switching",
        value: 0.18,
        impact: "negative",
        description: "Switched between 4 different devices in short timeframe",
      },
      {
        name: "Amount Pattern",
        value: 0.12,
        impact: "negative",
        description: "All amounts near $8,000 - suggests automated testing",
      },
    ],
    plainLanguageExplanation: "This transaction shows clear signs of automated fraud. The account experienced a velocity spike with 5 transactions in 3 minutes, originating from multiple countries and devices. The consistent amounts near $8,000 suggest this is likely a bot testing stolen credentials. Immediate blocking was required.",
  },
  {
    id: "TXN-78287",
    user: "alex@example.com",
    amount: 45678.00,
    riskScore: 65,
    modelConfidence: 82,
    prediction: "fraud",
    factors: [
      {
        name: "New Device",
        value: 0.38,
        impact: "negative",
        description: "First transaction from iPad Pro - user's typical device is iPhone 14",
      },
      {
        name: "High Amount",
        value: 0.25,
        impact: "negative",
        description: "Transaction amount ($45,678) is 8x user's average transaction",
      },
      {
        name: "Location Change",
        value: 0.20,
        impact: "negative",
        description: "Transaction from Paris, France - user's typical location is San Francisco",
      },
      {
        name: "Account Age",
        value: -0.15,
        impact: "positive",
        description: "User has 3-year account history with good standing",
      },
      {
        name: "Merchant Verification",
        value: -0.10,
        impact: "positive",
        description: "Merchant is verified and has low fraud rate",
      },
    ],
    plainLanguageExplanation: "This transaction was flagged due to several unusual patterns including a new device, high amount, and location change. However, the user has a long account history and the merchant is verified. This suggests the transaction may be legitimate but requires additional verification through 2FA or user confirmation.",
  },
];

export default function AIInsightsPage() {
  const [selectedExplanation, setSelectedExplanation] = useState<TransactionExplanation>(mockExplanations[0]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Insights</h1>
        <p className="text-muted-foreground">Explainable AI - Understand why transactions were flagged</p>
      </div>

      {/* Model Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ModelMetricCard title="Model Accuracy" value="99.7%" description="Overall detection accuracy" />
        <ModelMetricCard title="False Positive Rate" value="0.3%" description="Legitimate transactions blocked" />
        <ModelMetricCard title="False Negative Rate" value="0.8%" description="Fraud transactions missed" />
        <ModelMetricCard title="Avg Response Time" value="42ms" description="Real-time scoring latency" />
      </div>

      {/* Transaction Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Transaction for Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockExplanations.map(explanation => (
              <TransactionCard
                key={explanation.id}
                explanation={explanation}
                isSelected={selectedExplanation.id === explanation.id}
                onSelect={() => setSelectedExplanation(explanation)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SHAP Factors */}
        <Card>
          <CardHeader>
            <CardTitle>Contributing Factors (SHAP)</CardTitle>
            <p className="text-sm text-muted-foreground">What drove the AI's decision</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedExplanation.factors.map((factor, index) => (
                <SHAPFactorCard key={index} factor={factor} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Risk Score</p>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">{selectedExplanation.riskScore}%</div>
                <Badge variant={selectedExplanation.riskScore >= 80 ? "danger" : selectedExplanation.riskScore >= 50 ? "warning" : "success"}>
                  {selectedExplanation.riskScore >= 80 ? "High Risk" : selectedExplanation.riskScore >= 50 ? "Medium Risk" : "Low Risk"}
                </Badge>
              </div>
              <div className="mt-2 h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${selectedExplanation.riskScore >= 80 ? "bg-red-500" : selectedExplanation.riskScore >= 50 ? "bg-amber-500" : "bg-emerald-500"}`}
                  style={{ width: `${selectedExplanation.riskScore}%` }}
                />
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Model Confidence</p>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">{selectedExplanation.modelConfidence}%</div>
                <Badge variant={selectedExplanation.modelConfidence >= 90 ? "success" : "info"}>
                  {selectedExplanation.modelConfidence >= 90 ? "High Confidence" : "Medium Confidence"}
                </Badge>
              </div>
              <div className="mt-2 h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${selectedExplanation.modelConfidence}%` }}
                />
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Prediction</p>
              <Badge variant={selectedExplanation.prediction === "fraud" ? "danger" : "success"} className="text-base px-4 py-2">
                {selectedExplanation.prediction === "fraud" ? "🚨 Fraud Detected" : "✓ Legitimate"}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Transaction Details</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-medium">{selectedExplanation.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User:</span>
                  <span className="font-medium">{selectedExplanation.user}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-semibold">${selectedExplanation.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plain Language Explanation */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle>Plain Language Explanation</CardTitle>
          <p className="text-sm text-muted-foreground">Why this transaction was flagged</p>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed">{selectedExplanation.plainLanguageExplanation}</p>
        </CardContent>
      </Card>

      {/* Model Information */}
      <Card>
        <CardHeader>
          <CardTitle>Model Architecture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Primary Model</p>
              <p className="font-semibold">XGBoost Classifier</p>
              <p className="text-xs text-muted-foreground mt-1">Gradient boosting for fraud detection</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Anomaly Detection</p>
              <p className="font-semibold">Isolation Forest</p>
              <p className="text-xs text-muted-foreground mt-1">Unsupervised anomaly detection</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Explainability</p>
              <p className="font-semibold">SHAP Values</p>
              <p className="text-xs text-muted-foreground mt-1">Game-theoretic approach to explainability</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ModelMetricCard({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

function TransactionCard({ explanation, isSelected, onSelect }: { explanation: TransactionExplanation; isSelected: boolean; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-lg border cursor-pointer transition-all ${isSelected ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium">{explanation.id}</p>
        <Badge variant={explanation.prediction === "fraud" ? "danger" : "success"}>
          {explanation.prediction === "fraud" ? "Fraud" : "Legitimate"}
        </Badge>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{explanation.user}</span>
        <span className="font-semibold">${explanation.amount.toFixed(2)}</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Risk: {explanation.riskScore}%</span>
        <span className="text-xs text-muted-foreground">•</span>
        <span className="text-xs text-muted-foreground">Confidence: {explanation.modelConfidence}%</span>
      </div>
    </div>
  );
}

function SHAPFactorCard({ factor }: { factor: SHAPFactor }) {
  return (
    <div className="p-4 rounded-lg border bg-card">
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold">{factor.name}</p>
        <Badge variant={factor.impact === "negative" ? "danger" : "success"}>
          {factor.impact === "negative" ? "Increases Risk" : "Decreases Risk"}
        </Badge>
      </div>
      <div className="mb-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Impact</span>
          <span className="font-semibold">{Math.abs(factor.value * 100).toFixed(0)}%</span>
        </div>
        <div className="mt-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${factor.impact === "negative" ? "bg-red-500" : "bg-emerald-500"}`}
            style={{ width: `${Math.abs(factor.value * 100)}%` }}
          />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{factor.description}</p>
    </div>
  );
}
