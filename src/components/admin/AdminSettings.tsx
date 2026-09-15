"use client";

import { useState } from "react";
import { Save, KeyRound, AlertCircle, CheckCircle } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";

interface Setting {
  id: number;
  key: string;
  value: string | null;
  type: string | null;
  updatedAt: Date;
}

interface AdminSettingsProps {
  settings: Setting[];
}

export function AdminSettings({ settings: initialSettings }: AdminSettingsProps) {
  const [settings, setSettings] = useState(
    Object.fromEntries(initialSettings.map((s) => [s.key, s.value || ""]))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Admin credential fields (stored in MongoDB, NOT env vars)
  const [currentPassword, setCurrentPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [credSaving, setCredSaving] = useState(false);
  const [credSaved, setCredSaved] = useState(false);
  const [credError, setCredError] = useState("");

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
    setSaveError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to save settings");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setSaveError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCredentials = async () => {
    setCredSaving(true);
    setCredSaved(false);
    setCredError("");

    try {
      const payload: Record<string, string> = { currentPassword };
      if (adminEmail.trim()) payload.email = adminEmail.trim();
      if (adminName.trim()) payload.name = adminName.trim();
      if (newPassword) payload.newPassword = newPassword;

      const res = await fetch("/api/admin/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "Failed to update credentials");
      }

      setCredSaved(true);
      // Clear the sensitive fields after a successful change.
      setCurrentPassword("");
      setAdminEmail("");
      setAdminName("");
      setNewPassword("");
      setTimeout(() => setCredSaved(false), 5000);
    } catch (err: any) {
      setCredError(err.message || "Failed to update credentials");
    } finally {
      setCredSaving(false);
    }
  };

  const labels: Record<string, string> = {
    hero_title: "Hero Title",
    hero_subtitle: "Hero Subtitle",
    hero_cta: "Hero CTA Button",
    about_title: "About Page Title",
    about_bio: "About Bio",
    about_bio_2: "About Bio (Paragraph 2)",
    contact_email: "Contact Email",
    availability: "Availability Status",
  };

  const inputClasses =
    "w-full bg-neutral-900 border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-white/30 transition-colors";

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-xl">Settings</h1>
            <p className="text-neutral-600 text-sm">Site configuration</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-white text-black font-bold text-sm px-4 py-2 rounded-lg hover:bg-neutral-100 disabled:opacity-50 transition-colors"
          >
            <Save size={14} />
            {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="p-8 max-w-2xl space-y-8">
          {/* Site content settings */}
          <div className="bg-neutral-900 rounded-xl border border-white/5 p-6 space-y-5">
            <h2 className="text-white font-bold text-sm mb-1">Site Content</h2>
            {initialSettings.map((setting) => (
              <div key={setting.key}>
                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wide font-medium">
                  {labels[setting.key] || setting.key.replace(/_/g, " ")}
                </label>
                {setting.key.includes("bio") || setting.key.includes("description") ? (
                  <textarea
                    value={settings[setting.key] || ""}
                    onChange={(e) => handleChange(setting.key, e.target.value)}
                    rows={4}
                    className={`${inputClasses} resize-none`}
                  />
                ) : (
                  <input
                    type="text"
                    value={settings[setting.key] || ""}
                    onChange={(e) => handleChange(setting.key, e.target.value)}
                    className={inputClasses}
                  />
                )}
              </div>
            ))}
            {saveError && (
              <p className="text-red-400 text-sm">{saveError}</p>
            )}
          </div>

          {/* Admin login credentials (stored in MongoDB) */}
          <div className="bg-neutral-900 rounded-xl border border-white/5 p-6">
            <h2 className="text-white font-bold text-sm mb-1">Admin Login Credentials</h2>
            <p className="text-neutral-600 text-xs mb-5">
              These are stored securely in MongoDB (hashed). Leave a field empty to keep the current value.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wide font-medium">
                  Current Password *
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Required to confirm changes"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wide font-medium">
                  Login Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="new-email@example.com"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wide font-medium">
                  Display Name
                </label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="Golam Kibria"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wide font-medium">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  className={inputClasses}
                />
              </div>

              {credError && (
                <div className="flex items-start gap-2 text-red-400 text-sm">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span>{credError}</span>
                </div>
              )}
              {credSaved && (
                <div className="flex items-start gap-2 text-green-400 text-sm">
                  <CheckCircle size={15} className="shrink-0 mt-0.5" />
                  <span>Credentials updated. Use the new credentials on your next login.</span>
                </div>
              )}

              <button
                onClick={handleSaveCredentials}
                disabled={credSaving || !currentPassword.trim()}
                className="flex items-center gap-2 bg-white text-black font-bold text-sm px-4 py-2.5 rounded-lg hover:bg-neutral-100 disabled:opacity-50 transition-colors"
              >
                <KeyRound size={14} />
                {credSaving ? "Updating..." : "Update Login Credentials"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
