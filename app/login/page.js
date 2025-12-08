'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Lock, AlertCircle, Eye, EyeOff, BookOpen, Library, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <div className="mb-8">
            <Library className="h-24 w-24 text-white drop-shadow-lg" />
          </div>
          
          <h1 className="text-5xl font-bold mb-4 text-center">LibraryMS</h1>
          <p className="text-xl text-center mb-8 text-emerald-100">Your Digital Library Management Solution</p>
          
          {/* Library illustration */}
          <div className="relative w-full max-w-md mt-8">
            <img 
              src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80" 
              alt="Library" 
              className="rounded-2xl shadow-2xl object-cover w-full h-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-teal-900/50 to-transparent rounded-2xl"></div>
          </div>
          
          <div className="mt-12 flex items-center gap-8 text-emerald-100">
            <div className="text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Manage Books</p>
            </div>
            <div className="text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Track Members</p>
            </div>
            <div className="text-center">
              <Library className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Easy Access</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-4">
              <Library className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              LibraryMS
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
            <p className="text-gray-600">Login to continue your reading journey</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-500" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 border-2 border-gray-200 rounded-lg focus:border-teal-500 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-500" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-12 border-2 border-gray-200 rounded-lg focus:border-teal-500 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-teal-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 h-12 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl" 
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-gray-600">Don't have an account? </span>
              <Link href="/signup" className="text-teal-600 hover:text-teal-700 font-semibold hover:underline">
                Sign up
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-teal-600 hover:text-teal-700 font-medium hover:underline inline-flex items-center gap-1">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}