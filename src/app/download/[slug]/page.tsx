'use client';

import React, { useState, useEffect } from 'react';
import { Star, Shield, MessageCircle, Send, HelpCircle, ArrowDownToLine, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface AppDetail {
  id: string;
  name: string;
  slug: string;
  logo: string;
  rating: number;
  downloads: string;
  downloadUrl: string;
  description?: string;
  telegramLink?: string;
  whatsappLink?: string;
  chatLink?: string;
}

interface SiteSettings {
  siteName: string;
  telegramLink: string;
  whatsappLink: string;
  chatLink: string;
}

export default function DownloadPage({ params }: { params: { slug: string } }) {
  const [app, setApp] = useState<AppDetail | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Fetch apps & settings
    Promise.all([
      fetch('/api/apps').then((res) => res.json()),
      fetch('/api/settings').then((res) => res.json())
    ])
      .then(([appsRes, settingsRes]) => {
        if (appsRes.success) {
          const found = appsRes.data.find((a: AppDetail) => a.slug === params.slug);
          setApp(found || null);
        }
        if (settingsRes.success) {
          setSettings(settingsRes.data);
        }
      })
      .catch((error) => console.error('Failed to load data:', error))
      .finally(() => setLoading(false));
  }, [params.slug]);

  const handleDownloadClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (downloading) return;
    setDownloading(true);
    // Simulate delay for premium feel
    setTimeout(() => {
      setDownloading(false);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sky-50 text-slate-800 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-sky-600 animate-spin mb-4" />
        <p className="text-sm text-slate-500">Loading premium lobby...</p>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-sky-50 text-slate-800 flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-slate-850 mb-2">Lobby Not Found</h2>
        <p className="text-slate-500 text-sm mb-6 max-w-sm">The application you are trying to download does not exist or has been removed.</p>
        <Link href="/" className="px-6 py-2.5 rounded-xl font-bold text-white bg-sky-500 hover:bg-sky-600 transition-all text-sm">
          Return to Storefront
        </Link>
      </div>
    );
  }

  // Resolve links (app-specific takes priority, falls back to global settings)
  const telegram = app.telegramLink || settings?.telegramLink || 'https://t.me/EarnDailyOfficial';
  const whatsapp = app.whatsappLink || settings?.whatsappLink || 'https://whatsapp.com/channel/0029VbCfPsoEarnDaily';
  const liveChat = app.chatLink || settings?.chatLink || 'https://www.earndailyhelp.com';

  return (
    <div className="min-h-screen bg-[var(--bg-dark-900)] text-slate-800 flex flex-col font-sans items-center justify-center p-4 relative overflow-x-hidden">
      {/* Background Graphic elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-200/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating social sidebar widget */}
      <div className="fixed right-3 top-1/4 z-50 flex flex-col gap-3">
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 flex items-center justify-center transition-all hover:scale-105">
          <MessageCircle className="w-6 h-6 text-white" />
        </a>
        <a href={telegram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-600/20 flex items-center justify-center transition-all hover:scale-105">
          <Send className="w-6 h-6 text-white" />
        </a>
        <a href={liveChat} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-600/20 flex items-center justify-center transition-all hover:scale-105">
          <HelpCircle className="w-6 h-6 text-white" />
        </a>
      </div>

      {/* Back button */}
      <div className="w-full max-w-md mb-4 z-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Storefront
        </Link>
      </div>

      {/* Main Single App Lander Card */}
      <div className="w-full max-w-md glass-card rounded-3xl p-8 relative overflow-hidden border border-white/40 shadow-2xl z-10 flex flex-col items-center text-center">
        
        {/* App Logo */}
        <div className="relative mb-5 w-24 h-24 rounded-3xl overflow-hidden bg-sky-50 border border-sky-100 p-0.5 shadow-sm">
          <img
            src={app.logo}
            alt={app.name}
            className="w-full h-full object-cover rounded-2xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=150';
            }}
          />
        </div>

        {/* App Name */}
        <h1 className="text-3xl font-black text-slate-800 leading-tight mb-2 flex items-center gap-2 justify-center">
          <span>{app.name}</span>
          {app.rating >= 4.8 && (
            <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 border border-sky-500/20">
              TOP
            </span>
          )}
        </h1>

        {/* Ratings & Verification */}
        <div className="flex items-center gap-2 text-xs mb-6 justify-center">
          <div className="flex items-center text-neon-gold gap-0.5 font-bold">
            <Star className="w-4 h-4 fill-current" />
            <span>{app.rating}</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center text-emerald-600 bg-emerald-500/10 border border-emerald-500/10 px-2 py-0.5 rounded-full gap-0.5 font-semibold">
            <Shield className="w-3.5 h-3.5 fill-current opacity-85" />
            <span>Verified Safe</span>
          </div>
        </div>

        {/* Compliance Badge - Positioned ABOVE the download button inside the card */}
        <div className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-[11px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest mb-3.5 shadow-md shadow-sky-500/10 animate-pulse-slow">
          ✓ 100% Free & Safe Download
        </div>

        {/* Download Button right below information */}
        <div className="w-full mb-6">
          <a
            href={app.downloadUrl}
            onClick={handleDownloadClick}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-white transition-all text-sm uppercase tracking-wide btn-premium cursor-pointer"
          >
            {downloading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Link...</span>
              </>
            ) : (
              <>
                <ArrowDownToLine className="w-5 h-5 stroke-[2.5]" />
                <span>Download APK Now</span>
              </>
            )}
          </a>
        </div>

        {/* Installs / Package details */}
        <div className="w-full flex justify-center gap-6 py-3 border-t border-b border-sky-100/50 mb-6 text-slate-600 text-xs">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Installs</p>
            <p className="font-bold text-slate-800 mt-0.5">{app.downloads}</p>
          </div>
          <div className="w-px h-6 bg-sky-200/50" />
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Size</p>
            <p className="font-bold text-slate-800 mt-0.5">48.2 MB</p>
          </div>
        </div>

        {/* Simplified Description */}
        <p className="text-xs text-slate-500 leading-relaxed">
          {app.description || `Welcome to ${app.name}! Experience high-performance features, smooth controls, and 100% verified safe downloads.`}
        </p>

      </div>
    </div>
  );
}
