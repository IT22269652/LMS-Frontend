'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userRole = localStorage.getItem('userRole');
        const userEmail = localStorage.getItem('userEmail');
        setUser({ email: userEmail, role: userRole });
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.clear();
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      // Call the backend login API
      const response = await authAPI.login({ email, password });
      const { token, role, email: userEmail, message } = response.data;
      
      // Save auth data to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userEmail', userEmail);
      
      // Set user state
      setUser({ email: userEmail, role });
      
      // Navigate based on role
      if (role === 'LIBRARIAN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
      
      return { success: true, message: message || 'Login successful!' };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Login failed. Please check your credentials.';
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await authAPI.signup({ email, password });
      const message = response.data.message || 'Signup successful! Please login.';
      return { 
        success: true, 
        message: message
      };
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Signup failed. Please try again.';
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    router.push('/');
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isLibrarian: user?.role === 'LIBRARIAN',
    isUser: user?.role === 'USER',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}