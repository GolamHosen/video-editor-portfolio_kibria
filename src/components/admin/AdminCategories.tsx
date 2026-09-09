"use client";

import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  order: number | null;
  createdAt: Date;
}

interface AdminCategoriesProps {
  categories: Category[];
}

export function AdminCategories({ categories: initialCategories }: AdminCategoriesProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), slug: slugify(newName) }),
      });
      if (res.ok) {
        const data = await res.json();
        setCategories((prev) => [...prev, data.data]);
        setNewName("");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-white/5 px-8 py-5">
          <h1 className="text-white font-bold text-xl">Categories</h1>
          <p className="text-neutral-600 text-sm">{categories.length} categories</p>
        </div>

        <div className="p-8 max-w-2xl">
          {/* Add new */}
          <div className="flex gap-3 mb-8">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Category name..."
              className="flex-1 bg-neutral-900 border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-white/30 transition-colors"
            />
            <button
              onClick={handleAdd}
              disabled={saving || !newName.trim()}
              className="flex items-center gap-2 bg-white text-black font-bold text-sm px-5 py-3 rounded-xl hover:bg-neutral-100 disabled:opacity-50 transition-colors"
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          {/* Category list */}
          <div className="bg-neutral-900 rounded-xl border border-white/5 divide-y divide-white/5">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-white font-medium text-sm">{cat.name}</p>
                  <p className="text-neutral-600 text-xs mt-0.5">/{cat.slug}</p>
                </div>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 text-neutral-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="p-8 text-center text-neutral-700 text-sm">No categories yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
