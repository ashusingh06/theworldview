import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Camera, 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Compass, 
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Upload,
  RefreshCw,
  Check,
  ShieldCheck,
  Inbox,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config/firebase';

export const RegisterPage: React.FC = () => {
  const { 
    currentUser, 
    registerWithProfile, 
    sendEmailOtp, 
    verifyEmailOtp, 
    getPendingGoogleUser,
    error, 
    clearError 
  } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  // OTP Verification States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(60);
  const [isResending, setIsResending] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Check for pending Google user data or prefilled state on mount
  useEffect(() => {
    const pendingGoogle = getPendingGoogleUser();
    const fbUser = auth.currentUser;

    if (pendingGoogle) {
      if (pendingGoogle.email) setEmail(pendingGoogle.email);
      if (pendingGoogle.firstName) setFirstName(pendingGoogle.firstName);
      if (pendingGoogle.lastName) setLastName(pendingGoogle.lastName);
      if (pendingGoogle.photoURL) setPhotoPreview(pendingGoogle.photoURL);
      if (pendingGoogle.phoneNumber) setPhone(pendingGoogle.phoneNumber);
      if (pendingGoogle.city) setCity(pendingGoogle.city);
      if (pendingGoogle.country) setCountry(pendingGoogle.country);
      if (pendingGoogle.bio) setBio(pendingGoogle.bio);
      setIsGoogleUser(true);
    } else if (fbUser) {
      const names = (fbUser.displayName || '').split(' ');
      if (fbUser.email) setEmail(fbUser.email);
      setFirstName(names[0] || '');
      setLastName(names.slice(1).join(' ') || '');
      if (fbUser.photoURL) setPhotoPreview(fbUser.photoURL);
      if (fbUser.phoneNumber) setPhone(fbUser.phoneNumber);
      setIsGoogleUser(true);
    } else if (currentUser && !currentUser.isProfileComplete) {
      if (currentUser.email) setEmail(currentUser.email);
      if (currentUser.firstName) setFirstName(currentUser.firstName);
      if (currentUser.lastName) setLastName(currentUser.lastName);
      if (currentUser.photoURL) setPhotoPreview(currentUser.photoURL);
      if (currentUser.phoneNumber) setPhone(currentUser.phoneNumber);
      if (currentUser.city) setCity(currentUser.city);
      if (currentUser.country) setCountry(currentUser.country);
      if (currentUser.bio) setBio(currentUser.bio);
      setIsGoogleUser(currentUser.provider === 'google');
    }
  }, [currentUser, location]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (showOtpModal && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtpModal, timer]);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: '', color: 'bg-zinc-800', width: 'w-0' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;

    if (score === 1) return { score: 1, label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500', width: 'w-2/4' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-sky-500', width: 'w-3/4' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-400', width: 'w-full' };
  };

  const strength = getPasswordStrength();
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordsMismatch = password && confirmPassword && password !== confirmPassword;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInitiateOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    // Field Validations
    if (!firstName.trim() || !lastName.trim()) {
      setValidationError('Please enter your full first and last name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setValidationError('Please provide a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setValidationError('Please provide your phone number.');
      return;
    }
    if (!city.trim() || !country.trim()) {
      setValidationError('Please enter your city and country.');
      return;
    }

    // Password Validation for all users
    if (password.length < 6) {
      setValidationError('Please choose a password with at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match. Please re-check your confirm password.');
      return;
    }

    setIsLoading(true);
    try {
      // Dispatch real OTP to recipient email
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      await sendEmailOtp(email, fullName);
      setShowOtpModal(true);
      setTimer(60);
      setOtpCode(['', '', '', '', '', '']);
      setOtpError(null);
      setResendSuccess(false);
    } catch (err: any) {
      setValidationError(err.message || 'Failed to send verification email code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otpCode];
      pastedDigits.forEach((digit, i) => {
        if (index + i < 6) newOtp[index + i] = digit;
      });
      setOtpCode(newOtp);
      const nextFocus = Math.min(index + pastedDigits.length, 5);
      otpInputsRef.current[nextFocus]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newOtp = [...otpCode];
    newOtp[index] = digit;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (digit && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setOtpError(null);
    setResendSuccess(false);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      await sendEmailOtp(email, fullName);
      setTimer(60);
      setOtpCode(['', '', '', '', '', '']);
      setResendSuccess(true);
    } catch (err: any) {
      setOtpError(err.message || 'Failed to resend code.');
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyAndComplete = async () => {
    const fullCode = otpCode.join('');
    if (fullCode.length !== 6) {
      setOtpError('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsLoading(true);
    setOtpError(null);
    try {
      await verifyEmailOtp(email, fullCode);

      // Successfully verified! Save complete profile with chosen password
      await registerWithProfile({
        firstName,
        lastName,
        email,
        phoneNumber: phone,
        city,
        country,
        bio,
        password: password,
        photoURL: photoPreview || undefined,
        emailVerified: true
      });

      setShowOtpModal(false);
      navigate('/dashboard');
    } catch (err: any) {
      setOtpError(err.message || 'Invalid verification code. Please check your email and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row">
      
      {/* LEFT COLUMN: Visual Journey Map & Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-zinc-900 border-r border-zinc-800 p-12 flex-col justify-between overflow-hidden">
        
        {/* Subtle contour lines */}
        <div className="absolute inset-0 opacity-15">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">
            <path d="M-50,150 Q200,250 350,150 T650,300" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8" />
            <path d="M-50,450 Q300,550 150,700 T650,750" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
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

        {/* Story copy */}
        <div className="relative z-10 my-auto max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950/80 border border-zinc-800 text-[11px] font-semibold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGoogleUser ? 'Google Account Connected' : 'Join Global Travelers'}</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {isGoogleUser ? 'Complete your traveler registration.' : 'Build your verified traveler profile.'}
          </h2>

          <p className="text-sm text-zinc-400 leading-relaxed">
            Every journey requires a destination. Complete your travel profile, choose your password, and verify your email to unlock multi-city route creation.
          </p>

          <div className="space-y-3 pt-2 text-xs text-zinc-300">
            <div className="flex items-center gap-2.5">
              <KeyRound className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Choose a secure password for your account</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Email OTP 2-Factor Verification</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Automatic multi-city road map generator</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-zinc-500 font-mono">
          ROAD → JOURNEY → DESTINATION → THE WORLD
        </div>
      </div>

      {/* RIGHT COLUMN: Modern Registration Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-xl space-y-6 py-6">
          
          {/* Mobile Brand Link */}
          <div className="lg:hidden text-center mb-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100">
                <Compass className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-bold text-base text-zinc-100">TheWorldView</span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {isGoogleUser ? 'Complete Registration' : 'Create Traveler Account'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              {isGoogleUser 
                ? 'Your Google account is connected. Provide your details, choose your password, and verify via email OTP.'
                : 'Complete your profile, choose your password, and verify your email to begin organizing journeys.'}
            </p>
          </div>

          {/* Google Connected Alert Banner */}
          {isGoogleUser && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-3 text-xs text-emerald-300">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Google authenticated. Please complete remaining profile details and choose your password.</span>
            </div>
          )}

          {/* Error Message */}
          {(error || validationError) && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-900/50 flex items-start gap-3 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
              <div className="leading-snug">{error || validationError}</div>
            </div>
          )}

          {/* Form Card */}
          <form onSubmit={handleInitiateOtp} className="p-6 sm:p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-6 shadow-xl backdrop-blur-xs">
            
            {/* PHOTO UPLOAD AVATAR SECTION */}
            <div className="flex flex-col items-center justify-center text-center pb-4 border-b border-zinc-800/80">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-20 h-20 rounded-full bg-zinc-950 border-2 border-dashed border-zinc-700 group-hover:border-zinc-500 flex items-center justify-center overflow-hidden transition-colors shadow-inner">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-500">
                      <Camera className="w-6 h-6 mb-0.5 text-zinc-400 group-hover:text-zinc-200" />
                      <span className="text-[10px] font-medium uppercase tracking-wider">Photo</span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shadow-md">
                  <Upload className="w-3 h-3 text-emerald-400" />
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <span className="text-[11px] text-zinc-400 mt-2 font-medium">
                {photoPreview ? 'Click to change photo' : 'Click to upload profile photo'}
              </span>
            </div>

            {/* ROW 1: First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  First Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Abhay"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Last Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Kumar"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* ROW 2: Email Address & Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Email Address {isGoogleUser && '(from Google)'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    required
                    disabled={isGoogleUser}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-zinc-500 transition-colors ${
                      isGoogleUser ? 'opacity-80 cursor-not-allowed bg-zinc-900' : ''
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* ROW 3: City & Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. New Delhi"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Country
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. India"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* ROW 4: Additional Information / Short Bio */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Additional Information / Travel Bio
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your travel interests, favorite travel styles, or dream destinations..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>

            {/* ROW 5: CHOOSE PASSWORD SYSTEM */}
            <div className="pt-2 border-t border-zinc-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Choose Your Password</span>
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Set a secure password for logging into your TheWorldView account.
                  </p>
                </div>
                {password && (
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                    strength.score <= 1 ? 'text-red-400 bg-red-950/60' :
                    strength.score === 2 ? 'text-amber-400 bg-amber-950/60' :
                    strength.score === 3 ? 'text-sky-400 bg-sky-950/60' :
                    'text-emerald-400 bg-emerald-950/60'
                  }`}>
                    {strength.label}
                  </span>
                )}
              </div>

              {/* Password strength bar */}
              {password && (
                <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                  <div className={`h-full ${strength.width} ${strength.color} transition-all duration-300`} />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Choose Password */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Choose Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-9 text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-zinc-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      Confirm Password
                    </label>
                    {passwordsMatch && (
                      <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Matching
                      </span>
                    )}
                    {passwordsMismatch && (
                      <span className="text-[10px] text-red-400 font-medium">
                        Mismatch
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className={`w-full bg-zinc-950 border rounded-xl py-2.5 pl-9 pr-9 text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none transition-colors ${
                        passwordsMatch ? 'border-emerald-600/70 focus:border-emerald-500' :
                        passwordsMismatch ? 'border-red-600/70 focus:border-red-500' :
                        'border-zinc-800 focus:border-zinc-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send OTP & Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Switch to Login */}
            <div className="text-center pt-2 text-xs text-zinc-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-zinc-100 hover:underline">
                Login here
              </Link>
            </div>

          </form>

        </div>
      </div>

      {/* PRODUCTION OTP VERIFICATION MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 text-emerald-400 mb-1">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Check Your Email</h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                We've sent a 6-digit verification code to <span className="text-zinc-200 font-semibold">{email}</span>
              </p>
            </div>

            {/* Info Badge */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
              <p className="text-[11px] text-zinc-400">
                Please check your inbox (and spam/junk folder). Enter the 6-digit code below to confirm.
              </p>
            </div>

            {/* Resend success notice */}
            {resendSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>A new verification code has been dispatched to your email.</span>
              </div>
            )}

            {/* OTP Error alert */}
            {otpError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-900 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{otpError}</span>
              </div>
            )}

            {/* 6 Digit Inputs */}
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              {otpCode.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { otpInputsRef.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-lg font-bold bg-zinc-950 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                />
              ))}
            </div>

            {/* Countdown / Resend */}
            <div className="text-center text-xs text-zinc-400">
              {timer > 0 ? (
                <span>Didn't receive email? Resend code in <strong className="text-zinc-200 font-mono">{timer}s</strong></span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                  <span>Resend Verification Code</span>
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleVerifyAndComplete}
                disabled={isLoading || otpCode.join('').length !== 6}
                className="w-full py-3 px-4 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verify Code & Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="w-full py-2 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                Back to Edit Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
