import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login | VisualCraft",
  robots: { index: false },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="text-white font-bold text-2xl tracking-tight mb-2">
            <span>Personal</span>
            <span className="text-neutral-500">Portfolio</span>
          </div>
          <p className="text-neutral-600 text-sm">Admin Dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
