import type { Metadata } from "next";
import { PageTransition, SlideUp, Reveal, FadeIn } from "@/components/animation";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch to start a project. I work with brands, agencies, and creators worldwide on video editing, motion graphics, and design.",
};

export default function ContactPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0a0a0a]">
        <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left - Info */}
            <div>
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-3">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                  <span className="text-rose-400/90 text-xs tracking-[0.25em] uppercase font-semibold font-mono">
                    GET IN TOUCH
                  </span>
                </div>
              </FadeIn>
              <SlideUp delay={0.1}>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mt-1 leading-[0.95] mb-6">
                  Contact Me
                  <span className="block text-xl md:text-3xl font-normal text-neutral-400 mt-3 font-sans">
                    Let&apos;s Work Together
                  </span>
                </h1>
              </SlideUp>
              <SlideUp delay={0.2}>
                <p className="text-neutral-500 text-base leading-relaxed mb-10 max-w-md">
                  Have a project in mind? I&apos;d love to hear about it. Fill in the form and
                  I&apos;ll be in touch within 24 hours.
                </p>
              </SlideUp>

              <FadeIn delay={0.3}>
                <div className="space-y-6">
                  <div className="border-l border-white/10 pl-5">
                    <p className="text-neutral-600 text-xs tracking-widest uppercase mb-1">Email</p>
                    <a
                      href="mailto:hello@visualcraft.com"
                      className="text-white hover:text-neutral-200 transition-colors font-medium"
                    >
                      hello@visualcraft.com
                    </a>
                  </div>
                  <div className="border-l border-white/10 pl-5">
                    <p className="text-neutral-600 text-xs tracking-widest uppercase mb-1">Availability</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-white font-medium text-sm">Available for new projects</span>
                    </div>
                  </div>
                  <div className="border-l border-white/10 pl-5">
                    <p className="text-neutral-600 text-xs tracking-widest uppercase mb-1">Response Time</p>
                    <p className="text-white font-medium text-sm">Within 24 hours</p>
                  </div>
                  <div className="border-l border-white/10 pl-5">
                    <p className="text-neutral-600 text-xs tracking-widest uppercase mb-1">Timezone</p>
                    <p className="text-white font-medium text-sm">GMT / EST / PST — Flexible</p>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right - Form */}
            <div className="bg-neutral-900/40 border border-white/5 p-8 md:p-10 rounded-3xl">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
