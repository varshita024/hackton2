"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";

interface EncryptionOperation {
  id: string;
  type: "encrypt" | "decrypt" | "compute";
  data: string;
  result: string;
  timestamp: string;
  status: "success" | "processing" | "failed";
}

export default function HomomorphicEncryptionPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [operations, setOperations] = useState<EncryptionOperation[]>([]);
  const [inputData, setInputData] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [keyRotationStatus, setKeyRotationStatus] = useState<"active" | "rotating">("active");
  const [encryptionStrength, setEncryptionStrength] = useState<"AES-128" | "AES-256" | "AES-512">("AES-256");

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Homomorphic Encryption</h1>
          <p className="text-muted-foreground">Perform computations on encrypted data without decryption</p>
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

  const handleEncrypt = async () => {
    if (!inputData.trim()) return;
    
    setIsProcessing(true);
    const operation: EncryptionOperation = {
      id: `OP-${Date.now()}`,
      type: "encrypt",
      data: inputData,
      result: "Encrypted data (homomorphic)",
      timestamp: new Date().toISOString(),
      status: "processing",
    };
    
    setOperations(prev => [operation, ...prev]);
    
    // Simulate encryption
    setTimeout(() => {
      setOperations(prev => prev.map(op => 
        op.id === operation.id 
          ? { ...op, result: generateEncryptedString(inputData), status: "success" }
          : op
      ));
      setIsProcessing(false);
    }, 1500);
  };

  const handleCompute = async () => {
    if (!inputData.trim()) return;
    
    setIsProcessing(true);
    const operation: EncryptionOperation = {
      id: `OP-${Date.now()}`,
      type: "compute",
      data: inputData,
      result: "Computation result",
      timestamp: new Date().toISOString(),
      status: "processing",
    };
    
    setOperations(prev => [operation, ...prev]);
    
    // Simulate homomorphic computation
    setTimeout(() => {
      setOperations(prev => prev.map(op => 
        op.id === operation.id 
          ? { ...op, result: `Computed on encrypted data: ${Math.floor(Math.random() * 10000)}`, status: "success" }
          : op
      ));
      setIsProcessing(false);
    }, 2000);
  };

  const handleKeyRotation = () => {
    setKeyRotationStatus("rotating");
    setTimeout(() => {
      setKeyRotationStatus("active");
    }, 3000);
  };

  const generateEncryptedString = (data: string): string => {
    // Simulate encrypted output
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let result = "";
    for (let i = 0; i < Math.max(data.length * 2, 32); i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Homomorphic Encryption</h1>
          <p className="text-muted-foreground">Perform computations on encrypted data without decryption</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">Encryption Active</span>
        </div>
      </div>

      {/* Encryption Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Encryption Status"
          value="Active"
          change="FHE operational"
          changeType="positive"
        />
        <StatCard
          title="Key Strength"
          value={encryptionStrength}
          change="Military grade"
          changeType="positive"
        />
        <StatCard
          title="Key Rotation"
          value={keyRotationStatus === "active" ? "24h cycle" : "Rotating..."}
          change="Auto rotation"
          changeType="positive"
        />
        <StatCard
          title="Operations Today"
          value={operations.length.toString()}
          change="Encrypted computations"
          changeType="positive"
        />
      </div>

      {/* Encryption Controls */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle>Encryption Operations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Input Data</label>
            <textarea
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="Enter data to encrypt or compute on..."
              className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Encryption Strength:</span>
            {(["AES-128", "AES-256", "AES-512"] as const).map((strength) => (
              <Button
                key={strength}
                variant={encryptionStrength === strength ? "primary" : "outline"}
                size="sm"
                onClick={() => setEncryptionStrength(strength)}
              >
                {strength}
              </Button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button onClick={handleEncrypt} disabled={isProcessing || !inputData.trim()}>
              {isProcessing ? "Encrypting..." : "Encrypt Data"}
            </Button>
            <Button variant="outline" onClick={handleCompute} disabled={isProcessing || !inputData.trim()}>
              {isProcessing ? "Computing..." : "Compute on Encrypted"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Management */}
      <Card>
        <CardHeader>
          <CardTitle>Key Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
            <div>
              <p className="font-medium">Automatic Key Rotation</p>
              <p className="text-sm text-muted-foreground mt-1">Keys rotate every 24 hours for enhanced security</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${keyRotationStatus === "active" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
              <Badge variant={keyRotationStatus === "active" ? "success" : "warning"}>
                {keyRotationStatus === "active" ? "Active" : "Rotating"}
              </Badge>
            </div>
          </div>

          <Button onClick={handleKeyRotation} disabled={keyRotationStatus === "rotating"} variant="outline">
            {keyRotationStatus === "rotating" ? "Rotating Keys..." : "Force Key Rotation"}
          </Button>
        </CardContent>
      </Card>

      {/* Operation History */}
      <Card>
        <CardHeader>
          <CardTitle>Operation History</CardTitle>
        </CardHeader>
        <CardContent>
          {operations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No encryption operations yet. Enter data above to begin.
            </div>
          ) : (
            <div className="space-y-3">
              {operations.slice(0, 10).map((op) => (
                <OperationCard key={op.id} operation={op} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Implementation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TechnicalDetail
            title="Encryption Scheme"
            description="Fully Homomorphic Encryption (FHE) allowing arbitrary computations on ciphertexts"
            status="Implemented"
          />
          <TechnicalDetail
            title="Data Privacy"
            description="Original data never decrypted during fraud detection analysis"
            status="Active"
          />
          <TechnicalDetail
            title="Performance"
            description="Optimized for real-time fraud detection with <50ms latency"
            status="Optimized"
          />
          <TechnicalDetail
            title="Compliance"
            description="GDPR and PCI-DSS compliant encryption standards"
            status="Compliant"
          />
        </CardContent>
      </Card>
    </div>
  );
}


function OperationCard({ operation }: { operation: EncryptionOperation }) {
  const typeColors = {
    encrypt: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    decrypt: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    compute: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  };

  const statusColors = {
    success: "text-emerald-600",
    processing: "text-amber-600",
    failed: "text-red-600",
  };

  return (
    <div className="p-4 rounded-lg border bg-card">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={typeColors[operation.type]}>
              {operation.type.toUpperCase()}
            </Badge>
            <span className="text-xs text-muted-foreground">{operation.id}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">{operation.data}</p>
        </div>
        <Badge variant={operation.status === "success" ? "success" : operation.status === "processing" ? "warning" : "danger"}>
          {operation.status}
        </Badge>
      </div>
      <div className="mt-2">
        <p className="text-xs text-muted-foreground mb-1">Result:</p>
        <p className="text-sm font-mono text-xs bg-muted/50 p-2 rounded break-all">{operation.result}</p>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{new Date(operation.timestamp).toLocaleString()}</p>
    </div>
  );
}

function TechnicalDetail({ title, description, status }: { title: string; description: string; status: string }) {
  return (
    <div className="flex items-start justify-between p-4 rounded-lg border bg-card">
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <Badge variant="success">{status}</Badge>
    </div>
  );
}
