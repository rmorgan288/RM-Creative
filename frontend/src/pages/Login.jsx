import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, ArrowUpRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import SEO from '../components/SEO';

const Login = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const dest = location.state?.from || '/admin';
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      toast.error('Enter the admin password.');
      return;
    }
    setSubmitting(true);
    try {
      await login(password);
      toast.success('Welcome back.');
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Incorrect password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f2ece2] flex items-center justify-center px-6 relative overflow-hidden">
      <SEO
        title="Sign in — Rhys Morgan Studio"
        description="Private admin sign-in."
        path="/login"
        robots="noindex, nofollow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-25"
        style={{
          background:
            'radial-gradient(closest-side, rgba(227,73,78,0.45), rgba(227,73,78,0) 70%)',
        }}
      />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md bg-[#141414] border border-[#2a2a2a] rounded-sm p-8 md:p-10"
      >
        <div className="flex items-center gap-3 mb-8">
          <img
            src="https://customer-assets.emergentagent.com/wingman/821fda20-6b65-4bc0-9677-fe505c145882/attachments/9468c975faec4774af2c1d56b4fe990d_RM_Logo-Mark_Red.png"
            alt=""
            className="h-8 w-auto"
          />
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8a8378]">
              Admin
            </div>
            <div className="font-display uppercase tracking-tight text-base text-[#f2ece2] font-bold">
              Rhys Morgan Studio
            </div>
          </div>
        </div>

        <h1 className="font-display-xl text-3xl md:text-4xl mb-2">
          Sign <span className="text-[#e3494e]">in.</span>
        </h1>
        <p className="text-[13px] text-[#a8a195] font-light mb-8">
          Private dashboard. No public sign-up.
        </p>

        <div className="space-y-2 mb-6">
          <Label className="font-sub text-[11px] text-[#8a8378]">Password</Label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-0 top-3 text-[#5c564c]" />
            <Input
              autoFocus
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="bg-transparent border-0 border-b border-[#2a2a2a] rounded-none h-11 pl-7 pr-9 text-[#f2ece2] placeholder:text-[#5c564c] focus-visible:ring-0 focus-visible:border-[#e3494e]"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-0 top-2 w-8 h-8 inline-flex items-center justify-center text-[#5c564c] hover:text-[#e3494e]"
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 bg-[#e3494e] hover:bg-[#c93b3f] disabled:opacity-60 text-white rounded-full h-12 font-sub text-[12px] transition-colors"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowUpRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
