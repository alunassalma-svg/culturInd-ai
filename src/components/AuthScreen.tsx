import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui';
import { Mail, Lock, AlertCircle, Loader2, ShieldCheck, KeyRound } from 'lucide-react';

type Mode = 'signin' | 'signup' | 'reset';

export function AuthScreen() {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<Mode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setInfo('');

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (mode !== 'reset' && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setBusy(true);
    try {
      if (mode === 'signup') {
        const { error: err } = await signUp(email.trim(), password);
        if (err) setError(err);
        else setInfo('Account created! Welcome to CulturInd.ai.');
      } else if (mode === 'signin') {
        const { error: err } = await signIn(email.trim(), password);
        if (err) setError(err);
      } else {
        const { error: err } = await resetPassword(email.trim());
        if (err) setError(err);
        else setInfo('Password reset link sent! Check your email.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-900 batik-bg p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-black text-white">
            Cultur<span className="shimmer-text">Ind</span>.ai
          </h1>
          <p className="text-ink-400 mt-2">Discover Indonesian culture, the cool way</p>
        </div>

        <div className="card-base batik-bg p-8">
          {/* Mode tabs */}
          <div className="flex gap-1 p-1 bg-ink-800 rounded-xl mb-6">
            <button
              onClick={() => { setMode('signup'); setError(''); setInfo(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                mode === 'signup' ? 'bg-batik-400 text-white' : 'text-ink-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
            <button
              onClick={() => { setMode('signin'); setError(''); setInfo(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                mode === 'signin' ? 'bg-batik-400 text-white' : 'text-ink-400 hover:text-white'
              }`}
            >
              Log In
            </button>
          </div>

          <h2 className="text-xl font-display font-bold text-white mb-1">
            {mode === 'signup' && 'Join the adventure'}
            {mode === 'signin' && 'Welcome back!'}
            {mode === 'reset' && 'Reset your password'}
          </h2>
          <p className="text-ink-400 text-sm mb-6">
            {mode === 'signup' && 'Save your progress, badges, and creations — across any device.'}
            {mode === 'signin' && 'Pick up right where you left off.'}
            {mode === 'reset' && 'We will email you a secure link to set a new password.'}
          </p>

          {/* Email */}
          <div className="mb-4">
            <label className="text-xs text-ink-400 mb-1 block">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-full bg-ink-800 border border-ink-600 rounded-lg pl-10 pr-3 py-2.5 text-white focus:border-neon-blue outline-none"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password (hidden in reset mode) */}
          {mode !== 'reset' && (
            <div className="mb-4">
              <label className="text-xs text-ink-400 mb-1 block">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="w-full bg-ink-800 border border-ink-600 rounded-lg pl-10 pr-3 py-2.5 text-white focus:border-neon-blue outline-none"
                  placeholder="At least 6 characters"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-start gap-2 text-red-400 text-sm bg-red-500/10 rounded-lg p-3">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Info */}
          {info && (
            <div className="mb-4 flex items-start gap-2 text-neon-green text-sm bg-neon-green/10 rounded-lg p-3">
              <ShieldCheck size={18} className="flex-shrink-0 mt-0.5" />
              <span>{info}</span>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            size="lg"
            className="w-full"
            disabled={busy}
          >
            {busy ? <Loader2 size={20} className="animate-spin" /> : (
              mode === 'signup' ? 'Create account' :
              mode === 'signin' ? 'Log in' :
              'Send reset link'
            )}
          </Button>

          {/* Reset link toggle */}
          {mode !== 'reset' && (
            <button
              onClick={() => { setMode('reset'); setError(''); setInfo(''); setPassword(''); }}
              className="mt-4 flex items-center gap-1.5 text-sm text-ink-400 hover:text-neon-blue transition-colors"
            >
              <KeyRound size={14} /> Forgot your password?
            </button>
          )}
          {mode === 'reset' && (
            <button
              onClick={() => { setMode('signin'); setError(''); setInfo(''); }}
              className="mt-4 text-sm text-ink-400 hover:text-white transition-colors"
            >
              Back to log in
            </button>
          )}
        </div>

        <p className="text-center text-ink-500 text-xs mt-6 flex items-center justify-center gap-1.5">
          <ShieldCheck size={14} className="text-neon-green" />
          Your password is securely hashed — we never see or store it.
        </p>
      </div>
    </div>
  );
}
