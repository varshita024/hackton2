"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";

interface Prediction {
  id: string;
  type: "fraud_risk" | "volume_spike" | "pattern_anomaly";
  confidence: number;
  timeframe: string;
  description: string;
  impact: "high" | "medium" | "low";
  suggestedActions: string[];
}

const mockPredictions: Prediction[] = [
  {
    id: "PRED-001",
    type: "fraud_risk",
    confidence: 87,
    timeframe: "Next 24 hours",
    description: "AI predicts 23% increase in fraud attempts during holiday shopping period based on historical patterns and current threat intelligence.",
    impact: "high",
    suggestedActions: [
      "Increase monitoring frequency",
      "Alert security team",
      "Prepare additional verification steps",
    ],
  },
  {
    id: "PRED-002",
    type: "volume_spike",
    confidence: 92,
    timeframe: "Next 7 days",
    description: "Transaction volume expected to increase by 45% due to upcoming promotional events. System capacity should be reviewed.",
    impact: "medium",
    suggestedActions: [
      "Scale infrastructure",
      "Monitor system performance",
      "Prepare customer support teams",
    ],
  },
  {
    id: "PRED-003",
    type: "pattern_anomaly",
    confidence: 78,
    timeframe: "Next 48 hours",
    description: "Unusual geographic transaction patterns detected from specific regions. May indicate coordinated fraud attempts.",
    impact: "high",
    suggestedActions: [
      "Implement geo-blocking for high-risk regions",
      "Enhance verification for affected users",
      "Review recent transactions from flagged regions",
    ],
  },
];

export default function PredictiveTimelinePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction>(mockPredictions[0]);
  const [timeHorizon, setTimeHorizon] = useState<"24h" | "7d" | "30d">("7d");

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const filteredPredictions = mockPredictions.filter(p => {
    if (timeHorizon === "24h") return p.timeframe.includes("24");
    if (timeHorizon === "7d") return p.timeframe.includes("7");
    return true;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Predictive Timeline</h1>
          <p className="text-muted-foreground">AI-powered predictions for fraud risk and system capacity</p>
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
          <h1 className="text-3xl font-bold mb-2">Predictive Timeline</h1>
          <p className="text-muted-foreground">AI-powered predictions for fraud risk and system capacity</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">AI Active</span>
        </div>
      </div>

      {/* Time Horizon Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Time Horizon:</span>
        {(["24h", "7d", "30d"] as const).map((horizon) => (
          <Button
            key={horizon}
            variant={timeHorizon === horizon ? "primary" : "outline"}
            size="sm"
            onClick={() => setTimeHorizon(horizon)}
          >
            {horizon === "24h" ? "24 Hours" : horizon === "7d" ? "7 Days" : "30 Days"}
          </Button>
        ))}
      </div>

      {/* Model Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Prediction Accuracy"
          value="94.2%"
          change="Historical accuracy"
          changeType="positive"
        />
        <StatCard
          title="False Positive Rate"
          value="3.1%"
          change="Incorrect predictions"
          changeType="positive"
        />
        <StatCard
          title="Model Updates"
          value="Daily"
          change="Retraining frequency"
          changeType="positive"
        />
        <StatCard
          title="Data Points"
          value="2.4M"
          change="Training data size"
          changeType="positive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Predictions List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredPredictions.map((prediction) => (
                  <PredictionCard
                    key={prediction.id}
                    prediction={prediction}
                    isSelected={selectedPrediction.id === prediction.id}
                    onSelect={() => setSelectedPrediction(prediction)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prediction Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prediction Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Prediction Type</p>
                <Badge variant={selectedPrediction.type === "fraud_risk" ? "danger" : selectedPrediction.type === "volume_spike" ? "warning" : "info"}>
                  {selectedPrediction.type.replace("_", " ").toUpperCase()}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Confidence Level</p>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold">{selectedPrediction.confidence}%</div>
                  <Badge variant={selectedPrediction.confidence >= 90 ? "success" : selectedPrediction.confidence >= 70 ? "warning" : "info"}>
                    {selectedPrediction.confidence >= 90 ? "High Confidence" : selectedPrediction.confidence >= 70 ? "Medium Confidence" : "Low Confidence"}
                  </Badge>
                </div>
                <div className="mt-2 h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${selectedPrediction.confidence >= 90 ? "bg-emerald-500" : selectedPrediction.confidence >= 70 ? "bg-amber-500" : "bg-blue-500"}`}
                    style={{ width: `${selectedPrediction.confidence}%` }}
                  />
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Timeframe</p>
                <p className="font-semibold">{selectedPrediction.timeframe}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Impact Level</p>
                <Badge variant={selectedPrediction.impact === "high" ? "danger" : selectedPrediction.impact === "medium" ? "warning" : "success"}>
                  {selectedPrediction.impact.toUpperCase()} IMPACT
                </Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-base leading-relaxed">{selectedPrediction.description}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-3">Suggested Actions</p>
                <div className="space-y-2">
                  {selectedPrediction.suggestedActions.map((action, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 rounded-lg border bg-card">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-sm">{action}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1">Implement Actions</Button>
                <Button variant="outline" className="flex-1">Dismiss</Button>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Prediction Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-6 pl-10">
                  <TimelineItem
                    time="Now"
                    title="Current State"
                    description="System operating normally with baseline fraud detection"
                    status="complete"
                  />
                  <TimelineItem
                    time={selectedPrediction.timeframe}
                    title="Predicted Event"
                    description={selectedPrediction.description}
                    status="pending"
                  />
                  <TimelineItem
                    time="Post-Event"
                    title="Recovery & Analysis"
                    description="System analysis and model retraining based on actual outcomes"
                    status="future"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


function PredictionCard({ prediction, isSelected, onSelect }: { prediction: Prediction; isSelected: boolean; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-lg border cursor-pointer transition-all ${isSelected ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}
    >
      <div className="flex items-center justify-between mb-2">
        <Badge variant={prediction.type === "fraud_risk" ? "danger" : prediction.type === "volume_spike" ? "warning" : "info"}>
          {prediction.type.replace("_", " ")}
        </Badge>
        <span className="text-xs text-muted-foreground">{prediction.confidence}%</span>
      </div>
      <p className="text-sm font-medium mb-1">{prediction.timeframe}</p>
      <p className="text-xs text-muted-foreground line-clamp-2">{prediction.description}</p>
    </div>
  );
}

function TimelineItem({ time, title, description, status }: { time: string; title: string; description: string; status: "complete" | "pending" | "future" }) {
  const statusColors = {
    complete: "bg-emerald-500",
    pending: "bg-amber-500",
    future: "bg-gray-400",
  };

  return (
    <div className="relative">
      <div className={`absolute -left-10 w-4 h-4 rounded-full border-2 border-background ${statusColors[status]}`} />
      <div>
        <p className="text-sm font-medium">{time}</p>
        <p className="font-semibold mt-1">{title}</p>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}
