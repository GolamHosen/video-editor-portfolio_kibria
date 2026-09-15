"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileVideo, FolderOpen, Sparkles, MessageSquare, Settings, LogOut, Star } from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/projects", icon: FileVideo, label: "Projects" },
  { href: "/admin/categories", icon: FolderOpen, label: "Categories" },
  { href: "/admin/content", icon: Sparkles, label: "Site Content" },
  { href: "/admin/comments", icon: Star, label: "Reviews" },
  { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-64 bg-black border-r border-white/5 flex flex-col flex-shrink-0 sticky top-0 h-screen">
      <div className="p-6 border-b border-white/5">
        <Link href="/admin" className="text-white font-bold text-lg tracking-tight">
          <span>VISUAL</span>
          <span className="text-neutral-500">CRAFT</span>
        </Link>
        <p className="text-neutral-600 text-xs mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              prefetch={false}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-500 hover:text-white hover:bg-neutral-900"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 text-sm font-medium"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
