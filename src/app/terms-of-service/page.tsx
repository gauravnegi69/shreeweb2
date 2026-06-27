import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#e0f2fe] text-slate-800 flex flex-col font-sans relative overflow-x-hidden p-6 md:p-12">
      {/* Background Graphic elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-200/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto w-full z-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Storefront
        </Link>

        <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/40 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Terms of Service</h1>
          </div>

          <div className="prose prose-slate max-w-none text-xs md:text-sm text-slate-600 leading-relaxed flex flex-col gap-6">
            <p>
              Last Updated: June 2026. Please read these Terms of Service carefully before using the Earn Daily website operated by us.
            </p>

            <h2 className="text-base font-bold text-slate-800 mt-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the website, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the website.
            </p>

            <h2 className="text-base font-bold text-slate-800 mt-4">2. User Agreement & Usage</h2>
            <p>
              All software, casual games, and utility tools listed here are distributed for personal, offline entertainment and device organization. You agree not to use the utilities for any illegal purposes or violate local software licensing rules.
            </p>

            <h2 className="text-base font-bold text-slate-800 mt-4">3. Links To Other Web Sites</h2>
            <p>
              Our website may contain links to third-party web sites or services that are not owned or controlled by Earn Daily. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites.
            </p>

            <h2 className="text-base font-bold text-slate-800 mt-4">4. Limitation of Liability</h2>
            <p>
              In no event shall Earn Daily, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the website.
            </p>

            <h2 className="text-base font-bold text-slate-800 mt-4">5. Disclaimer</h2>
            <p>
              Your use of the website is at your sole risk. The service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. The service is provided without warranties of any kind.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
