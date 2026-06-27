import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicy() {
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
              <Shield className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
          </div>

          <div className="prose prose-slate max-w-none text-xs md:text-sm text-slate-600 leading-relaxed flex flex-col gap-6">
            <p>
              Last Updated: June 2026. Your privacy is important to us. It is Earn Daily\'s policy to respect your privacy regarding any information we may collect while operating our website.
            </p>

            <h2 className="text-base font-bold text-slate-800 mt-4">1. Information We Collect</h2>
            <p>
              We only collect information about you if we have a reason to do so—for example, to provide our services, to communicate with you, or to make our services better. We collect information in three ways: if you provide information to us, automatically through operating our services, and from third-party sources.
            </p>

            <h2 className="text-base font-bold text-slate-800 mt-4">2. Cookies and Tracking</h2>
            <p>
              We use &quot;cookies&quot; to collect information and help personalize your experience. A cookie is a small piece of data stored on your device that helps us recognize your browser and remember preferences. You can configure your browser to refuse cookies, though some features may not function optimally without them.
            </p>

            <h2 className="text-base font-bold text-slate-800 mt-4">3. Security</h2>
            <p>
              The security of your personal information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>

            <h2 className="text-base font-bold text-slate-800 mt-4">4. Compliance with Laws</h2>
            <p>
              We will disclose your personal information where required to do so by law or subpoena or if we believe that such action is necessary to comply with the law and the reasonable requests of law enforcement.
            </p>

            <h2 className="text-base font-bold text-slate-800 mt-4">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through our official support channel link on the home page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
