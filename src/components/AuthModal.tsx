import React, { useState } from 'react';
import { User, ShieldCheck, Lock, Mail, ArrowRight, X, Sparkles } from 'lucide-react';
import { TEST_CREDENTIALS } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginAsRole: (role: 'subscriber' | 'admin') => void;
  onCustomLogin: (email: string) => void;
  onRegisterNew: (fullName: string, email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginAsRole,
  onCustomLogin,
  onRegisterNew,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup') {
      if (!fullName || !email) {
        alert('Please fill in all fields');
        return;
      }
      onRegisterNew(fullName, email);
    } else {
      if (!email) {
        alert('Please enter your email');
        return;
      }
      onCustomLogin(email);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#101b24] border border-[#273d52] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-[#182836] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#162736] text-[#5eead4] text-xs font-bold border border-[#284157]">
            <Sparkles className="w-3.5 h-3.5" />
            Digital Heroes Authentication
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {mode === 'signin' ? 'Sign In to Your Account' : 'Create Golfer Account'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'signin' 
              ? 'Access your Stableford score history, active draw ticket, and prizes.' 
              : 'Join Digital Heroes to track your game and support life-changing causes.'}
          </p>
        </div>

        {/* 1-Click Test Credentials (PRD §15.1 Mandatory Deliverables) */}
        <div className="p-4 rounded-2xl bg-[#0b1319] border border-[#1e2f41] space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Sample Test Credentials (PRD §15)</span>
            <span className="text-amber-400">1-Click Login</span>
          </div>

          <button
            id="quick-login-subscriber"
            type="button"
            onClick={() => {
              onLoginAsRole('subscriber');
              onClose();
            }}
            className="w-full p-2.5 rounded-xl bg-[#142330] hover:bg-[#1a2d3e] border border-[#263b4f] text-left transition flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-700/50 flex items-center justify-center text-emerald-400 font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-[#5eead4] transition">
                  {TEST_CREDENTIALS.subscriber.name} (Subscriber)
                </div>
                <div className="text-[10px] text-slate-400">{TEST_CREDENTIALS.subscriber.email}</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#5eead4] transition" />
          </button>

          <button
            id="quick-login-admin"
            type="button"
            onClick={() => {
              onLoginAsRole('admin');
              onClose();
            }}
            className="w-full p-2.5 rounded-xl bg-[#142330] hover:bg-[#1a2d3e] border border-[#263b4f] text-left transition flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-950 border border-amber-700/50 flex items-center justify-center text-amber-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                  {TEST_CREDENTIALS.admin.name} (Admin Panel)
                </div>
                <div className="text-[10px] text-slate-400">{TEST_CREDENTIALS.admin.email}</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-300 transition" />
          </button>
        </div>

        {/* Standard Email / Password Form */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="flex-1 h-px bg-[#1d2d3d]" />
          <span>or sign in with email</span>
          <div className="flex-1 h-px bg-[#1d2d3d]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Jack Nicklaus"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0b1319] border border-[#23384a] text-white"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="golfer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0b1319] border border-[#23384a] text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0b1319] border border-[#23384a] text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-sm bg-[#e28743] hover:bg-[#f09756] text-black transition cursor-pointer shadow-lg shadow-[#e28743]/20 mt-2"
          >
            {mode === 'signin' ? 'Sign In to Dashboard' : 'Complete Registration'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-xs text-slate-400 hover:text-white transition"
            >
              {mode === 'signin' 
                ? "Don't have an account? Sign up here" 
                : 'Already registered? Sign in instead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
