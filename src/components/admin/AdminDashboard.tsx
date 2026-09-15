"use client";

import Link from "next/link";
import { Plus, Eye, FileVideo, MessageSquare, Settings } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";

interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  totalMessages: number;
  unreadMessages: number;
  totalCategories: number;
}

interface RecentProject {
  id: number;
  title: string;
  slug: string;
  status: string | null;
  featured: boolean | null;
  createdAt: Date;
}

interface RecentMessage {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  read: boolean | null;
  createdAt: Date;
}

interface AdminDashboardProps {
  user: { id: number; email: string };
  stats: DashboardStats;
  recentProjects: RecentProject[];
  recentMessages: RecentMessage[];
}

export function AdminDashboard({ user, stats, recentProjects, recentMessages }: AdminDashboardProps) {
  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AdminSidebar />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-xl">Dashboard</h1>
            <p className="text-neutral-600 text-sm">Welcome back, {user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 text-neutral-500 hover:text-white text-sm border border-white/10 px-4 py-2 rounded-lg hover:border-white/20 transition-all duration-200"
            >
              <Eye size={14} />
              View Site
            </Link>
            <Link
              href="/admin/projects/new"
              className="flex items-center gap-2 bg-white text-black text-sm font-bold px-4 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <Plus size={14} />
              New Project
            </Link>
          </div>
        </div>

        <div className="p-8">
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Projects", value: stats.totalProjects, sub: `${stats.publishedProjects} published` },
              { label: "Categories", value: stats.totalCategories, sub: "Active" },
              { label: "Messages", value: stats.totalMessages, sub: `${stats.unreadMessages} unread` },
              { label: "Unread", value: stats.unreadMessages, sub: "Needs attention" },
            ].map(({ label, value, sub }) => (
              <div key={label} className="bg-neutral-900 rounded-xl p-5 border border-white/5">
                <p className="text-neutral-600 text-xs tracking-widest uppercase font-medium mb-3">
                  {label}
                </p>
                <p className="text-white text-3xl font-black">{value}</p>
                <p className="text-neutral-600 text-xs mt-1">{sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent projects */}
            <div className="bg-neutral-900 rounded-xl border border-white/5">
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-white font-bold text-sm">Recent Projects</h2>
                <Link href="/admin/projects" className="text-neutral-500 hover:text-white text-xs transition-colors">
                  View all →
                </Link>
              </div>
              <div className="divide-y divide-white/5">
                {recentProjects.map((project) => (
                  <div key={project.id} className="p-4 flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-medium truncate">{project.title}</p>
                      <p className="text-neutral-600 text-xs mt-0.5">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          project.status === "published"
                            ? "bg-green-500/10 text-green-400"
                            : project.status === "draft"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-neutral-800 text-neutral-500"
                        }`}
                      >
                        {project.status}
                      </span>
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-neutral-600 hover:text-white text-xs transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
                {recentProjects.length === 0 && (
                  <p className="p-6 text-center text-neutral-700 text-sm">No projects yet</p>
                )}
              </div>
            </div>

            {/* Recent messages */}
            <div className="bg-neutral-900 rounded-xl border border-white/5">
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-white font-bold text-sm">Recent Messages</h2>
                <Link href="/admin/messages" className="text-neutral-500 hover:text-white text-xs transition-colors">
                  View all →
                </Link>
              </div>
              <div className="divide-y divide-white/5">
                {recentMessages.map((msg) => (
                  <div key={msg.id} className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {!msg.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                          )}
                          <p className="text-white text-sm font-medium truncate">{msg.name}</p>
                        </div>
                        <p className="text-neutral-600 text-xs mt-0.5 truncate">{msg.email}</p>
                        {msg.subject && (
                          <p className="text-neutral-500 text-xs mt-1 truncate">{msg.subject}</p>
                        )}
                      </div>
                      <p className="text-neutral-700 text-xs shrink-0">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {recentMessages.length === 0 && (
                  <p className="p-6 text-center text-neutral-700 text-sm">No messages yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "New Project", href: "/admin/projects/new", icon: Plus },
              { label: "View Projects", href: "/admin/projects", icon: FileVideo },
              { label: "Messages", href: "/admin/messages", icon: MessageSquare },
              { label: "Settings", href: "/admin/settings", icon: Settings },
            ].map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-2 p-4 bg-neutral-900 hover:bg-neutral-800 border border-white/5 rounded-xl text-center transition-all duration-200 group"
              >
                <Icon size={20} className="text-neutral-500 group-hover:text-white transition-colors" />
                <span className="text-neutral-400 group-hover:text-white text-xs font-medium transition-colors">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
