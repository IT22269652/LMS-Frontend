'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Shield, Clock, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full shadow-md text-sm font-medium">
              <span>✨</span>
              <span>Welcome to the Future of Libraries</span>
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-700 via-blue-700 to-indigo-700 bg-clip-text text-transparent leading-tight">
            LibraryMS
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Your modern library management solution. Manage books, track reservations, and enhance your reading experience.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6 shadow-lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-2">
                Login
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">
              Key Features
            </h2>
            <p className="text-slate-600 text-lg">Everything you need for modern library management</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader className="bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="p-3 bg-blue-100 rounded-xl w-fit mb-3">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-slate-800">Extensive Catalog</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600">
                  Browse thousands of books across multiple genres, languages, and categories.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader className="bg-gradient-to-br from-slate-50 to-green-50">
                <div className="p-3 bg-green-100 rounded-xl w-fit mb-3">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-slate-800">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600">
                  Secure authentication with role-based access for librarians and members.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader className="bg-gradient-to-br from-slate-50 to-purple-50">
                <div className="p-3 bg-purple-100 rounded-xl w-fit mb-3">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-slate-800">Easy Reservations</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600">
                  Reserve books for 7, 14, or 21 days with automatic tracking.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader className="bg-gradient-to-br from-slate-50 to-orange-50">
                <div className="p-3 bg-orange-100 rounded-xl w-fit mb-3">
                  <Shield className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-slate-800">Secure & Reliable</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600">
                  Built with enterprise-grade security using JWT authentication.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white rounded-3xl p-12 shadow-xl border border-slate-200">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">
              How It Works
            </h2>
            <p className="text-slate-600 text-lg">Get started in three simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="inline-block mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">
                  1
                </div>
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Create Account</h3>
              <p className="text-slate-600">
                Sign up as a member or librarian to access the system
              </p>
            </div>
            <div className="text-center">
              <div className="inline-block mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">
                  2
                </div>
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Browse & Search</h3>
              <p className="text-slate-600">
                Find your favorite books using advanced filters
              </p>
            </div>
            <div className="text-center">
              <div className="inline-block mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">
                  3
                </div>
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Reserve & Read</h3>
              <p className="text-slate-600">
                Reserve books and enjoy your reading experience
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">Join thousands of readers and librarians today</p>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-blue-50 border-0 text-lg px-8 py-6">
                Create Your Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}