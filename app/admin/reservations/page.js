'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, BookOpen, User, CheckCircle, AlertCircle, Trash2, Image as ImageIcon } from 'lucide-react';
import { reservationsAPI } from '@/lib/api';

export default function AdminReservationsPage() {
  const router = useRouter();
  const { isLibrarian, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [reservations, setReservations] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!loading && !isLibrarian) {
      router.push('/');
    }
  }, [loading, isLibrarian, router]);

  useEffect(() => {
    if (isLibrarian) {
      fetchReservations();
    }
  }, [isLibrarian]);

  const fetchReservations = async () => {
    try {
      setDataLoading(true);
      const response = await reservationsAPI.getAll();
      setReservations(response.data || []);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
      setError('Failed to load reservations');
    } finally {
      setDataLoading(false);
    }
  };

  const handleReturnBook = async (reservationId, bookTitle) => {
    if (!confirm(`Mark "${bookTitle}" as returned?`)) return;

    try {
      await reservationsAPI.returnBook(reservationId);
      setSuccess(`✓ Successfully marked "${bookTitle}" as returned!`);
      await fetchReservations();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to return book:', error);
      setError(error.response?.data?.error || 'Failed to return book');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleDeleteReservation = async (reservationId, bookTitle) => {
    if (!confirm(`Delete reservation for "${bookTitle}"? This action cannot be undone!`)) return;

    try {
      await reservationsAPI.delete(reservationId);
      setSuccess(`✓ Successfully deleted reservation!`);
      await fetchReservations();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to delete reservation:', error);
      setError(error.response?.data?.error || 'Failed to delete reservation');
      setTimeout(() => setError(''), 5000);
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.book?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || reservation.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: reservations.length,
    active: reservations.filter(r => r.status === 'ACTIVE').length,
    returned: reservations.filter(r => r.status === 'RETURNED').length,
    overdue: reservations.filter(r => {
      if (r.status !== 'ACTIVE') return false;
      return new Date(r.dueDate) < new Date();
    }).length
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
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-800 mb-2">Manage Reservations</h1>
              <p className="text-slate-600 text-lg">View and manage all book reservations</p>
            </div>

            {/* Messages */}
            {success && (
              <div className="mb-6 bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <p className="font-medium">{success}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="border border-slate-200 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader className="pb-3 bg-transparent">
                  <CardTitle className="text-sm font-medium text-slate-700">Total Reservations</CardTitle>
                </CardHeader>
                <CardContent className="bg-transparent">
                  <div className="text-4xl font-bold text-slate-800">
                    {dataLoading ? '...' : stats.total}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader className="pb-3 bg-transparent">
                  <CardTitle className="text-sm font-medium text-slate-700">Active</CardTitle>
                </CardHeader>
                <CardContent className="bg-transparent">
                  <div className="text-4xl font-bold text-green-600">
                    {dataLoading ? '...' : stats.active}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 bg-gradient-to-br from-orange-50 to-orange-100">
                <CardHeader className="pb-3 bg-transparent">
                  <CardTitle className="text-sm font-medium text-slate-700">Overdue</CardTitle>
                </CardHeader>
                <CardContent className="bg-transparent">
                  <div className="text-4xl font-bold text-orange-600">
                    {dataLoading ? '...' : stats.overdue}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 bg-gradient-to-br from-purple-50 to-purple-100">
                <CardHeader className="pb-3 bg-transparent">
                  <CardTitle className="text-sm font-medium text-slate-700">Returned</CardTitle>
                </CardHeader>
                <CardContent className="bg-transparent">
                  <div className="text-4xl font-bold text-purple-600">
                    {dataLoading ? '...' : stats.returned}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6 border border-slate-200">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        placeholder="Search by book title or user email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 border-2 border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Filter by Status</label>
                    <select
                      className="flex h-10 w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2 text-sm"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="ALL">All Status</option>
                      <option value="ACTIVE">Active</option>
                      <option value="RETURNED">Returned</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reservations List */}
            <Card className="border border-slate-200">
              <CardHeader className="bg-slate-50">
                <CardTitle className="text-slate-800">All Reservations ({filteredReservations.length})</CardTitle>
                <CardDescription>Complete list of all book reservations</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {dataLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-500">Loading reservations...</p>
                  </div>
                ) : filteredReservations.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No reservations found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredReservations.map((reservation) => {
                      const isOverdue = reservation.status === 'ACTIVE' && new Date(reservation.dueDate) < new Date();
                      
                      return (
                        <Card key={reservation.id} className="border border-slate-200 hover:shadow-lg transition-all">
                          <CardContent className="pt-6">
                            <div className="flex gap-4">
                              {/* Book Image */}
                              <div className="w-20 h-28 flex-shrink-0 bg-slate-200 rounded overflow-hidden">
                                {reservation.book?.imageUrl ? (
                                  <img
                                    src={`http://localhost:8080${reservation.book.imageUrl}`}
                                    alt={reservation.book.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="h-8 w-8 text-slate-400" />
                                  </div>
                                )}
                              </div>

                              {/* Reservation Info */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h3 className="font-bold text-lg text-slate-800 mb-1">
                                      {reservation.book?.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 mb-2">
                                      by {reservation.book?.author}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                      <User className="h-4 w-4 text-blue-500" />
                                      <span>{reservation.user?.email}</span>
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <Badge 
                                      variant={
                                        isOverdue ? 'destructive' : 
                                        reservation.status === 'ACTIVE' ? 'default' : 
                                        'secondary'
                                      }
                                    >
                                      {isOverdue ? 'OVERDUE' : reservation.status}
                                    </Badge>
                                    <Badge variant="outline">ID: {reservation.id}</Badge>
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                                  <div>
                                    <p className="text-slate-600 flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Reserved
                                    </p>
                                    <p className="font-medium text-slate-800">
                                      {new Date(reservation.reservationDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-slate-600 flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Due Date
                                    </p>
                                    <p className={`font-medium ${isOverdue ? 'text-red-600' : 'text-slate-800'}`}>
                                      {new Date(reservation.dueDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-slate-600">Duration</p>
                                    <p className="font-medium text-slate-800">
                                      {Math.ceil((new Date(reservation.dueDate) - new Date(reservation.reservationDate)) / (1000 * 60 * 60 * 24))} days
                                    </p>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  {reservation.status === 'ACTIVE' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleReturnBook(reservation.id, reservation.book?.title)}
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Mark as Returned
                                    </Button>
                                  )}
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteReservation(reservation.id, reservation.book?.title)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}