'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';
import { Library, LogOut, User } from 'lucide-react';

export default function AdminNavbar() {
  const { user, logout } = useAuth();

  // Get admin name from email
  const adminName = user?.email?.split('@')[0] || 'Admin';

  return (
    <nav className="sticky top-0 z-50 border-b bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/admin/dashboard" className="flex items-center space-x-2 font-bold text-xl">
            <Library className="h-6 w-6 text-blue-400" />
            <span className="text-white">LibraryMS</span>
          </Link>

          {/* Center - Welcome Message */}
          <div className="hidden md:block">
            <div className="text-center">
              <p className="text-sm text-slate-300">Welcome back,</p>
              <p className="text-lg font-bold text-white">{adminName}</p>
            </div>
          </div>

          {/* Right Side - Admin Info & Logout */}
          <div className="flex items-center space-x-3">
            {/* Admin Badge */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg border border-blue-500">
              <User className="h-4 w-4 text-white" />
              <div className="text-left">
                <p className="text-xs text-blue-200">Administrator</p>
                <p className="text-sm font-semibold text-white">{adminName}</p>
              </div>
            </div>

            {/* Logout Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout} 
              className="gap-2 text-red-300 hover:text-red-200 hover:bg-red-900/30 border border-red-400/30"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}