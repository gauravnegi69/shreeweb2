'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Send, Check } from 'lucide-react';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#e0f2fe] text-slate-800 flex flex-col font-sans relative overflow-x-hidden p-6 md:p-12 justify-center">
      {/* Background Graphic elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-200/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md mx-auto w-full z-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Storefront
        </Link>

        <div className="glass-card rounded-3xl p-8 border border-white/40 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600">
              <Mail className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Contact Support</h1>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                <Check className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 mb-1">Message Sent!</h2>
              <p className="text-xs text-slate-500">Thank you. Our customer support team will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs md:text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-sky-200 rounded-xl focus:border-sky-500 outline-none text-slate-800 transition-all text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-sky-200 rounded-xl focus:border-sky-500 outline-none text-slate-800 transition-all text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-700">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your query here..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-sky-200 rounded-xl focus:border-sky-500 outline-none text-slate-800 transition-all text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-sky-500/10 hover:opacity-95 active:scale-98 transition-all mt-2"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
