"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export function LoginForm() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed. Please check your credentials.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("An unexpected network error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-white/30 transition-colors duration-200";

  if (!mounted) {
    return (
      <div className="bg-neutral-900 rounded-2xl p-8 border border-white/5 animate-pulse min-h-[380px]">
        <div className="h-6 w-24 bg-white/10 rounded-lg mb-6" />
        <div className="space-y-4">
          <div>
            <div className="h-3 w-12 bg-white/5 rounded mb-2" />
            <div className="h-12 bg-white/5 rounded-xl border border-white/5" />
          </div>
          <div>
            <div className="h-3 w-16 bg-white/5 rounded mb-2" />
            <div className="h-12 bg-white/5 rounded-xl border border-white/5" />
          </div>
          <div className="h-12 bg-white/10 rounded-xl mt-2" />
        </div>
        <div className="h-4 w-28 bg-white/5 rounded mx-auto mt-6" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-neutral-900 rounded-2xl p-8 border border-white/5"
      suppressHydrationWarning
    >
      <h1 className="text-white font-bold text-xl mb-6">Sign In</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-5 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm leading-relaxed">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs text-neutral-500 mb-2 tracking-wide uppercase">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="kibria1625@gmail.com"
            className={inputClasses}
            suppressHydrationWarning
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs text-neutral-500 mb-2 tracking-wide uppercase">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`${inputClasses} pr-12`}
              suppressHydrationWarning
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
              suppressHydrationWarning
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-bold text-sm px-6 py-4 rounded-xl hover:bg-neutral-100 disabled:opacity-50 transition-all duration-200 mt-2"
          suppressHydrationWarning
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </div>

      <p className="text-center mt-6">
        <a href="/" className="text-neutral-600 hover:text-neutral-400 text-xs transition-colors">
          ← Back to website
        </a>
      </p>
    </form>
  );
}
