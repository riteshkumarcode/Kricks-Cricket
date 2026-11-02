import React from "react";
import { notFound } from "next/navigation";
import { getCmsPageBySlug, getCmsPages } from "@/lib/cms-store";
import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  const pages = getCmsPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: PageProps) {
  const page = getCmsPageBySlug(params.slug);
  if (!page) return { title: "Page Not Found · Krickscricket" };

  return {
    title: `${page.title} · Krickscricket`,
    description: page.subtitle || "Handcrafted English and Kashmir willow cricket bats.",
  };
}

export default function DynamicCmsPage({ params }: PageProps) {
  const page = getCmsPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F4F3F0] text-ink py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase font-display tracking-widest text-ink-muted hover:text-ink mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Workshop</span>
        </Link>

        <header className="border-b border-[#E6E3DE] pb-8 mb-8">
          <span className="text-xs uppercase font-display tracking-widest text-accent block mb-2">
            Workshop Information & Policies
          </span>
          <h1 className="font-display text-4xl md:text-5xl uppercase tracking-wider text-ink leading-tight">
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="text-base text-ink-muted mt-2 font-body font-medium">
              {page.subtitle}
            </p>
          )}
        </header>

        <div className="bg-white border border-[#E6E3DE] p-6 md:p-10 space-y-8">
          <div className="prose prose-neutral max-w-none font-body text-ink leading-relaxed whitespace-pre-line text-sm md:text-base">
            {page.content}
          </div>

          {page.faqs && page.faqs.length > 0 && (
            <div className="pt-8 border-t border-[#E6E3DE] space-y-4">
              <h3 className="font-display text-2xl uppercase tracking-wider text-ink flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-accent" />
                <span>Frequently Asked Questions</span>
              </h3>

              <div className="space-y-3">
                {page.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#F4F3F0] border border-[#E6E3DE] space-y-1.5"
                  >
                    <h4 className="font-display text-lg uppercase tracking-wider text-ink">
                      {faq.q}
                    </h4>
                    <p className="text-xs md:text-sm text-ink-muted">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

