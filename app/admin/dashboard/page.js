'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, FolderOpen, TrendingUp, Calendar, CheckCircle, AlertCircle, Clock, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { booksAPI, categoriesAPI, usersAPI, reservationsAPI } from '@/lib/api';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLibrarian, loading } = useAuth();
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    reservedBooks: 0,
    totalUsers: 0,
    totalLibrarians: 0,
    totalCategories: 0,
    activeReservations: 0,
    overdueReservations: 0,
    returnedReservations: 0,
    blacklistedUsers: 0
  });
  const [recentReservations, setRecentReservations] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');

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
      setError('');

      // Fetch all data in parallel
      const [booksRes, categoriesRes, usersRes, reservationsRes] = await Promise.all([
        booksAPI.getAll(),
        categoriesAPI.getAll(),
        usersAPI.getAll(),
        reservationsAPI.getAll()
      ]);

      const books = booksRes.data || [];
      const categories = categoriesRes.data || [];
      const users = usersRes.data || [];
      const reservations = reservationsRes.data || [];

      // Calculate statistics
      const availableBooks = books.filter(b => b.status === 'AVAILABLE').length;
      const reservedBooks = books.filter(b => b.status === 'RESERVED').length;
      const totalLibrarians = users.filter(u => u.role === 'LIBRARIAN').length;
      const totalRegularUsers = users.filter(u => u.role === 'USER').length;
      const blacklistedUsers = users.filter(u => u.isBlacklisted).length;
      const activeReservations = reservations.filter(r => r.status === 'ACTIVE').length;
      const returnedReservations = reservations.filter(r => r.status === 'RETURNED').length;
      
      // Calculate overdue reservations
      const overdueReservations = reservations.filter(r => {
        if (r.status !== 'ACTIVE') return false;
        return new Date(r.dueDate) < new Date();
      }).length;

      setStats({
        totalBooks: books.length,
        availableBooks,
        reservedBooks,
        totalUsers: totalRegularUsers,
        totalLibrarians,
        totalCategories: categories.length,
        activeReservations,
        overdueReservations,
        returnedReservations,
        blacklistedUsers
      });

      // Get recent reservations (last 5, sorted by date)
      const sortedReservations = [...reservations]
        .sort((a, b) => new Date(b.reservationDate) - new Date(a.reservationDate))
        .slice(0, 5);
      setRecentReservations(sortedReservations);

      // Get recent users (last 5, sorted by creation date)
      const sortedUsers = [...users]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentUsers(sortedUsers);

      // Get recently added books (last 3)
      const sortedBooks = [...books]
        .slice(-3)
        .reverse();
      setRecentBooks(sortedBooks);

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setDataLoading(false);
    }
  };

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
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-800 mb-2">Dashboard</h1>
              <p className="text-slate-600 text-lg">Complete overview of your library system</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border border-slate-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-transparent">
                  <CardTitle className="text-sm font-medium text-slate-700">Total Books</CardTitle>
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent className="bg-transparent">
                  <div className="text-3xl font-bold text-slate-800">
                    {dataLoading ? '...' : stats.totalBooks}
                  </div>
                  <div className="mt-2 text-xs text-slate-600">
                    <span className="text-green-600 font-semibold">{stats.availableBooks} Available</span>
                    {' • '}
                    <span className="text-orange-600 font-semibold">{stats.reservedBooks} Reserved</span>
                  </div>
                  <Link href="/admin/books" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                    Manage books →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-transparent">
                  <CardTitle className="text-sm font-medium text-slate-700">Total Users</CardTitle>
                  <Users className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent className="bg-transparent">
                  <div className="text-3xl font-bold text-slate-800">
                    {dataLoading ? '...' : stats.totalUsers}
                  </div>
                  <div className="mt-2 text-xs text-slate-600">
                    <span className="text-purple-600 font-semibold">{stats.totalLibrarians} Librarians</span>
                    {stats.blacklistedUsers > 0 && (
                      <>
                        {' • '}
                        <span className="text-red-600 font-semibold">{stats.blacklistedUsers} Blacklisted</span>
                      </>
                    )}
                  </div>
                  <Link href="/admin/users" className="text-xs text-green-600 hover:underline mt-2 inline-block">
                    Manage users →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-transparent">
                  <CardTitle className="text-sm font-medium text-slate-700">Active Reservations</CardTitle>
                  <Calendar className="h-5 w-5 text-purple-600" />
                </CardHeader>
                <CardContent className="bg-transparent">
                  <div className="text-3xl font-bold text-slate-800">
                    {dataLoading ? '...' : stats.activeReservations}
                  </div>
                  <div className="mt-2 text-xs text-slate-600">
                    {stats.overdueReservations > 0 ? (
                      <span className="text-red-600 font-semibold">⚠ {stats.overdueReservations} Overdue</span>
                    ) : (
                      <span className="text-green-600 font-semibold">✓ All on time</span>
                    )}
                  </div>
                  <Link href="/admin/reservations" className="text-xs text-purple-600 hover:underline mt-2 inline-block">
                    View all →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-transparent">
                  <CardTitle className="text-sm font-medium text-slate-700">Categories</CardTitle>
                  <FolderOpen className="h-5 w-5 text-orange-600" />
                </CardHeader>
                <CardContent className="bg-transparent">
                  <div className="text-3xl font-bold text-slate-800">
                    {dataLoading ? '...' : stats.totalCategories}
                  </div>
                  <div className="mt-2 text-xs text-slate-600">
                    <span>Book categories</span>
                  </div>
                  <Link href="/admin/categories" className="text-xs text-orange-600 hover:underline mt-2 inline-block">
                    Manage categories →
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="border border-slate-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-green-100">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Books Returned</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {dataLoading ? '...' : stats.returnedReservations}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-orange-100">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Currently Borrowed</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {dataLoading ? '...' : stats.reservedBooks}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-blue-100">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Available Books</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {dataLoading ? '...' : stats.availableBooks}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${stats.overdueReservations > 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
                      <AlertCircle className={`h-6 w-6 ${stats.overdueReservations > 0 ? 'text-red-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Overdue Books</p>
                      <p className={`text-2xl font-bold ${stats.overdueReservations > 0 ? 'text-red-600' : 'text-slate-800'}`}>
                        {dataLoading ? '...' : stats.overdueReservations}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Reservations */}
              <div className="lg:col-span-2">
                <Card className="border border-slate-200">
                  <CardHeader className="bg-slate-50">
                    <CardTitle className="text-slate-800">Recent Reservations</CardTitle>
                    <CardDescription>Latest book reservations from users</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {dataLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-slate-500 text-sm">Loading reservations...</p>
                      </div>
                    ) : recentReservations.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No reservations yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentReservations.map((reservation) => {
                          const isOverdue = reservation.status === 'ACTIVE' && new Date(reservation.dueDate) < new Date();
                          
                          return (
                            <div key={reservation.id} className="flex items-center gap-4 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                              {/* Book Image */}
                              <div className="w-12 h-16 flex-shrink-0 bg-slate-200 rounded overflow-hidden">
                                {reservation.book?.imageUrl ? (
                                  <img
                                    src={`http://localhost:8080${reservation.book.imageUrl}`}
                                    alt={reservation.book.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="h-6 w-6 text-slate-400" />
                                  </div>
                                )}
                              </div>

                              {/* Reservation Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-800 text-sm truncate">
                                  {reservation.book?.title}
                                </h4>
                                <p className="text-xs text-slate-600 truncate">
                                  by {reservation.user?.email}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-slate-500">
                                    Due: {new Date(reservation.dueDate).toLocaleDateString()}
                                  </span>
                                  {isOverdue && (
                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                      OVERDUE
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Status Badge */}
                              <div>
                                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                  reservation.status === 'ACTIVE' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {reservation.status}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {recentReservations.length > 0 && (
                      <div className="mt-4 text-center">
                        <Link href="/admin/reservations">
                          <Button variant="outline" size="sm">
                            View All Reservations →
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Users & Books */}
              <div className="space-y-6">
                {/* Recent Users */}
                <Card className="border border-slate-200">
                  <CardHeader className="bg-slate-50">
                    <CardTitle className="text-slate-800">Recent Users</CardTitle>
                    <CardDescription>Newly registered members</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {dataLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      </div>
                    ) : recentUsers.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-slate-500 text-sm">No users yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {recentUsers.map((user) => (
                          <div key={user.id} className="flex items-center gap-3 p-2 border border-slate-200 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <Users className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800 truncate">
                                {user.email}
                              </p>
                              <p className="text-xs text-slate-500">
                                {user.role}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {recentUsers.length > 0 && (
                      <div className="mt-3">
                        <Link href="/admin/users">
                          <Button variant="outline" size="sm" className="w-full">
                            View All Users
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Books */}
                <Card className="border border-slate-200">
                  <CardHeader className="bg-slate-50">
                    <CardTitle className="text-slate-800">Recently Added</CardTitle>
                    <CardDescription>Latest books in collection</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {dataLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      </div>
                    ) : recentBooks.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-slate-500 text-sm">No books yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentBooks.map((book) => (
                          <div key={book.id} className="flex items-center gap-3 p-2 border border-slate-200 rounded-lg">
                            <div className="w-10 h-14 flex-shrink-0 bg-slate-200 rounded overflow-hidden">
                              {book.imageUrl ? (
                                <img
                                  src={`http://localhost:8080${book.imageUrl}`}
                                  alt={book.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon className="h-5 w-5 text-slate-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800 truncate">
                                {book.title}
                              </p>
                              <p className="text-xs text-slate-600 truncate">
                                {book.author}
                              </p>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                book.status === 'AVAILABLE' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-orange-100 text-orange-700'
                              }`}>
                                {book.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Link href="/admin/books">
                    <Button variant="outline" className="w-full h-24 flex flex-col gap-2 border-2 border-blue-200 hover:bg-blue-50">
                      <BookOpen className="h-7 w-7 text-blue-600" />
                      <span className="font-semibold text-slate-700">Manage Books</span>
                    </Button>
                  </Link>
                  <Link href="/admin/categories">
                    <Button variant="outline" className="w-full h-24 flex flex-col gap-2 border-2 border-purple-200 hover:bg-purple-50">
                      <FolderOpen className="h-7 w-7 text-purple-600" />
                      <span className="font-semibold text-slate-700">Categories</span>
                    </Button>
                  </Link>
                  <Link href="/admin/reservations">
                    <Button variant="outline" className="w-full h-24 flex flex-col gap-2 border-2 border-orange-200 hover:bg-orange-50">
                      <Calendar className="h-7 w-7 text-orange-600" />
                      <span className="font-semibold text-slate-700">Reservations</span>
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