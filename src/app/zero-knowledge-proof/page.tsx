"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";

interface ZKPProof {
  id: string;
  type: "identity" | "transaction" | "balance" | "age";
  prover: string;
  verifier: string;
  status: "pending" | "verified" | "failed";
  timestamp: string;
  proofSize: string;
  verificationTime: string;
}

const mockProofs: ZKPProof[] = [
  {
    id: "ZKP-001",
    type: "identity",
    prover: "user-123",
    verifier: "system",
    status: "verified",
    timestamp: "2024-01-15 14:30:00",
    proofSize: "2.4 KB",
    verificationTime: "45ms",
  },
  {
    id: "ZKP-002",
    type: "transaction",
    prover: "user-456",
    verifier: "merchant-system",
    status: "verified",
    timestamp: "2024-01-15 14:28:00",
    proofSize: "3.1 KB",
    verificationTime: "52ms",
  },
  {
    id: "ZKP-003",
    type: "balance",
    prover: "user-789",
    verifier: "bank-api",
    status: "pending",
    timestamp: "2024-01-15 14:25:00",
    proofSize: "1.8 KB",
    verificationTime: "—",
  },
];

export default function ZeroKnowledgeProofPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [proofs, setProofs] = useState<ZKPProof[]>(mockProofs);
  const [selectedProofType, setSelectedProofType] = useState<string>("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [challengeData, setChallengeData] = useState("");

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Zero-Knowledge Proofs</h1>
          <p className="text-muted-foreground">Prove statements without revealing underlying information</p>
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

  const filteredProofs = proofs.filter(p => 
    selectedProofType === "all" || p.type === selectedProofType
  );

  const handleGenerateProof = async () => {
    if (!challengeData.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate proof generation
    setTimeout(() => {
      const newProof: ZKPProof = {
        id: `ZKP-${Date.now()}`,
        type: "identity" as const,
        prover: "current-user",
        verifier: "system",
        status: "verified",
        timestamp: new Date().toISOString(),
        proofSize: (Math.random() * 2 + 1).toFixed(1) + " KB",
        verificationTime: Math.floor(Math.random() * 30 + 30) + "ms",
      };
      
      setProofs(prev => [newProof, ...prev]);
      setIsGenerating(false);
      setChallengeData("");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Zero-Knowledge Proofs</h1>
          <p className="text-muted-foreground">Prove statements without revealing underlying information</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">ZKP Active</span>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Proofs Generated"
          value={proofs.length.toString()}
          change="Total proofs"
          changeType="positive"
        />
        <StatCard
          title="Verification Rate"
          value="98.7%"
          change="Success rate"
          changeType="positive"
        />
        <StatCard
          title="Avg Proof Size"
          value="2.4 KB"
          change="Compressed"
          changeType="positive"
        />
        <StatCard
          title="Avg Verify Time"
          value="48ms"
          change="Fast verification"
          changeType="positive"
        />
      </div>

      {/* Proof Generation */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle>Generate Zero-Knowledge Proof</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Statement to Prove</label>
            <select
              className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              defaultValue="identity"
            >
              <option value="identity">I am over 18 years old</option>
              <option value="balance">I have sufficient balance</option>
              <option value="transaction">This transaction is legitimate</option>
              <option value="custom">Custom statement</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Challenge Data (Optional)</label>
            <textarea
              value={challengeData}
              onChange={(e) => setChallengeData(e.target.value)}
              placeholder="Enter additional challenge data..."
              className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
            />
          </div>

          <Button onClick={handleGenerateProof} disabled={isGenerating} className="w-full">
            {isGenerating ? "Generating Proof..." : "Generate ZKP"}
          </Button>
        </CardContent>
      </Card>

      {/* Proof Types Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Filter by Type:</span>
            {(["all", "identity", "transaction", "balance", "age"] as const).map((type) => (
              <Button
                key={type}
                variant={selectedProofType === type ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedProofType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Proof History */}
      <Card>
        <CardHeader>
          <CardTitle>Proof History ({filteredProofs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProofs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No proofs found. Generate a proof above to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProofs.map((proof) => (
                <ProofCard key={proof.id} proof={proof} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Zero-Knowledge Proofs Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <StepCard
            step={1}
            title="Prover Creates Commitment"
            description="The prover (user) creates a mathematical commitment to a statement without revealing the underlying data"
          />
          <StepCard
            step={2}
            title="Verifier Sends Challenge"
            description="The verifier (system) sends a random challenge to ensure the prover cannot cheat"
          />
          <StepCard
            step={3}
            title="Prover Responds"
            description="The prover computes a response based on the challenge and their secret knowledge"
          />
          <StepCard
            step={4}
            title="Verification"
            description="The verifier checks the response mathematically. If valid, the statement is proven true without revealing secrets"
          />
        </CardContent>
      </Card>

      {/* Privacy Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Benefits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PrivacyBenefit
            title="Zero Information Leakage"
            description="No sensitive data is ever revealed during the proof process"
            icon="🔒"
          />
          <PrivacyBenefit
            title="Mathematical Guarantee"
            description="Cryptographic proof ensures the statement is true with mathematical certainty"
            icon="🔐"
          />
          <PrivacyBenefit
            title="No Trust Required"
            description="No need to trust the prover - the proof speaks for itself"
            icon="✓"
          />
          <PrivacyBenefit
            title="Compliance Ready"
            description="Meets GDPR, CCPA, and other privacy regulations by design"
            icon="📋"
          />
        </CardContent>
      </Card>

      {/* Technical Implementation */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Implementation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TechnicalSpec
            title="Proof System"
            value="zk-SNARKs (Zero-Knowledge Succinct Non-Interactive Argument of Knowledge)"
          />
          <TechnicalSpec
            title="Curve"
            value="BN254 / BLS12-381"
          />
          <TechnicalSpec
            title="Proof Size"
            value="~200 bytes (compressed)"
          />
          <TechnicalSpec
            title="Verification Time"
            value="< 10ms"
          />
          <TechnicalSpec
            title="Setup"
            value="Trusted setup with powers of tau ceremony"
          />
        </CardContent>
      </Card>
    </div>
  );
}


function ProofCard({ proof }: { proof: ZKPProof }) {
  const typeColors = {
    identity: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    transaction: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    balance: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    age: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  };

  return (
    <div className="p-4 rounded-lg border bg-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={typeColors[proof.type]}>
              {proof.type.toUpperCase()}
            </Badge>
            <span className="text-xs text-muted-foreground">{proof.id}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Prover: {proof.prover}</span>
            <span>Verifier: {proof.verifier}</span>
          </div>
        </div>
        <Badge variant={proof.status === "verified" ? "success" : proof.status === "pending" ? "warning" : "danger"}>
          {proof.status}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Proof Size:</span>
          <span className="font-medium">{proof.proofSize}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Verify Time:</span>
          <span className="font-medium">{proof.verificationTime}</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{new Date(proof.timestamp).toLocaleString()}</p>
    </div>
  );
}

function StepCard({ step, title, description }: { step: number; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
        {step}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}

function PrivacyBenefit({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
      <div className="text-2xl">{icon}</div>
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}

function TechnicalSpec({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
      <span className="text-sm text-muted-foreground">{title}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
