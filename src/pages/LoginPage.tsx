import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Compass, 
  MapPin, 
  Navigation,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { loginWithEmail, loginWithGoogle, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!email.trim()) {
      setValidationError('Please enter your email address');
      return;
    }
    if (!password) {
      setValidationError('Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
      navigate('/dashboard');
    } catch {
      // Handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setValidationError(null);
    clearError();
    setIsLoading(true);
    try {
      const result = await loginWithGoogle();
      if (result.requiresRegistration) {
        navigate('/register');
      } else {
        navigate('/dashboard');
      }
    } catch {
      // Handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row">
      
      {/* LEFT COLUMN: Visual Journey Composition (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 border-r border-zinc-800 p-12 flex-col justify-between overflow-hidden">
        
        {/* Subtle background route contours */}
        <div className="absolute inset-0 opacity-15">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">
            <path d="M50,100 Q300,200 150,450 T550,700" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8" />
            <path d="M-50,300 Q400,350 200,600 T650,850" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Brand Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-700 flex items-center justify-center text-zinc-100 group-hover:border-zinc-500 transition-colors">
              <Compass className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="font-bold text-base text-zinc-100 tracking-tight">TheWorldView</span>
          </Link>
        </div>

        {/* Middle Visual Element: Journey Route Card */}
        <div className="relative z-10 my-auto max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950/80 border border-zinc-800 text-[11px] font-semibold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enter Your Travel Hub</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Every great journey begins with a single step.
          </h2>

          <p className="text-sm text-zinc-400 leading-relaxed">
            Access your saved multi-city routes, organized daily itineraries, and customized travel budgets.
          </p>

          {/* Mini Route Preview Card */}
          <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold text-zinc-200">Active Travel Route</span>
              <span className="text-[10px] text-emerald-400 font-mono">ONLINE</span>
            </div>

            <div className="flex items-center justify-between text-xs font-medium text-zinc-300">
              <span className="flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-sky-400" /> Tokyo
              </span>
              <span className="text-zinc-600">→</span>
              <span>Kyoto</span>
              <span className="text-zinc-600">→</span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <MapPin className="w-3.5 h-3.5" /> Osaka
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Coordinates & Reassurance */}
        <div className="relative z-10 flex items-center justify-between text-xs text-zinc-500">
          <span>Protected Authentication</span>
          <span className="font-mono text-[11px]">ROAD • JOURNEY • DESTINATION</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 my-auto">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Top Brand (Visible on small screens) */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100">
                <Compass className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-bold text-base text-zinc-100">TheWorldView</span>
            </Link>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Sign In
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Welcome back. Enter your credentials to access your trips.
            </p>
          </div>

          {/* Error Message */}
          {(error || validationError) && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-900/50 flex items-start gap-3 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
              <div className="leading-snug">{error || validationError}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="traveler@example.com"
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset instructions will be emailed to your address.')}
                  className="text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl py-3 pl-10 pr-10 text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-zinc-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-zinc-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-zinc-800 bg-zinc-900 text-zinc-100 h-4 w-4 cursor-pointer"
                />
                <span>Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 active:scale-95"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <span className="relative bg-zinc-950 px-3 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
              or continue with
            </span>
          </div>

          {/* Google login button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 text-xs font-medium transition-colors flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.053 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              />
            </svg>
            <span>Google Account</span>
          </button>

          {/* Switch to Register */}
          <div className="text-center pt-2 text-xs text-zinc-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-zinc-100 hover:underline">
              Create one now
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};
