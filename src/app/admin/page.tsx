'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Settings, Lock, Eye, LogOut, Loader2, ArrowLeft, Shield, Check, X, AlertTriangle, Star } from 'lucide-react';
import Link from 'next/link';

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
  telegramLink?: string;
  whatsappLink?: string;
  chatLink?: string;
}

interface SiteSettings {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  adminEmail: string;
  adminPassword?: string;
  footerText: string;
  telegramLink: string;
  whatsappLink: string;
  chatLink: string;
  disclaimer: string;
}

export default function AdminDashboard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apps, setApps] = useState<AppDetail[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'apps' | 'settings'>('apps');

  // Modal states for App Edit/Create
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppDetail | null>(null); // null means adding a new app
  const [appForm, setAppForm] = useState({
    name: '',
    logo: '',
    rating: '4.9',
    downloads: '100K+',
    status: 'active' as 'active' | 'inactive',
    verified: true,
    downloadUrl: '',
    description: '',
    telegramLink: '',
    whatsappLink: '',
    chatLink: ''
  });

  // Settings form binding
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({
    siteName: '',
    siteTitle: '',
    siteDescription: '',
    adminEmail: '',
    adminPassword: '',
    footerText: '',
    telegramLink: '',
    whatsappLink: '',
    chatLink: '',
    disclaimer: ''
  });

  useEffect(() => {
    // Check if token is saved in session storage
    const savedToken = sessionStorage.getItem('admin-token');
    if (savedToken) {
      loadDataWithToken(savedToken);
    }
  }, []);

  const loadDataWithToken = async (authToken: string) => {
    setLoading(true);
    setError('');
    try {
      // Fetch settings with token in Authorization header
      const settingsRes = await fetch('/api/settings', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const settingsData = await settingsRes.json();

      if (!settingsData.success) {
        setError('Invalid session. Please login again.');
        sessionStorage.removeItem('admin-token');
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setSettings(settingsData.data);
      setSettingsForm(settingsData.data);
      sessionStorage.setItem('admin-token', authToken);
      setToken(authToken);
      setIsAuthenticated(true);

      // Load apps list
      const appsRes = await fetch('/api/apps');
      const appsData = await appsRes.json();
      if (appsData.success) {
        setApps(appsData.data);
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.token) {
        loadDataWithToken(data.token);
      } else {
        setError(data.error || 'Authentication failed');
        setLoading(false);
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin-token');
    setEmail('');
    setPassword('');
    setToken('');
    setIsAuthenticated(false);
    setApps([]);
    setSettings(null);
  };

  const handleAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const url = editingApp ? `/api/apps/${editingApp.id}` : '/api/apps';
      const method = editingApp ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(appForm)
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(editingApp ? 'App updated successfully!' : 'New app added successfully!');
        setIsAppModalOpen(false);
        // Refresh apps list
        const appsRes = await fetch('/api/apps');
        const appsData = await appsRes.json();
        if (appsData.success) {
          setApps(appsData.data);
        }
      } else {
        setError(data.error || 'Failed to save app');
      }
    } catch (err) {
      setError('Network request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAppClick = (app: AppDetail) => {
    setEditingApp(app);
    setAppForm({
      name: app.name,
      logo: app.logo,
      rating: String(app.rating),
      downloads: app.downloads,
      status: app.status,
      verified: app.verified,
      downloadUrl: app.downloadUrl,
      description: app.description || '',
      telegramLink: app.telegramLink || '',
      whatsappLink: app.whatsappLink || '',
      chatLink: app.chatLink || ''
    });
    setIsAppModalOpen(true);
  };

  const handleAddAppClick = () => {
    setEditingApp(null);
    setAppForm({
      name: '',
      logo: '',
      rating: '4.9',
      downloads: '100K+',
      status: 'active',
      verified: true,
      downloadUrl: '',
      description: '',
      telegramLink: '',
      whatsappLink: '',
      chatLink: ''
    });
    setIsAppModalOpen(true);
  };

  const handleDeleteAppClick = async (appId: string) => {
    if (!confirm('Are you sure you want to delete this app?')) return;
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`/api/apps/${appId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (data.success) {
        setSuccess('App deleted successfully!');
        setApps(apps.filter((a) => a.id !== appId));
      } else {
        setError(data.error || 'Failed to delete app');
      }
    } catch (err) {
      setError('Network request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settingsForm)
      });
      const data = await res.json();

      if (data.success) {
        setSuccess('Settings updated successfully! Note your new password if you changed it.');
        setSettings(data.data);
        // Clear password input field value in settings form
        setSettingsForm(prev => ({ ...prev, adminPassword: '' }));
      } else {
        setError(data.error || 'Failed to update settings');
      }
    } catch (err) {
      setError('Network request failed');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // RENDER: Login Overlay if not Authenticated
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-space-900 flex flex-col items-center justify-center p-4 font-sans text-slate-100 relative admin-theme">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-900/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-sm glass-card rounded-3xl p-8 relative overflow-hidden border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-teal rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-neon-blue/20">
              <Lock className="w-6 h-6 text-space-900" />
            </div>
            <h2 className="text-2xl font-black text-white">Admin Access</h2>
            <p className="text-xs text-slate-400 mt-1">Enter your email & password credentials to login</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Admin Email</label>
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 bg-space-800 border border-white/10 rounded-xl focus:border-neon-teal focus:ring-1 focus:ring-neon-teal/20 outline-none text-white text-sm"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 bg-space-800 border border-white/10 rounded-xl focus:border-neon-teal focus:ring-1 focus:ring-neon-teal/20 outline-none text-white text-sm"
              />
            </div>

            {error && (
              <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-xl px-4 py-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-neon-blue to-neon-teal text-space-900 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-neon-blue/25 hover:opacity-95 active:scale-98 transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Authenticate'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Authorized Admin Panel Dashboard
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-space-900 text-slate-100 flex flex-col font-sans relative admin-theme">
      
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-space-850/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Storefront
            </Link>
            <div className="w-[1px] h-4 bg-white/5" />
            <h1 className="font-bold text-sm uppercase tracking-wider text-slate-200">
              {settings?.siteName || 'Earn Daily'} Admin Console
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors border border-rose-500/10 hover:border-rose-500/20 px-3 py-1.5 rounded-full"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full px-4 py-8 flex-1 flex flex-col gap-6">
        
        {/* Alerts for successes and errors */}
        {error && (
          <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-2xl px-5 py-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl px-5 py-4 flex items-center gap-2">
            <Check className="w-5 h-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Tab Toggle buttons */}
        <div className="flex gap-2 border-b border-white/5 pb-px">
          <button
            onClick={() => setActiveTab('apps')}
            className={`px-5 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'apps'
                ? 'border-neon-teal text-neon-teal'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Manage Apps
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'settings'
                ? 'border-neon-teal text-neon-teal'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Site Settings
          </button>
        </div>

        {/* APP MANAGEMENT TAB BODY */}
        {activeTab === 'apps' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">Manage all application download lobbies configured on your site</p>
              <button
                onClick={handleAddAppClick}
                className="px-4 py-2 bg-neon-teal hover:bg-neon-teal/95 text-space-900 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-neon-teal/10"
              >
                <Plus className="w-4 h-4" /> Add App
              </button>
            </div>

            {/* Apps Listing Table */}
            <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs min-w-[700px]">
                  <thead>
                    <tr className="bg-space-800 text-slate-400 border-b border-white/5">
                      <th className="p-4 font-bold uppercase tracking-wider">Logo & Name</th>
                      <th className="p-4 font-bold uppercase tracking-wider">Stats</th>
                      <th className="p-4 font-bold uppercase tracking-wider">Verification</th>
                      <th className="p-4 font-bold uppercase tracking-wider">Status</th>
                      <th className="p-4 font-bold text-right uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {apps.length > 0 ? (
                      apps.map((app) => (
                        <tr key={app.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-space-700 p-px border border-white/10 shrink-0">
                              <img src={app.logo} alt={app.name} className="w-full h-full object-cover rounded-lg" />
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm">{app.name}</p>
                              <p className="text-slate-500 text-[10px] truncate max-w-xs">{app.downloadUrl}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              <span className="flex items-center text-neon-gold"><Star className="w-3.5 h-3.5 fill-current mr-0.5" /> {app.rating}</span>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-400">{app.downloads} downloads</span>
                            </div>
                          </td>
                          <td className="p-4">
                            {app.verified ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <Shield className="w-3 h-3 fill-current" /> Verified APK
                              </span>
                            ) : (
                              <span className="text-slate-500">—</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${app.status === 'active' ? 'bg-emerald-500 shadow-md shadow-emerald-500/30' : 'bg-rose-500'}`} />
                            <span className={`font-semibold capitalize ${app.status === 'active' ? 'text-slate-200' : 'text-slate-500'}`}>{app.status}</span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2.5">
                              <Link
                                href={`/download/${app.slug}`}
                                target="_blank"
                                className="w-8 h-8 rounded-lg border border-white/5 bg-space-850 hover:bg-space-750 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                                title="Preview lander"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleEditAppClick(app)}
                                className="w-8 h-8 rounded-lg border border-white/5 bg-space-850 hover:bg-space-750 flex items-center justify-center text-slate-400 hover:text-neon-cyan transition-colors"
                                title="Edit app"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAppClick(app.id)}
                                className="w-8 h-8 rounded-lg border border-white/5 bg-space-850 hover:bg-space-750 flex items-center justify-center text-slate-400 hover:text-rose-400 transition-colors"
                                title="Delete app"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                          No applications configured yet. Click &quot;Add App&quot; to configure one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS MANAGEMENT TAB BODY */}
        {activeTab === 'settings' && (
          <div className="glass-panel border border-white/5 rounded-3xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
              <Settings className="w-5 h-5 text-neon-teal" /> Site Configuration Parameters
            </h3>

            <form onSubmit={handleSettingsSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Site Display Name</label>
                <input
                  type="text"
                  value={settingsForm.siteName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-space-800 border border-white/10 rounded-xl focus:border-neon-teal outline-none text-white text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Admin Email</label>
                <input
                  type="email"
                  value={settingsForm.adminEmail}
                  onChange={(e) => setSettingsForm({ ...settingsForm, adminEmail: e.target.value })}
                  className="w-full px-4 py-2.5 bg-space-800 border border-white/10 rounded-xl focus:border-neon-teal outline-none text-white text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Change Admin Password</label>
                <input
                  type="password"
                  placeholder="Leave blank to keep current password"
                  value={settingsForm.adminPassword || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, adminPassword: e.target.value })}
                  className="w-full px-4 py-2.5 bg-space-800 border border-white/10 rounded-xl focus:border-neon-teal outline-none text-white text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Site Header/Title</label>
                <input
                  type="text"
                  value={settingsForm.siteTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-space-800 border border-white/10 rounded-xl focus:border-neon-teal outline-none text-white text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Site Subtitle/Description</label>
                <textarea
                  rows={2}
                  value={settingsForm.siteDescription}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siteDescription: e.target.value })}
                  className="w-full px-4 py-2.5 bg-space-800 border border-white/10 rounded-xl focus:border-neon-teal outline-none text-white text-xs leading-relaxed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Telegram Channel Link</label>
                <input
                  type="text"
                  value={settingsForm.telegramLink}
                  onChange={(e) => setSettingsForm({ ...settingsForm, telegramLink: e.target.value })}
                  className="w-full px-4 py-2.5 bg-space-800 border border-white/10 rounded-xl focus:border-neon-teal outline-none text-white text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">WhatsApp Link</label>
                <input
                  type="text"
                  value={settingsForm.whatsappLink}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappLink: e.target.value })}
                  className="w-full px-4 py-2.5 bg-space-800 border border-white/10 rounded-xl focus:border-neon-teal outline-none text-white text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Live Support Chat Link</label>
                <input
                  type="text"
                  value={settingsForm.chatLink}
                  onChange={(e) => setSettingsForm({ ...settingsForm, chatLink: e.target.value })}
                  className="w-full px-4 py-2.5 bg-space-800 border border-white/10 rounded-xl focus:border-neon-teal outline-none text-white text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Footer Text</label>
                <input
                  type="text"
                  value={settingsForm.footerText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, footerText: e.target.value })}
                  className="w-full px-4 py-2.5 bg-space-800 border border-white/10 rounded-xl focus:border-neon-teal outline-none text-white text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Footer Disclaimer Notice (e.g. Meta Ads compliance)</label>
                <textarea
                  rows={3}
                  value={settingsForm.disclaimer}
                  onChange={(e) => setSettingsForm({ ...settingsForm, disclaimer: e.target.value })}
                  className="w-full px-4 py-2.5 bg-space-800 border border-white/10 rounded-xl focus:border-neon-teal outline-none text-white text-xs leading-relaxed"
                />
              </div>

              <div className="md:col-span-2 border-t border-white/5 pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-neon-teal hover:bg-neon-teal/95 text-space-900 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-neon-teal/15 transition-all"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* -------------------------------------------------------------
      // APP CREATE/EDIT MODAL OVERLAY
      // ------------------------------------------------------------- */}
      {isAppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-space-850 border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-scaleUp max-h-[90vh] flex flex-col">
            <header className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-bold text-base text-white">
                {editingApp ? `Edit App: ${editingApp.name}` : 'Add New Premium App'}
              </h3>
              <button
                onClick={() => setIsAppModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            <form onSubmit={handleAppSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">App Name*</label>
                  <input
                    type="text"
                    required
                    value={appForm.name}
                    onChange={(e) => setAppForm({ ...appForm, name: e.target.value })}
                    className="w-full px-4 py-2 bg-space-800 border border-white/10 rounded-xl focus:border-neon-teal outline-none text-white text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Logo Image URL*</label>
                  <input
                    type="text"
                    required
                    value={appForm.logo}
                    onChange={(e) => setAppForm({ ...appForm, logo: e.target.value })}
                    className="w-full px-4 py-2 bg-space-800 border border-white/10 rounded-xl focus:border-neon-teal outline-none text-white text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Star Rating*</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    required
                    value={appForm.rating}
                    onChange={(e) => setAppForm({ ...appForm, rating: e.target.value })}
                    className="w-full px-4 py-2 bg-space-800 border border-white/10 rounded-xl focus:border-neon-teal outline-none text-white text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Download Counter*</label>
                  <input
                    type="text"
                    required
                    value={appForm.downloads}
                    onChange={(e) => setAppForm({ ...appForm, downloads: e.target.value })}
                    className="w-full px-4 py-2 bg-space-800 border border-white/10 rounded-xl focus:border-neon-teal outline-none text-white text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-300">Download APK link / redirect URL*</label>
                  <input
                    type="url"
                    required
                    value={appForm.downloadUrl}
                    onChange={(e) => setAppForm({ ...appForm, downloadUrl: e.target.value })}
                    className="w-full px-4 py-2 bg-space-800 border border-white/10 rounded-xl focus:border-neon-teal outline-none text-white text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-300">App Description</label>
                  <textarea
                    rows={3}
                    value={appForm.description}
                    onChange={(e) => setAppForm({ ...appForm, description: e.target.value })}
                    className="w-full px-4 py-2 bg-space-800 border border-white/10 rounded-xl focus:border-neon-teal outline-none text-white text-xs leading-relaxed"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Status</label>
                  <select
                    value={appForm.status}
                    onChange={(e) => setAppForm({ ...appForm, status: e.target.value as any })}
                    className="w-full px-4 py-2 bg-space-800 border border-white/10 rounded-xl focus:border-neon-teal outline-none text-white text-xs"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="verifiedCheckbox"
                    checked={appForm.verified}
                    onChange={(e) => setAppForm({ ...appForm, verified: e.target.checked })}
                    className="w-4 h-4 text-neon-teal bg-space-800 border-white/10 rounded focus:ring-neon-teal"
                  />
                  <label htmlFor="verifiedCheckbox" className="text-xs font-semibold text-slate-300 cursor-pointer">
                    Show Verified Badge
                  </label>
                </div>

                <div className="md:col-span-2 border-t border-white/5 pt-3 my-2">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">App-Specific Support overrides (Optional)</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400">Telegram Channel Link Override</label>
                  <input
                    type="text"
                    value={appForm.telegramLink}
                    onChange={(e) => setAppForm({ ...appForm, telegramLink: e.target.value })}
                    className="w-full px-4 py-2 bg-space-800 border border-white/10 rounded-xl focus:border-neon-teal outline-none text-white text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400">WhatsApp Link Override</label>
                  <input
                    type="text"
                    value={appForm.whatsappLink}
                    onChange={(e) => setAppForm({ ...appForm, whatsappLink: e.target.value })}
                    className="w-full px-4 py-2 bg-space-800 border border-white/10 rounded-xl focus:border-neon-teal outline-none text-white text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-400">Live Support Chat Link Override</label>
                  <input
                    type="text"
                    value={appForm.chatLink}
                    onChange={(e) => setAppForm({ ...appForm, chatLink: e.target.value })}
                    className="w-full px-4 py-2 bg-space-800 border border-white/10 rounded-xl focus:border-neon-teal outline-none text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-white/5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAppModalOpen(false)}
                  className="px-5 py-2.5 border border-white/10 hover:text-white rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-neon-teal hover:bg-neon-teal/95 text-space-900 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-neon-teal/15"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
