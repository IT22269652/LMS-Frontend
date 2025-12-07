'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, FolderOpen, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { booksAPI, categoriesAPI, usersAPI } from '@/lib/api';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLibrarian, loading } = useAuth();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalCategories: 0,
    activeReservations: 0
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isLibrarian) {
      router.push('/');
    }
  }, [loading, isLibrarian, router]);

  useEffect(() => {
    if (isLibrarian) {
      fetchDashboardData();
    }
  }, [isLibrarian]);

  const fetchDashboardData = async () => {
    try {
      setDataLoading(true);
      const [booksRes, categoriesRes] = await Promise.all([
        booksAPI.getAll(),
        categoriesAPI.getAll()
      ]);

      setStats({
        totalBooks: booksRes.data.length,
        totalUsers: 0, // Will be implemented when users endpoint is ready
        totalCategories: categoriesRes.data.length,
        activeReservations: booksRes.data.filter(b => b.status === 'RESERVED').length
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const quickStats = [
    { label: 'Books Added This Month', value: 0, icon: BookOpen, color: 'from-blue-500 to-blue-600' },
    { label: 'New Users This Month', value: 0, icon: Users, color: 'from-green-500 to-green-600' },
    { label: 'Active Reservations', value: stats.activeReservations, icon: Calendar, color: 'from-purple-500 to-purple-600' },
    { label: 'Returned This Week', value: 0, icon: CheckCircle, color: 'from-orange-500 to-orange-600' }
  ];

  if (loading || !isLibrarian) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <AdminSidebar />
        
        <div className="flex-1 lg:ml-64">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-800 mb-2">Dashboard</h1>
              <p className="text-slate-600 text-lg">Overview of your library system</p>
            </div>

            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border border-slate-200 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-transparent">
                  <CardTitle className="text-sm font-medium text-slate-700">Total Books</CardTitle>
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent className="bg-transparent">
                  <div className="text-3xl font-bold text-slate-800">
                    {dataLoading ? '...' : stats.totalBooks}
                  </div>
                  <Link href="/admin/books" className="text-xs text-blue-600 hover:underline">
                    Manage books →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-transparent">
                  <CardTitle className="text-sm font-medium text-slate-700">Total Users</CardTitle>
                  <Users className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent className="bg-transparent">
                  <div className="text-3xl font-bold text-slate-800">
                    {dataLoading ? '...' : stats.totalUsers}
                  </div>
                  <Link href="/admin/users" className="text-xs text-green-600 hover:underline">
                    Manage users →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 bg-gradient-to-br from-purple-50 to-purple-100">
                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-transparent">
                  <CardTitle className="text-sm font-medium text-slate-700">Categories</CardTitle>
                  <FolderOpen className="h-5 w-5 text-purple-600" />
                </CardHeader>
                <CardContent className="bg-transparent">
                  <div className="text-3xl font-bold text-slate-800">
                    {dataLoading ? '...' : stats.totalCategories}
                  </div>
                  <Link href="/admin/categories" className="text-xs text-purple-600 hover:underline">
                    Manage categories →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 bg-gradient-to-br from-orange-50 to-orange-100">
                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-transparent">
                  <CardTitle className="text-sm font-medium text-slate-700">Active Reservations</CardTitle>
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </CardHeader>
                <CardContent className="bg-transparent">
                  <div className="text-3xl font-bold text-slate-800">
                    {dataLoading ? '...' : stats.activeReservations}
                  </div>
                  <p className="text-xs text-slate-600">Currently borrowed</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Stats */}
              <div className="lg:col-span-2">
                <Card className="border border-slate-200">
                  <CardHeader className="bg-slate-50">
                    <CardTitle className="text-slate-800">Quick Statistics</CardTitle>
                    <CardDescription>Overview of recent library activities</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {quickStats.map((stat, index) => (
                        <div key={index} className={`flex items-center gap-4 p-5 border border-slate-200 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-md`}>
                          <div className="p-3 rounded-xl bg-white/20 backdrop-blur">
                            <stat.icon className="h-7 w-7" />
                          </div>
                          <div>
                            <p className="text-sm font-medium opacity-90">{stat.label}</p>
                            <p className="text-3xl font-bold">{dataLoading ? '...' : stat.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activities */}
              <div>
                <Card className="border border-slate-200">
                  <CardHeader className="bg-slate-50">
                    <CardTitle className="text-slate-800">Recent Activities</CardTitle>
                    <CardDescription>Latest system updates</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <p className="text-slate-500">No recent activities</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <Card className="mt-8 border border-slate-200">
              <CardHeader className="bg-slate-50">
                <CardTitle className="text-slate-800">Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/admin/books">
                    <Button variant="outline" className="w-full h-24 flex flex-col gap-2 border-2 border-blue-200 hover:bg-blue-50">
                      <BookOpen className="h-7 w-7 text-blue-600" />
                      <span className="font-semibold text-slate-700">Manage Books</span>
                    </Button>
                  </Link>
                  <Link href="/admin/categories">
                    <Button variant="outline" className="w-full h-24 flex flex-col gap-2 border-2 border-purple-200 hover:bg-purple-50">
                      <FolderOpen className="h-7 w-7 text-purple-600" />
                      <span className="font-semibold text-slate-700">Manage Categories</span>
                    </Button>
                  </Link>
                  <Link href="/admin/users">
                    <Button variant="outline" className="w-full h-24 flex flex-col gap-2 border-2 border-green-200 hover:bg-green-50">
                      <Users className="h-7 w-7 text-green-600" />
                      <span className="font-semibold text-slate-700">Manage Users</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}