"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false,
    twoFactorAuth: true,
    biometricAuth: false,
    autoBlockHighRisk: true,
    requireVerification: false,
    demoMode: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure your application preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground mt-1">Choose your preferred color scheme</p>
              </div>
              <ThemeToggle />
            </div>
            <SettingItem
              label="Language"
              description="Select your preferred language"
              value="English (US)"
              action="Change"
            />
            <SettingItem
              label="Timezone"
              description="Set your local timezone"
              value="UTC-5 (Eastern Time)"
              action="Change"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ToggleSetting
              label="Email Notifications"
              description="Receive alerts via email"
              enabled={settings.emailNotifications}
              onToggle={() => toggleSetting("emailNotifications")}
            />
            <ToggleSetting
              label="Push Notifications"
              description="Receive real-time push notifications"
              enabled={settings.pushNotifications}
              onToggle={() => toggleSetting("pushNotifications")}
            />
            <ToggleSetting
              label="SMS Alerts"
              description="Receive critical alerts via SMS"
              enabled={settings.smsAlerts}
              onToggle={() => toggleSetting("smsAlerts")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ToggleSetting
              label="Two-Factor Authentication"
              description="Require 2FA for sensitive actions"
              enabled={settings.twoFactorAuth}
              onToggle={() => toggleSetting("twoFactorAuth")}
            />
            <ToggleSetting
              label="Biometric Authentication"
              description="Use fingerprint or face ID when available"
              enabled={settings.biometricAuth}
              onToggle={() => toggleSetting("biometricAuth")}
            />
            <SettingItem
              label="Login Sessions"
              description="Manage active sessions"
              value="3 active sessions"
              action="View"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fraud Detection Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ToggleSetting
              label="Auto-Block High Risk"
              description="Automatically block transactions with 90%+ risk"
              enabled={settings.autoBlockHighRisk}
              onToggle={() => toggleSetting("autoBlockHighRisk")}
            />
            <ToggleSetting
              label="Require Verification"
              description="Require user confirmation for medium-risk transactions"
              enabled={settings.requireVerification}
              onToggle={() => toggleSetting("requireVerification")}
            />
            <SettingItem
              label="Sensitivity Level"
              description="Adjust fraud detection sensitivity"
              value="Medium"
              action="Configure"
            />
            <SettingItem
              label="Velocity Thresholds"
              description="Set transaction velocity limits"
              value="Default"
              action="Customize"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Demo Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ToggleSetting
              label="Demo Mode"
              description="Enable simulated attack demonstrations"
              enabled={settings.demoMode}
              onToggle={() => toggleSetting("demoMode")}
            />
            <SettingItem
              label="Attack Simulation Speed"
              description="Control the speed of attack simulations"
              value="Normal"
              action="Adjust"
            />
            <SettingItem
              label="Reset Demo Data"
              description="Clear all demo transactions and alerts"
              value=""
              action="Reset"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <SettingItem
              label="Data Retention"
              description="Configure how long to keep transaction data"
              value="90 days"
              action="Change"
            />
            <SettingItem
              label="Export Data"
              description="Download your data"
              value=""
              action="Export"
            />
            <div className="pt-4 border-t">
              <Button variant="outline" className="text-red-600 hover:text-red-700">
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingItem({ label, description, value, action }: { label: string; description: string; value: string; action: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        {value && <p className="text-sm font-medium mt-2">{value}</p>}
      </div>
      <Button variant="outline" size="sm">{action}</Button>
    </div>
  );
}

function ToggleSetting({ label, description, enabled, onToggle }: { label: string; description: string; enabled: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`w-12 h-6 rounded-full transition-colors ${enabled ? "bg-primary" : "bg-muted"}`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  );
}
