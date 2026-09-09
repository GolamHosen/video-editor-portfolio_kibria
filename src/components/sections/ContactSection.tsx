"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SlideUp, Reveal, FadeIn } from "@/components/animation";
import { ContactForm } from "@/components/contact/ContactForm";

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Form slide-in from right
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { x: 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: formRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Info blocks stagger
      const infos = sectionRef.current!.querySelectorAll(".contact-info-block");
      infos.forEach((info, i) => {
        gsap.fromTo(
          info,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: info,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" data-section="contact" ref={sectionRef} className="relative bg-[#0a0a0a]">
      <div className="py-24 md:py-32 max-w-7xl mx-auto px-6">
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

            <div className="space-y-6">
              <div className="contact-info-block border-l border-white/10 pl-5">
                <p className="text-neutral-600 text-xs tracking-widest uppercase mb-1">Email</p>
                <a
                  href="mailto:hello@visualcraft.com"
                  className="text-white hover:text-neutral-200 transition-colors font-medium"
                >
                  hello@visualcraft.com
                </a>
              </div>
              <div className="contact-info-block border-l border-white/10 pl-5">
                <p className="text-neutral-600 text-xs tracking-widest uppercase mb-1">Availability</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-white font-medium text-sm">Available for new projects</span>
                </div>
              </div>
              <div className="contact-info-block border-l border-white/10 pl-5">
                <p className="text-neutral-600 text-xs tracking-widest uppercase mb-1">Response Time</p>
                <p className="text-white font-medium text-sm">Within 24 hours</p>
              </div>
              <div className="contact-info-block border-l border-white/10 pl-5">
                <p className="text-neutral-600 text-xs tracking-widest uppercase mb-1">Timezone</p>
                <p className="text-white font-medium text-sm">GMT / EST / PST — Flexible</p>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div ref={formRef} className="bg-neutral-900/40 border border-white/5 p-8 md:p-10 rounded-3xl">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
