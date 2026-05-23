"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";

interface PersonaAttribute {
  name: string;
  value: string;
  confidence: number;
  source: "behavioral" | "transactional" | "demographic" | "device";
}

interface PersonaProfile {
  id: string;
  userId: string;
  riskProfile: "low" | "medium" | "high";
  trustScore: number;
  attributes: PersonaAttribute[];
  lastUpdated: string;
}

const mockPersona: PersonaProfile = {
  id: "PERS-001",
  userId: "user-123",
  riskProfile: "low",
  trustScore: 92,
  attributes: [
    {
      name: "Transaction Pattern",
      value: "Consistent small purchases, regular grocery shopping",
      confidence: 95,
      source: "transactional",
    },
    {
      name: "Geographic Stability",
      value: "Primarily transactions from home location (New York)",
      confidence: 88,
      source: "behavioral",
    },
    {
      name: "Device Consistency",
      value: "Mainly uses iPhone 15 Pro, occasional iPad",
      confidence: 91,
      source: "device",
    },
    {
      name: "Time of Activity",
      value: "Peak activity during evening hours (6 PM - 10 PM)",
      confidence: 84,
      source: "behavioral",
    },
    {
      name: "Merchant Preferences",
      value: "Frequent purchases from Amazon, local grocery stores",
      confidence: 79,
      source: "transactional",
    },
    {
      name: "Account Age",
      value: "3 years 2 months",
      confidence: 100,
      source: "demographic",
    },
    {
      name: "Payment Methods",
      value: "Primary: Credit Card, Secondary: Debit Card",
      confidence: 96,
      source: "transactional",
    },
    {
      name: "Velocity Pattern",
      value: "Average 2-3 transactions per day",
      confidence: 87,
      source: "behavioral",
    },
  ],
  lastUpdated: "2024-01-15 14:30:00",
};

export default function PersonaFillingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [persona] = useState<PersonaProfile>(mockPersona);
  const [selectedSource, setSelectedSource] = useState<string>("all");

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const filteredAttributes = persona.attributes.filter(
    (attr) => selectedSource === "all" || attr.source === selectedSource
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Persona Filling</h1>
          <p className="text-muted-foreground">
            AI-generated user behavioral profiles for enhanced fraud detection
          </p>
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

  const sourceColors = {
    behavioral:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    transactional:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    demographic:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    device:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Persona Filling</h1>
          <p className="text-muted-foreground">
            AI-generated user behavioral profiles for enhanced fraud detection
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">AI Active</span>
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Trust Score"
          value={`${persona.trustScore}%`}
          change="High confidence"
          changeType="positive"
        />

        <StatCard
          title="Risk Profile"
          value={persona.riskProfile.toUpperCase()}
          change="Based on patterns"
          changeType={
            persona.riskProfile === "low"
              ? "positive"
              : persona.riskProfile === "medium"
              ? "neutral"
              : "negative"
          }
        />

        <StatCard
          title="Attributes"
          value={persona.attributes.length.toString()}
          change="Behavioral data points"
          changeType="positive"
        />

        <StatCard
          title="Last Updated"
          value="2h ago"
          change="Recent analysis"
          changeType="neutral"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Filter by Source:</span>

            {(
              [
                "all",
                "behavioral",
                "transactional",
                "demographic",
                "device",
              ] as const
            ).map((source) => (
              <Button
                key={source}
                variant={selectedSource === source ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedSource(source)}
              >
                {source.charAt(0).toUpperCase() + source.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attributes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Persona Attributes ({filteredAttributes.length})
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {filteredAttributes.map((attr, index) => (
                  <AttributeCard
                    key={index}
                    attribute={attr}
                    sourceColors={sourceColors}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Behavioral Analysis</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <AnalysisItem
                title="Pattern Consistency"
                value="94%"
                description="User behavior matches established patterns"
                status="positive"
              />

              <AnalysisItem
                title="Anomaly Detection"
                value="2"
                description="Minor deviations detected in last 30 days"
                status="neutral"
              />

              <AnalysisItem
                title="Fraud Risk"
                value="Low"
                description="Based on behavioral patterns"
                status="positive"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trust Factors</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <TrustFactor label="Account Age" score={95} />
              <TrustFactor label="Transaction History" score={92} />
              <TrustFactor label="Device Consistency" score={88} />
              <TrustFactor label="Geographic Stability" score={85} />
              <TrustFactor label="Payment Reliability" score={90} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <Button className="w-full">Refresh Persona</Button>

              <Button variant="outline" className="w-full">
                Export Profile
              </Button>

              <Button variant="outline" className="w-full">
                View History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AttributeCard({
  attribute,
  sourceColors,
}: {
  attribute: PersonaAttribute;
  sourceColors: Record<string, string>;
}) {
  return (
    <div className="p-4 rounded-lg border bg-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="font-semibold">{attribute.name}</p>

          <p className="text-sm text-muted-foreground mt-1">
            {attribute.value}
          </p>
        </div>

        <Badge className={sourceColors[attribute.source]}>
          {attribute.source}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Confidence:</span>

        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${attribute.confidence}%` }}
          />
        </div>

        <span className="text-xs font-medium">
          {attribute.confidence}%
        </span>
      </div>
    </div>
  );
}

function AnalysisItem({
  title,
  value,
  description,
  status,
}: {
  title: string;
  value: string;
  description: string;
  status: "positive" | "neutral" | "negative";
}) {
  const statusColors = {
    positive: "text-emerald-600",
    neutral: "text-amber-600",
    negative: "text-red-600",
  };

  return (
    <div className="p-3 rounded-lg border bg-card">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-medium">{title}</p>

        <p className={`font-semibold ${statusColors[status]}`}>
          {value}
        </p>
      </div>

      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function TrustFactor({
  label,
  score,
}: {
  label: string;
  score: number;
}) {
  const color =
    score >= 90
      ? "bg-emerald-500"
      : score >= 70
      ? "bg-amber-500"
      : "bg-red-500";

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-muted-foreground">{label}</span>

        <span className="text-sm font-medium">{score}%</span>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}