"use client";

import { useState } from "react";
import { Save } from "lucide-react";
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

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const labels: Record<string, string> = {
    hero_title: "Hero Title",
    hero_subtitle: "Hero Subtitle",
    hero_cta: "Hero CTA Button",
    about_title: "About Page Title",
    about_bio: "About Bio",
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

        <div className="p-8 max-w-2xl">
          <div className="bg-neutral-900 rounded-xl border border-white/5 p-6 space-y-5">
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
          </div>
        </div>
      </div>
    </div>
  );
}
