'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Library, Search, Menu, X, Home, Info, Shield, Mail, BookOpen, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, isLibrarian } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/books?search=${encodeURIComponent(searchQuery)}`;
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/about', label: 'About Us', icon: Info },
    { href: '/privacy', label: 'Privacy Policy', icon: Shield },
    { href: '/contact', label: 'Contact Us', icon: Mail },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
            <Library className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline">LibraryMS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden md:flex"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* User Actions */}
            {user ? (
              <>
                <Link href={isLibrarian ? '/dashboard' : '/books'} className="hidden sm:block">
                  <Button variant="ghost" size="sm" className="gap-2">
                    {isLibrarian ? (
                      <>
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-4 w-4" />
                        Browse Books
                      </>
                    )}
                  </Button>
                </Link>
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
        {isSearchOpen && (
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

            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}

            {/* User Actions */}
            <div className="pt-2 border-t space-y-2">
              {user ? (
                <Link href={isLibrarian ? '/dashboard' : '/books'} onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    {isLibrarian ? (
                      <>
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-4 w-4" />
                        Browse Books
                      </>
                    )}
                  </Button>
                </Link>
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