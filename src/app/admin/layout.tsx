import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin | VisualCraft",
    template: "%s | Admin — VisualCraft",
  },
  robots: { index: false },
};

// Admin pages use their own full-screen layout, without the public navbar/footer
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950">
      {children}
    </div>
  );
}
