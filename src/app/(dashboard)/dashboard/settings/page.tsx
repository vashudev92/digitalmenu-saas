'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Settings, User, Lock, AlertTriangle, Loader2, CheckCircle, ShieldAlert } from 'lucide-react';

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  
  const [name, setName] = useState(session?.user?.name || '');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState('');

  // Reset state
  const [resetLoading, setResetLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // In a real app we'd trigger a user details PUT endpoint, we'll simulate success here
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    setMessage('Account settings updated!');
    await updateSession({ name });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setPassLoading(true);
    setPassMsg('');
    setError('');

    // Simulate change password
    await new Promise((resolve) => setTimeout(resolve, 800));
    setPassLoading(false);
    setPassMsg('Password successfully changed.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleResetData = async () => {
    if (!confirm('WARNING: This will permanently delete all your Categories and Menu Items. This action cannot be undone. Do you want to proceed?')) {
      return;
    }

    setResetLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/profile/reset', { method: 'POST' });
      if (!res.ok) throw new Error('Reset failed');
      
      alert('Your menu database has been completely reset.');
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Failed to reset database.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold flex items-center gap-2">
          <Settings className="w-8 h-8 text-[#D4A437]" /> Account Settings
        </h1>
        <p className="text-gray-400 text-sm mt-1">Manage user preferences, passwords, and database configurations.</p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm flex items-center gap-3">
          <CheckCircle className="w-5 h-5" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm flex items-center gap-3">
          <ShieldAlert className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Profile Card */}
        <div className="glass p-4 sm:p-6 md:p-8 rounded-3xl space-y-6">
          <h3 className="text-lg font-bold border-b border-gray-900 pb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-[#D4A437]" /> User Information
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full bg-[#050505] border border-gray-950 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed focus:outline-none"
              />
              <span className="text-[10px] text-gray-600 block mt-1">Email cannot be modified in the sandbox workspace.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4A437] to-[#B88E2F] hover:from-[#B88E2F] hover:to-[#A37B24] text-black font-bold text-sm transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save User Details'}
            </button>
          </form>
        </div>

        {/* Password Card */}
        <div className="glass p-4 sm:p-6 md:p-8 rounded-3xl space-y-6">
          <h3 className="text-lg font-bold border-b border-gray-900 pb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#D4A437]" /> Security settings
          </h3>

          {passMsg && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs">
              {passMsg}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={passLoading}
              className="w-full py-3.5 rounded-xl border border-gray-800 hover:border-[#D4A437] text-gray-300 hover:text-white font-bold text-sm transition-all"
            >
              {passLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Change Password'}
            </button>
          </form>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 sm:p-8 rounded-3xl border border-red-900/40 bg-red-950/5 space-y-6">
        <h3 className="text-lg font-bold border-b border-red-950/40 pb-3 text-red-400 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Danger Zone
        </h3>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h4 className="font-bold text-sm text-white">Reset Menu Database</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-md">
              Delete all items and categories currently set up for your restaurant profile. This operation is immediate and permanent.
            </p>
          </div>
          
          <button
            onClick={handleResetData}
            disabled={resetLoading}
            className="px-6 py-3.5 rounded-xl border border-red-900 bg-red-950/20 hover:bg-red-950/40 text-red-400 hover:text-red-300 font-bold text-sm transition-all shrink-0 cursor-pointer disabled:opacity-50"
          >
            {resetLoading ? 'Resetting...' : 'Reset Menu Data'}
          </button>
        </div>
      </div>

    </div>
  );
}
