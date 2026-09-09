"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";

const projectTypes = [
  "Video Editing",
  "Motion Graphics",
  "Graphic Design",
  "Branding",
  "Social Media Content",
  "Other",
];

const budgets = [
  "< $1,000",
  "$1,000 – $5,000",
  "$5,000 – $10,000",
  "$10,000 – $25,000",
  "$25,000+",
  "Let's discuss",
];

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    projectType: "",
    budget: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send message");
      } else {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "", projectType: "", budget: "" });
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full bg-neutral-900 border border-white/8 rounded-xl px-4 py-3.5 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-white/30 transition-colors duration-200";

  return (
    <AnimatePresence mode="wait">
      {success ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center text-center py-16 h-full"
        >
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h3 className="text-white font-black text-2xl mb-3">Message Sent!</h3>
          <p className="text-neutral-500 text-sm max-w-xs">
            Thank you for reaching out. I&apos;ll review your message and get back to you within
            24 hours.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-8 text-neutral-500 hover:text-white text-sm transition-colors duration-200"
          >
            Send another message
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="space-y-5"
          suppressHydrationWarning
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-xs text-neutral-500 mb-2 tracking-wide uppercase font-medium">
                Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className={inputClasses}
                suppressHydrationWarning
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs text-neutral-500 mb-2 tracking-wide uppercase font-medium">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={inputClasses}
                suppressHydrationWarning
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="projectType" className="block text-xs text-neutral-500 mb-2 tracking-wide uppercase font-medium">
                Project Type
              </label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className={`${inputClasses} appearance-none cursor-pointer`}
                suppressHydrationWarning
              >
                <option value="">Select type</option>
                {projectTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="budget" className="block text-xs text-neutral-500 mb-2 tracking-wide uppercase font-medium">
                Budget
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className={`${inputClasses} appearance-none cursor-pointer`}
                suppressHydrationWarning
              >
                <option value="">Select budget</option>
                {budgets.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-xs text-neutral-500 mb-2 tracking-wide uppercase font-medium">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What&apos;s this about?"
              className={inputClasses}
              suppressHydrationWarning
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-xs text-neutral-500 mb-2 tracking-wide uppercase font-medium">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your project..."
              className={`${inputClasses} resize-none`}
              suppressHydrationWarning
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-white text-black font-bold text-sm px-6 py-4 rounded-full hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02]"
            suppressHydrationWarning
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              <>
                Send Message
                <Send size={16} />
              </>
            )}
          </button>

          <p className="text-neutral-700 text-xs text-center">
            I typically respond within 24 hours on business days.
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
