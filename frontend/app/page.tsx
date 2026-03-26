"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sprout, 
  Leaf, 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/components/AuthContext';

type AuthMode = 'login' | 'signup';

export default function AuthPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setFormData({ name: '', username: '', email: '', password: '' });
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length > 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getFirebaseErrorMessage = (code: string) => {
    switch (code) {
      case 'auth/user-not-found': return 'No account found with this email. Please sign up first.';
      case 'auth/wrong-password': return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential': return 'Invalid email or password. Please check and try again.';
      case 'auth/email-already-in-use': return 'This email is already registered. Please log in instead.';
      case 'auth/weak-password': return 'Password must be at least 6 characters long.';
      case 'auth/invalid-email': return 'Please enter a valid email address.';
      case 'auth/too-many-requests': return 'Too many attempts. Please try again later.';
      default: return 'An error occurred. Please try again.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!formData.name || !formData.username || !formData.email || !formData.password) {
          setError('Please fill in all required fields.');
          setLoading(false);
          return;
        }
        const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(cred.user, { displayName: formData.name });
        await setDoc(doc(db, 'users', cred.user.uid), {
          name: formData.name,
          username: formData.username,
          email: formData.email,
          createdAt: new Date().toISOString(),
        });
        router.push('/dashboard');
      } else {
        if (!formData.email || !formData.password) {
          setError('Please fill in both email and password.');
          setLoading(false);
          return;
        }
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(formData.password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
      
      <div className="max-w-6xl w-full grid md:grid-cols-2 glass-card rounded-3xl overflow-hidden relative z-10">
        
        {/* Left Side: Branding */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-primary text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">KrishiBandhu</h1>
            </div>
            
            <h2 className="text-4xl font-bold leading-tight mb-6">
              Empowering Farmers with <span className="text-secondary">AI Intelligence</span>
            </h2>
            
            <div className="space-y-6">
              <FeatureItem icon={<ShieldCheck className="w-5 h-5" />} title="Disease Detection" desc="Instant identification of crop diseases using AI vision." />
              <FeatureItem icon={<Leaf className="w-5 h-5" />} title="Expert Advisory" desc="Personalized farming tips based on your soil and climate." />
              <FeatureItem icon={<ArrowRight className="w-5 h-5" />} title="Market Insights" desc="Real-time price tracking for your local Mandis." />
            </div>
          </div>
          
          <div className="relative z-10 mt-12">
            <p className="text-white/60 text-sm">© 2026 KrishiBandhu. Growing together, harvesting success.</p>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="p-8 md:p-12 bg-white/40 backdrop-blur-sm">
          <div className="max-w-md mx-auto">
            <div className="mb-10">
              <div className="md:hidden flex items-center gap-2 mb-6 text-primary">
                <Sprout className="w-6 h-6" />
                <span className="font-bold text-xl">KrishiBandhu</span>
              </div>
              <h3 className="text-3xl font-bold text-earth mb-2">
                {mode === 'login' ? 'Welcome Back!' : 'Join KrishiBandhu'}
              </h3>
              <p className="text-stone-500">
                {mode === 'login' 
                  ? 'Access your farm dashboard and AI insights.' 
                  : 'Start your journey towards smarter farming today.'}
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-5"
                  >
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-stone-700 ml-1">Full Name</label>
                      <input type="text" name="name" placeholder="Enter your full name" className="input-field" value={formData.name} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-stone-700 ml-1">Username</label>
                      <input type="text" name="username" placeholder="Choose a unique username" className="input-field" value={formData.username} onChange={handleInputChange} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-stone-700 ml-1">Email Address</label>
                <input type="email" name="email" placeholder="Enter your email address" className="input-field" value={formData.email} onChange={handleInputChange} />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-semibold text-stone-700">Password</label>
                  {mode === 'login' && (
                    <button type="button" className="text-xs text-primary font-medium hover:underline">Forgot Password?</button>
                  )}
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    placeholder="••••••••" 
                    className="input-field pr-12"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button 
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPassword((prev) => !prev); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-800 transition-colors cursor-pointer z-50"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {formData.password && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 space-y-2">
                    <div className="flex gap-1 h-1.5">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${i <= strength ? strengthColors[strength - 1] : 'bg-stone-200'}`} />
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold">
                      <span className={strength > 0 ? 'text-stone-600' : 'text-stone-400'}>
                        Strength: <span className={strength > 0 ? 'text-primary' : ''}>{strengthLabels[strength - 1] || 'None'}</span>
                      </span>
                      <div className="flex gap-2">
                        <PasswordCriteria met={formData.password.length >= 8} label="8+ chars" />
                        <PasswordCriteria met={/[A-Z]/.test(formData.password)} label="Upper" />
                        <PasswordCriteria met={/[0-9]/.test(formData.password)} label="Number" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="pt-4">
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 bg-red-100/80 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
                <button type="submit" disabled={loading} className="btn-primary group disabled:opacity-70">
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-stone-600 text-sm">
                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                <button onClick={toggleMode} className="ml-2 text-primary font-bold hover:underline">
                  {mode === 'login' ? 'Sign Up' : 'Log In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="mt-1 p-2 bg-white/10 rounded-lg">{icon}</div>
      <div>
        <h4 className="font-semibold text-lg">{title}</h4>
        <p className="text-white/70 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function PasswordCriteria({ met, label }: { met: boolean, label: string }) {
  return (
    <span className={`flex items-center gap-1 ${met ? 'text-green-600' : 'text-stone-400'}`}>
      {met ? <CheckCircle2 className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
      {label}
    </span>
  );
}
