'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Lock, Mail, ArrowLeft, Trophy, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (data.success) {
        router.push(data.redirectTo || '/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080D1C] text-[#F8FAFC] flex flex-col justify-between py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Stadium Floodlight Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#12E2C4]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[300px] bg-[#F59E0B]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Back Link */}
      <div className="max-w-md w-full mx-auto relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#94A3B8] hover:text-[#12E2C4] transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Portal</span>
        </Link>
      </div>

      {/* Main Terminal Box */}
      <div className="max-w-md w-full mx-auto relative z-10 my-auto">
        {/* Brand Emblem */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F59E0B] via-[#12E2C4] to-[#0B1124] p-[1.5px] mx-auto mb-4 shadow-2xl">
            <div className="w-full h-full bg-[#0B1124] rounded-[14px] flex items-center justify-center">
              <Trophy className="w-7 h-7 text-[#12E2C4]" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase font-['Space_Grotesk'] tracking-tight text-[#F8FAFC]">
            ADMIN TERMINAL
          </h1>
          <p className="text-xs font-mono text-[#94A3B8] uppercase tracking-widest mt-1">
            MINI OLYMPICS 2026 • FCIT SPORTS SOCIETY
          </p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-3xl bg-[#131B38] border border-white/[0.08] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="text-xs font-mono text-[#94A3B8] uppercase">Username or Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  autoFocus
                  autoComplete="username"
                  className="pl-10 bg-[#080D1C] border-white/[0.1] text-xs font-mono text-[#F8FAFC] rounded-xl focus:border-[#12E2C4]"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-mono text-[#94A3B8] uppercase">Security Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="pl-10 bg-[#080D1C] border-white/[0.1] text-xs font-mono text-[#F8FAFC] rounded-xl focus:border-[#12E2C4]"
                />
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-xs font-mono font-black tracking-wider text-[#0B1124] bg-[#12E2C4] hover:bg-[#0FC9AE] uppercase transition-all shadow-xl shadow-[#12E2C4]/20"
            >
              {loading ? 'AUTHENTICATING...' : 'ENTER CONTROL CENTER →'}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/[0.06] text-center">
            <span className="text-[11px] font-mono text-[#94A3B8]/70 block">
              Restricted to authorized society officers & administrators.
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-md w-full mx-auto relative z-10 text-center text-xs font-mono text-[#94A3B8]/50">
        PUCIT OLD CAMPUS • LAHORE
      </div>
    </div>
  );
}
