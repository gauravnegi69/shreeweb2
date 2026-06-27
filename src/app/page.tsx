'use client';

import React, { useState, useEffect } from 'react';
import { Search, Star, Shield, ArrowDownToLine, Rocket, Cookie, AlertCircle, Frown } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
};

interface AppDetail {
  id: string;
  name: string;
  slug: string;
  logo: string;
  rating: number;
  downloads: string;
  status: 'active' | 'inactive';
  verified: boolean;
  downloadUrl: string;
  description?: string;
}

interface SiteSettings {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  footerText: string;
  disclaimer: string;
}

export default function Storefront() {
  const [apps, setApps] = useState<AppDetail[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCookies, setShowCookies] = useState(false);

  useEffect(() => {
    // Check cookie consent
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowCookies(true);
    }

    // Fetch public apps and settings
    Promise.all([
      fetch('/api/apps').then((res) => res.json()),
      fetch('/api/settings').then((res) => res.json())
    ])
      .then(([appsRes, settingsRes]) => {
        if (appsRes.success) {
          setApps(appsRes.data.filter((app: AppDetail) => app.status === 'active'));
        }
        if (settingsRes.success) {
          setSettings(settingsRes.data);
        }
      })
      .catch((error) => console.error('Failed to load portal data:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleCookieAccept = (accepted: boolean) => {
    localStorage.setItem('cookie-consent', accepted ? 'accepted' : 'rejected');
    setShowCookies(false);
  };

  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--bg-dark-900)] text-[var(--text-primary)] flex flex-col font-sans relative overflow-x-hidden selection:bg-sky-500 selection:text-white">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-200/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[55%] h-[55%] bg-indigo-200/40 rounded-full blur-[130px] pointer-events-none" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-sky-100/70 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-800 hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              {settings?.siteName || 'Earn Daily'}
            </span>
          </Link>
          <div className="w-9" /> {/* Spacer */}
        </div>
      </nav>

      {/* Title Header Section (1-line compact title) */}
      <header className="relative max-w-4xl mx-auto text-center px-4 pt-6 pb-1">
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-800">
          {settings?.siteTitle || 'Premium App Store – Discover & Download Apps'}
        </h1>
      </header>

      {/* Search Bar Section */}
      <section className="max-w-md mx-auto w-full px-4 mt-6 mb-6">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-indigo-400 rounded-xl opacity-20 group-hover:opacity-35 blur-sm transition-all duration-300" />
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-5 h-5 text-slate-400 group-focus-within:text-sky-600 transition-colors" />
            <input
              type="text"
              placeholder="Search games, utilities, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-sky-200/80 rounded-xl focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 outline-none text-slate-800 transition-all text-sm shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Main Apps Grid Container */}
      <main className="max-w-6xl mx-auto px-4 flex-1 w-full pb-20">
        <div className="mb-4">
          <h2 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Featured Applications</h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="glass-card rounded-2xl p-4 flex flex-col gap-4 animate-pulse">
                <div className="w-16 h-16 bg-sky-100 rounded-2xl mx-auto" />
                <div className="h-4 bg-sky-100 rounded w-3/4 mx-auto" />
                <div className="h-3 bg-sky-100 rounded w-1/2 mx-auto" />
                <div className="h-10 bg-sky-100 rounded-xl mt-2" />
              </div>
            ))}
          </div>
        ) : filteredApps.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredApps.map((app) => (
              <motion.div
                key={app.id}
                variants={itemVariants}
                className="group relative glass-card rounded-2xl p-4 flex flex-col items-center justify-between text-center overflow-hidden"
              >
                {/* Accent neon stripe at card top */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-sky-300/0 via-sky-500/40 to-indigo-350/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="w-full flex flex-col items-center">
                  {/* App Logo Wrapper */}
                  <div className="relative mb-4 w-20 h-20 rounded-2xl overflow-hidden bg-sky-50 border border-sky-100 p-0.5 shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={app.logo}
                      alt={app.name}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=150';
                      }}
                    />
                  </div>

                  {/* App details info */}
                  <h3 className="font-semibold text-slate-800 group-hover:text-sky-600 transition-colors text-base line-clamp-1 mb-1 px-1">
                    {app.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs mb-4">
                    <div className="flex items-center text-neon-gold gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-medium">{app.rating}</span>
                    </div>
                    <span className="text-slate-300">•</span>
                    {app.verified ? (
                      <div className="flex items-center text-emerald-600 bg-emerald-500/10 border border-emerald-500/10 px-1.5 py-0.5 rounded gap-0.5 font-medium">
                        <Shield className="w-3 h-3 fill-current opacity-85" />
                        <span>Verified</span>
                      </div>
                    ) : (
                      <span className="text-slate-500">{app.downloads} downloads</span>
                    )}
                  </div>
                </div>

                {/* Actions Button */}
                <Link
                  href={`/download/${app.slug}`}
                  className="w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 btn-premium"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  <span>Download</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto flex flex-col items-center border border-sky-100">
            <Frown className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No Matches Found</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Try searching for a different keyword, app, or utility game name.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-sky-100/80 bg-white/40 py-12 text-center text-xs text-slate-500 mt-auto relative z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col gap-6">
          <div className="flex flex-wrap justify-center gap-6 text-slate-600 font-medium">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <span className="text-slate-300">|</span>
            <Link href="/privacy-policy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <span className="text-slate-300">|</span>
            <Link href="/terms-of-service" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            <span className="text-slate-300">|</span>
            <Link href="/contact-us" className="hover:text-slate-900 transition-colors">Contact Us</Link>
          </div>
          <p className="max-w-2xl mx-auto leading-relaxed text-[11px] text-slate-400 leading-relaxed">
            {settings?.disclaimer || 'Disclaimer: This website is not part of the Facebook website or Meta Platforms, Inc. Additionally, this site is NOT endorsed by Facebook in any way.'}
          </p>
          <div className="w-12 h-[1px] bg-sky-200/50 mx-auto" />
          <p className="text-slate-500">
            {settings?.footerText || '© 2026 Earn Daily. All rights reserved.'}
          </p>
        </div>
      </footer>

      {/* Cookie Banner */}
      {showCookies && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slideUp">
          <div className="max-w-4xl mx-auto bg-white/95 border border-sky-150 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
                <Cookie className="w-5 h-5 text-sky-600" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                We use cookies to improve your experience, personalize content, and analyze our traffic. By clicking &quot;Accept&quot;, you agree to our privacy policy.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end shrink-0">
              <button
                onClick={() => handleCookieAccept(false)}
                className="w-1/2 sm:w-auto px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 border border-sky-200 rounded-xl transition-all"
              >
                Reject
              </button>
              <button
                onClick={() => handleCookieAccept(true)}
                className="w-1/2 sm:w-auto px-5 py-2 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-xl shadow-lg shadow-sky-500/10 transition-all"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
