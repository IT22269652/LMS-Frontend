'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Library, Search, Menu, X, Home, Info, Shield, Mail, BookOpen, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, isLibrarian, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Don't show this navbar for librarians/admins
  if (isLibrarian) {
    return null;
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/user/books?search=${encodeURIComponent(searchQuery)}`;
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/about', label: 'About Us', icon: Info },
    { href: '/privacy', label: 'Privacy Policy', icon: Shield },
  ];

  // Get username from email
  const username = user?.email?.split('@')[0] || '';

  return (
    <nav className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
            <Library className="h-6 w-6 text-blue-600" />
            <span className="hidden sm:inline text-slate-800">LibraryMS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button variant="ghost" size="sm" className="gap-2 text-slate-700">
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
            
            {/* Borrow Books Link */}
            {user && (
              <Link href="/user/books">
                <Button variant="ghost" size="sm" className="gap-2 text-slate-700">
                  <BookOpen className="h-4 w-4" />
                  Borrow Books
                </Button>
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Button */}
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hidden md:flex"
              >
                <Search className="h-4 w-4" />
              </Button>
            )}

            {/* User Actions */}
            {user ? (
              <>
                {/* Profile Link */}
                <Link href="/user/profile" className="hidden md:block">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>

                {/* User Name Display */}
                <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    {username}
                  </span>
                </div>

                {/* Logout Button */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout} 
                  className="hidden sm:flex gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/signup" className="hidden sm:block">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Search Bar (Expandable) */}
        {isSearchOpen && user && (
          <div className="pb-4 animate-in slide-in-from-top-2">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search books by title, author, or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button type="submit" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 animate-in slide-in-from-top-2">
            {/* Mobile Search */}
            {user && (
              <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <Input
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            )}

            {/* User Info (Mobile) */}
            {user && (
              <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-lg mb-2 border border-blue-200">
                <User className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  {username}
                </span>
              </div>
            )}

            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}

            {/* Borrow Books (Mobile) */}
            {user && (
              <Link href="/user/books" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <BookOpen className="h-4 w-4" />
                  Borrow Books
                </Button>
              </Link>
            )}

            {/* User Actions */}
            <div className="pt-2 border-t space-y-2">
              {user ? (
                <>
                  <Link href="/user/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full">Login</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}