"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  role: string;
  createdAt: string;
  uid: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    gender: "prefer-not-to-say",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ── Load real user from Firebase Auth + Firestore ────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // fallback: try localStorage (for sessions set before Firebase auth)
        if (typeof window !== "undefined") {
          const name = localStorage.getItem("userName") || "";
          const email = localStorage.getItem("userEmail") || "";
          setProfile({ fullName: name, email, phone: "", gender: "prefer-not-to-say", role: "user", createdAt: "", uid: "" });
          setFormData({ fullName: name, phone: "", gender: "prefer-not-to-say" });
        }
        setLoading(false);
        return;
      }

      // Fetch Firestore doc
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const data = snap.exists() ? snap.data() : {};
        const p: UserProfile = {
          uid: user.uid,
          fullName: data.fullName || user.displayName || "User",
          email: user.email || "",
          phone: data.phone || "",
          gender: data.gender || "prefer-not-to-say",
          role: data.role || "user",
          createdAt: data.createdAt?.toDate?.()?.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) || "",
        };
        setProfile(p);
        setFormData({ fullName: p.fullName, phone: p.phone, gender: p.gender });
      } catch {
        // Firestore permission error — use Auth data only
        setProfile({
          uid: user.uid,
          fullName: user.displayName || localStorage.getItem("userName") || "User",
          email: user.email || localStorage.getItem("userEmail") || "",
          phone: "",
          gender: "prefer-not-to-say",
          role: "user",
          createdAt: "",
        });
        setFormData({
          fullName: user.displayName || localStorage.getItem("userName") || "User",
          phone: "",
          gender: "prefer-not-to-say",
        });
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // ── Save profile changes ─────────────────────────────────────────────────
  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const user = auth.currentUser;
      if (user) {
        // Update Auth display name
        await updateProfile(user, { displayName: formData.fullName });
        // Update Firestore
        await updateDoc(doc(db, "users", user.uid), {
          fullName: formData.fullName,
          phone: formData.phone,
          gender: formData.gender,
        });
      }
      // Also update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("userName", formData.fullName);
      }
      setProfile((p) => p ? { ...p, ...formData } : p);
      setSaveMsg("✅ Profile updated successfully!");
      setIsEditing(false);
    } catch {
      setSaveMsg("❌ Failed to save. Check Firestore rules.");
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 4000);
  };

  // ── Change password ──────────────────────────────────────────────────────
  const handlePasswordChange = async () => {
    setPasswordMsg("");
    if (!passwordData.newPassword || !passwordData.currentPassword) {
      setPasswordMsg("❌ Please fill in all password fields.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg("❌ New passwords do not match.");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordMsg("❌ Password must be at least 8 characters.");
      return;
    }
    setPasswordLoading(true);
    try {
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error("Not logged in");
      const cred = EmailAuthProvider.credential(user.email, passwordData.currentPassword);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, passwordData.newPassword);
      setPasswordMsg("✅ Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setPasswordMsg("❌ Current password is incorrect.");
      } else {
        setPasswordMsg("❌ Failed to change password. Try again.");
      }
    }
    setPasswordLoading(false);
    setTimeout(() => setPasswordMsg(""), 5000);
  };

  // ── Avatar initials ──────────────────────────────────────────────────────
  const initials = (profile?.fullName || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Loading your profile...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Avatar Card ─────────────────────────────────────────────── */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-4 text-primary-foreground text-3xl font-bold shadow-lg">
                {initials}
              </div>
              <h2 className="text-xl font-semibold">{profile?.fullName || "User"}</h2>
              <p className="text-muted-foreground text-sm mt-1">{profile?.email}</p>
              {profile?.phone && (
                <p className="text-muted-foreground text-xs mt-1">{profile.phone}</p>
              )}
              <div className="mt-4 flex gap-2 flex-wrap justify-center">
                <Badge variant="default">{profile?.role === "admin" ? "Admin" : "User"}</Badge>
                {profile?.createdAt && (
                  <Badge variant="info">Joined {profile.createdAt}</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">

          {/* ── Personal Info ──────────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="mt-1 w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="mt-1 p-3 rounded-lg border bg-muted/50">{profile?.fullName || "—"}</div>
                  )}
                </div>

                {/* Email — read only */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="mt-1 p-3 rounded-lg border bg-muted/50 flex items-center justify-between">
                    <span>{profile?.email || "—"}</span>
                    <Badge variant="success" className="text-xs">Verified</Badge>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1 w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <div className="mt-1 p-3 rounded-lg border bg-muted/50">{profile?.phone || "—"}</div>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Gender</label>
                  {isEditing ? (
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="mt-1 w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  ) : (
                    <div className="mt-1 p-3 rounded-lg border bg-muted/50 capitalize">
                      {profile?.gender?.replace(/-/g, " ") || "—"}
                    </div>
                  )}
                </div>

                {/* User ID */}
                {profile?.uid && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">User ID</label>
                    <div className="mt-1 p-3 rounded-lg border bg-muted/50 font-mono text-xs text-muted-foreground truncate">
                      {profile.uid}
                    </div>
                  </div>
                )}
              </div>

              {saveMsg && (
                <div className={`mt-4 p-3 rounded-lg text-sm ${saveMsg.startsWith("✅") ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
                  {saveMsg}
                </div>
              )}

              {isEditing && (
                <div className="mt-6 flex gap-3">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={() => { setIsEditing(false); setSaveMsg(""); }}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Change Password ────────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="mt-1 w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="mt-1 w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="mt-1 w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Confirm new password"
                  />
                </div>

                {passwordMsg && (
                  <div className={`p-3 rounded-lg text-sm ${passwordMsg.startsWith("✅") ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
                    {passwordMsg}
                  </div>
                )}

                <Button onClick={handlePasswordChange} disabled={passwordLoading} className="w-full">
                  {passwordLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ── Security Status ────────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Security Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div>
                    <p className="font-medium">Email Authentication</p>
                    <p className="text-sm text-muted-foreground mt-1">Signed in via Email & Password</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div>
                    <p className="font-medium">Account Status</p>
                    <p className="text-sm text-muted-foreground mt-1">Your account is in good standing</p>
                  </div>
                  <Badge variant="success">Verified</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div>
                    <p className="font-medium">Role</p>
                    <p className="text-sm text-muted-foreground mt-1 capitalize">{profile?.role || "user"}</p>
                  </div>
                  <Badge variant="info" className="capitalize">{profile?.role || "user"}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
