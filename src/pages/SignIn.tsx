import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAppDispatch } from '@/hooks';
import { setUser } from '@/features/auth/authSlice';

const GoogleLoginButton = ({ onLoading, onSuccess }: { onLoading: (v: boolean) => void, onSuccess: (data: any) => void }) => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: tokenResponse.access_token }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Auth failed');
        onSuccess(data);
      } catch (e) {
        alert((e as Error).message);
      }
    },
    onError: () => alert('Google sign-in failed'),
    flow: 'implicit',
    scope: 'profile email openid',
  });

  return (
    <button
      onClick={() => login()}
      className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl px-4 py-3 hover:bg-slate-50 transition-colors shadow-sm"
    >
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
      Continue with Google
    </button>
  );
};

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const dispatch = useAppDispatch();
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleLoginSuccess = (data: any) => {
    localStorage.setItem('me_jwt', data.token);
    dispatch(setUser({ ...data.user, token: data.token }));
    const to = location.state?.from?.pathname || '/';
    navigate(to, { replace: true });
  };

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    try {
      const res = await fetch('/api/auth/guest', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      handleLoginSuccess(data);
    } catch (e) {
      alert('Demo login failed: ' + (e as Error).message);
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 sm:mt-12 px-4 animate-fade-in">
      <div className="bg-white p-6 sm:p-8 rounded-[24px] sm:rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-violet-500" />

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-2-2m0 0l2-2m-2 2h8m-9 3h11a2 2 0 002-2v-5a2 2 0 00-2-2h-11a2 2 0 00-2 2v5a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Join the community of weekend explorers.</p>
        </div>

        <div className="space-y-4">
          {clientId && (
            <GoogleLoginButton onLoading={setIsDemoLoading} onSuccess={handleLoginSuccess} />
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-400">{clientId ? 'or try it out' : 'sign in as guest'}</span>
            </div>
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={isDemoLoading}
            className="w-full bg-slate-900 text-white font-bold rounded-xl px-4 py-3 hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
          >
            {isDemoLoading ? 'Loading...' : 'Continue as Guest'}
          </button>
        </div>

        <p className="text-xs text-center text-slate-400 mt-8 leading-relaxed">
          By signing in, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          New here? <span className="text-indigo-600 font-bold hover:underline cursor-pointer" onClick={() => navigate('/')}>Discover more events</span>
        </p>
      </div>
    </div>
  );
}
