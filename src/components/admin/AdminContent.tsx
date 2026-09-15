"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Check } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";

interface StatItem {
  id: number;
  value: string;
  label: string;
  order: number | null;
}

interface SkillGroup {
  id: number;
  category: string;
  items: string[];
  order: number | null;
}

interface ExperienceItem {
  id: number;
  year: string;
  title: string;
  description: string | null;
  order: number | null;
}

interface ServiceItem {
  id: number;
  title: string;
  description: string | null;
  icon: string | null;
  features: string[];
  order: number | null;
}

interface AdminContentProps {
  stats: StatItem[];
  skills: SkillGroup[];
  experience: ExperienceItem[];
  services: ServiceItem[];
}

const TABS = ["Stats", "Tools & Skills", "Experience", "Services"] as const;
type Tab = (typeof TABS)[number];

const inputClasses =
  "bg-neutral-900 border border-white/8 rounded-lg px-3 py-2 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-white/30 transition-colors w-full";

const addInputClasses =
  "bg-neutral-900 border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-white/30 transition-colors";

async function jsonFetch(url: string, method: string, body?: unknown) {
  return fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

const toList = (text: string) => text.split(",").map((t) => t.trim()).filter(Boolean);

function SaveButton({
  saving,
  saved,
  dirty,
  onClick,
}: {
  saving: boolean;
  saved: boolean;
  dirty: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={saving || !dirty}
      title="Save changes"
      className={`p-2 rounded-lg transition-all ${
        saved ? "text-green-400" : dirty ? "text-white hover:bg-white/10" : "text-neutral-700"
      }`}
    >
      {saved ? <Check size={14} /> : <Save size={14} />}
    </button>
  );
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 text-neutral-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
    >
      <Trash2 size={14} />
    </button>
  );
}

export function AdminContent({
  stats: initialStats,
  skills: initialSkills,
  experience: initialExperience,
  services: initialServices,
}: AdminContentProps) {
  const [tab, setTab] = useState<Tab>("Stats");
  const [stats, setStats] = useState(initialStats);
  const [skills, setSkills] = useState(initialSkills);
  const [experience, setExperience] = useState(initialExperience);
  const [services, setServices] = useState(initialServices);

  const counts: Record<Tab, number> = {
    Stats: stats.length,
    "Tools & Skills": skills.length,
    Experience: experience.length,
    Services: services.length,
  };

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-white/5 px-8 py-5">
          <h1 className="text-white font-bold text-xl">Site Content</h1>
          <p className="text-neutral-600 text-sm">
            Edit the stats, skills, experience and services shown on the public site
          </p>
        </div>

        {/* Tabs */}
        <div className="px-8 pt-6 flex gap-2 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === t
                  ? "bg-white text-black"
                  : "bg-neutral-900 text-neutral-500 hover:text-white border border-white/5"
              }`}
            >
              {t}
              <span className={`ml-2 text-xs ${tab === t ? "text-neutral-500" : "text-neutral-700"}`}>
                {counts[t]}
              </span>
            </button>
          ))}
        </div>

        <div className="p-8 max-w-3xl">
          {tab === "Stats" && <StatsSection stats={stats} setStats={setStats} />}
          {tab === "Tools & Skills" && <SkillsSection skills={skills} setSkills={setSkills} />}
          {tab === "Experience" && (
            <ExperienceSection experience={experience} setExperience={setExperience} />
          )}
          {tab === "Services" && <ServicesSection services={services} setServices={setServices} />}
        </div>
      </div>
    </div>
  );
}

/* ── Stats ──────────────────────────────────────────────────────────── */

function StatsSection({
  stats,
  setStats,
}: {
  stats: StatItem[];
  setStats: React.Dispatch<React.SetStateAction<StatItem[]>>;
}) {
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!value.trim() || !label.trim()) return;
    setAdding(true);
    try {
      const res = await jsonFetch("/api/admin/stats", "POST", {
        value: value.trim(),
        label: label.trim(),
        order: (stats[stats.length - 1]?.order ?? 0) + 1,
      });
      if (res.ok) {
        const data = await res.json();
        setStats((prev) => [...prev, data.data]);
        setValue("");
        setLabel("");
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      {/* Add new */}
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Value (e.g. 8+)"
          className={`${addInputClasses} w-32`}
        />
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Label (e.g. Years of Experience)"
          className={`${addInputClasses} flex-1`}
        />
        <button
          onClick={handleAdd}
          disabled={adding || !value.trim() || !label.trim()}
          className="flex items-center gap-2 bg-white text-black font-bold text-sm px-5 py-3 rounded-xl hover:bg-neutral-100 disabled:opacity-50 transition-colors"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      <div className="bg-neutral-900 rounded-xl border border-white/5 divide-y divide-white/5">
        {stats.map((stat) => (
          <StatRow
            key={stat.id}
            stat={stat}
            onUpdated={(updated) =>
              setStats((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
            }
            onDeleted={(id) => setStats((prev) => prev.filter((s) => s.id !== id))}
          />
        ))}
        {stats.length === 0 && (
          <p className="p-8 text-center text-neutral-700 text-sm">No stats yet</p>
        )}
      </div>
    </div>
  );
}

function StatRow({
  stat,
  onUpdated,
  onDeleted,
}: {
  stat: StatItem;
  onUpdated: (s: StatItem) => void;
  onDeleted: (id: number) => void;
}) {
  const [value, setValue] = useState(stat.value);
  const [label, setLabel] = useState(stat.label);
  const [order, setOrder] = useState(String(stat.order ?? 0));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const dirty = value !== stat.value || label !== stat.label || order !== String(stat.order ?? 0);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await jsonFetch(`/api/admin/stats/${stat.id}`, "PATCH", {
        value: value.trim(),
        label: label.trim(),
        order: parseInt(order) || 0,
      });
      if (res.ok) {
        const data = await res.json();
        onUpdated(data.data);
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this stat?")) return;
    await fetch(`/api/admin/stats/${stat.id}`, { method: "DELETE" });
    onDeleted(stat.id);
  };

  return (
    <div className="p-4 grid grid-cols-[100px_1fr_auto] gap-3 items-center">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={inputClasses}
        aria-label="Stat value"
      />
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className={inputClasses}
        aria-label="Stat label"
      />
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className={`${inputClasses} w-16`}
          aria-label="Order"
        />
        <SaveButton saving={saving} saved={saved} dirty={dirty} onClick={handleSave} />
        <DeleteButton onClick={handleDelete} />
      </div>
    </div>
  );
}

/* ── Tools & Skills ─────────────────────────────────────────────────── */

function SkillsSection({
  skills,
  setSkills,
}: {
  skills: SkillGroup[];
  setSkills: React.Dispatch<React.SetStateAction<SkillGroup[]>>;
}) {
  const [category, setCategory] = useState("");
  const [items, setItems] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    const itemList = toList(items);
    if (!category.trim() || itemList.length === 0) return;
    setAdding(true);
    try {
      const res = await jsonFetch("/api/admin/skills", "POST", {
        category: category.trim(),
        items: itemList,
        order: (skills[skills.length - 1]?.order ?? 0) + 1,
      });
      if (res.ok) {
        const data = await res.json();
        setSkills((prev) => [...prev, data.data]);
        setCategory("");
        setItems("");
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Group (e.g. Video Editing)"
          className={`${addInputClasses} w-56`}
        />
        <input
          type="text"
          value={items}
          onChange={(e) => setItems(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Items, comma separated (e.g. Premiere Pro, DaVinci Resolve)"
          className={`${addInputClasses} flex-1`}
        />
        <button
          onClick={handleAdd}
          disabled={adding || !category.trim() || !items.trim()}
          className="flex items-center gap-2 bg-white text-black font-bold text-sm px-5 py-3 rounded-xl hover:bg-neutral-100 disabled:opacity-50 transition-colors"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      <div className="bg-neutral-900 rounded-xl border border-white/5 divide-y divide-white/5">
        {skills.map((group) => (
          <SkillRow
            key={group.id}
            group={group}
            onUpdated={(updated) =>
              setSkills((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
            }
            onDeleted={(id) => setSkills((prev) => prev.filter((s) => s.id !== id))}
          />
        ))}
        {skills.length === 0 && (
          <p className="p-8 text-center text-neutral-700 text-sm">No skill groups yet</p>
        )}
      </div>
    </div>
  );
}

function SkillRow({
  group,
  onUpdated,
  onDeleted,
}: {
  group: SkillGroup;
  onUpdated: (s: SkillGroup) => void;
  onDeleted: (id: number) => void;
}) {
  const [category, setCategory] = useState(group.category);
  const [items, setItems] = useState(group.items.join(", "));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const dirty = category !== group.category || items !== group.items.join(", ");

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await jsonFetch(`/api/admin/skills/${group.id}`, "PATCH", {
        category: category.trim(),
        items: toList(items),
      });
      if (res.ok) {
        const data = await res.json();
        onUpdated(data.data);
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this skill group?")) return;
    await fetch(`/api/admin/skills/${group.id}`, { method: "DELETE" });
    onDeleted(group.id);
  };

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`${inputClasses} font-medium`}
          aria-label="Skill group"
        />
        <div className="flex items-center gap-2 flex-shrink-0">
          <SaveButton saving={saving} saved={saved} dirty={dirty} onClick={handleSave} />
          <DeleteButton onClick={handleDelete} />
        </div>
      </div>
      <textarea
        value={items}
        onChange={(e) => setItems(e.target.value)}
        rows={2}
        placeholder="Comma separated items"
        className={`${inputClasses} resize-none`}
        aria-label="Skill items"
      />
    </div>
  );
}

/* ── Experience ─────────────────────────────────────────────────────── */

function ExperienceSection({
  experience,
  setExperience,
}: {
  experience: ExperienceItem[];
  setExperience: React.Dispatch<React.SetStateAction<ExperienceItem[]>>;
}) {
  const [year, setYear] = useState("");
  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!year.trim() || !title.trim()) return;
    setAdding(true);
    try {
      const res = await jsonFetch("/api/admin/experience", "POST", {
        year: year.trim(),
        title: title.trim(),
        description: "",
        order: (experience[0]?.order ?? 1) - 1,
      });
      if (res.ok) {
        const data = await res.json();
        setExperience((prev) => [data.data, ...prev]);
        setYear("");
        setTitle("");
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year (e.g. 2024)"
          className={`${addInputClasses} w-28`}
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Title (e.g. International Campaigns)"
          className={`${addInputClasses} flex-1`}
        />
        <button
          onClick={handleAdd}
          disabled={adding || !year.trim() || !title.trim()}
          className="flex items-center gap-2 bg-white text-black font-bold text-sm px-5 py-3 rounded-xl hover:bg-neutral-100 disabled:opacity-50 transition-colors"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      <div className="bg-neutral-900 rounded-xl border border-white/5 divide-y divide-white/5">
        {experience.map((item) => (
          <ExperienceRow
            key={item.id}
            item={item}
            onUpdated={(updated) =>
              setExperience((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
            }
            onDeleted={(id) => setExperience((prev) => prev.filter((e) => e.id !== id))}
          />
        ))}
        {experience.length === 0 && (
          <p className="p-8 text-center text-neutral-700 text-sm">No experience entries yet</p>
        )}
      </div>
    </div>
  );
}

function ExperienceRow({
  item,
  onUpdated,
  onDeleted,
}: {
  item: ExperienceItem;
  onUpdated: (e: ExperienceItem) => void;
  onDeleted: (id: number) => void;
}) {
  const [year, setYear] = useState(item.year);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const dirty =
    year !== item.year || title !== item.title || description !== (item.description || "");

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await jsonFetch(`/api/admin/experience/${item.id}`, "PATCH", {
        year: year.trim(),
        title: title.trim(),
        description: description.trim(),
      });
      if (res.ok) {
        const data = await res.json();
        onUpdated(data.data);
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this experience entry?")) return;
    await fetch(`/api/admin/experience/${item.id}`, { method: "DELETE" });
    onDeleted(item.id);
  };

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className={`${inputClasses} w-24`}
          aria-label="Year"
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`${inputClasses} font-medium`}
          aria-label="Title"
        />
        <div className="flex items-center gap-2 flex-shrink-0">
          <SaveButton saving={saving} saved={saved} dirty={dirty} onClick={handleSave} />
          <DeleteButton onClick={handleDelete} />
        </div>
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        placeholder="Description"
        className={`${inputClasses} resize-none`}
        aria-label="Description"
      />
    </div>
  );
}

/* ── Services ───────────────────────────────────────────────────────── */

function ServicesSection({
  services,
  setServices,
}: {
  services: ServiceItem[];
  setServices: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
}) {
  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!title.trim()) return;
    setAdding(true);
    try {
      const res = await jsonFetch("/api/admin/services", "POST", {
        title: title.trim(),
        description: "",
        icon: "",
        features: [],
        order: (services[services.length - 1]?.order ?? 0) + 1,
      });
      if (res.ok) {
        const data = await res.json();
        setServices((prev) => [...prev, data.data]);
        setTitle("");
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Service title (e.g. Video Editing)"
          className={`${addInputClasses} flex-1`}
        />
        <button
          onClick={handleAdd}
          disabled={adding || !title.trim()}
          className="flex items-center gap-2 bg-white text-black font-bold text-sm px-5 py-3 rounded-xl hover:bg-neutral-100 disabled:opacity-50 transition-colors"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      <div className="bg-neutral-900 rounded-xl border border-white/5 divide-y divide-white/5">
        {services.map((service) => (
          <ServiceRow
            key={service.id}
            service={service}
            onUpdated={(updated) =>
              setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
            }
            onDeleted={(id) => setServices((prev) => prev.filter((s) => s.id !== id))}
          />
        ))}
        {services.length === 0 && (
          <p className="p-8 text-center text-neutral-700 text-sm">No services yet</p>
        )}
      </div>
    </div>
  );
}

function ServiceRow({
  service,
  onUpdated,
  onDeleted,
}: {
  service: ServiceItem;
  onUpdated: (s: ServiceItem) => void;
  onDeleted: (id: number) => void;
}) {
  const [title, setTitle] = useState(service.title);
  const [description, setDescription] = useState(service.description || "");
  const [features, setFeatures] = useState(service.features.join(", "));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const dirty =
    title !== service.title ||
    description !== (service.description || "") ||
    features !== service.features.join(", ");

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await jsonFetch(`/api/admin/services/${service.id}`, "PATCH", {
        title: title.trim(),
        description: description.trim(),
        features: toList(features),
      });
      if (res.ok) {
        const data = await res.json();
        onUpdated(data.data);
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/admin/services/${service.id}`, { method: "DELETE" });
    onDeleted(service.id);
  };

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`${inputClasses} font-medium`}
          aria-label="Service title"
        />
        <div className="flex items-center gap-2 flex-shrink-0">
          <SaveButton saving={saving} saved={saved} dirty={dirty} onClick={handleSave} />
          <DeleteButton onClick={handleDelete} />
        </div>
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        placeholder="Description"
        className={`${inputClasses} resize-none`}
        aria-label="Service description"
      />
      <input
        type="text"
        value={features}
        onChange={(e) => setFeatures(e.target.value)}
        placeholder="Features, comma separated"
        className={inputClasses}
        aria-label="Service features"
      />
    </div>
  );
}




