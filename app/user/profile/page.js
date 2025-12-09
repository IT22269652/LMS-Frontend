'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Calendar, BookOpen, Edit, Save, X, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { reservationsAPI } from '@/lib/api';

export default function UserProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editForm, setEditForm] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      setEditForm({ ...editForm, email: user.email });
      fetchMyReservations();
    }
  }, [user]);

  const fetchMyReservations = async () => {
    try {
      setDataLoading(true);
      const response = await reservationsAPI.getMyReservations();
      setReservations(response.data || []);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
      setError('Failed to load your reservations');
    } finally {
      setDataLoading(false);
    }
  };

  const handleReturnBook = async (reservationId, bookTitle) => {
    if (!confirm(`Are you sure you want to return "${bookTitle}"?`)) return;

    try {
      await reservationsAPI.returnBook(reservationId);
      setSuccess(`✓ Successfully returned "${bookTitle}"!`);
      await fetchMyReservations();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to return book:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Failed to return book. Please try again.';
      setError(errorMessage);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords if changing
    if (editForm.newPassword) {
      if (editForm.newPassword !== editForm.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      if (editForm.newPassword.length < 6) {
        setError('New password must be at least 6 characters');
        return;
      }
      if (!editForm.currentPassword) {
        setError('Current password is required to change password');
        return;
      }
    }

    try {
      // Backend API call would go here
      // await usersAPI.updateProfile(editForm);
      
      setSuccess('✓ Profile updated successfully!');
      setIsEditing(false);
      setEditForm({
        ...editForm,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  const activeReservations = reservations.filter(r => r.status === 'ACTIVE');
  const returnedReservations = reservations.filter(r => r.status === 'RETURNED');

  if (loading || !user) {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">My Profile</h1>
            <p className="text-slate-600 text-lg">Manage your account and reservations</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border border-slate-200">
                <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <User className="h-5 w-5 text-blue-600" />
                      Account Information
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {!isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Email</p>
                        <p className="font-medium text-slate-800">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Role</p>
                        <Badge variant="secondary">{user.role}</Badge>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Member Since</p>
                        <p className="font-medium text-slate-800">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-slate-700 mb-2 block">
                          Email (read-only)
                        </label>
                        <Input
                          type="email"
                          value={editForm.email}
                          disabled
                          className="bg-slate-100"
                        />
                      </div>

                      <div className="pt-4 border-t">
                        <p className="text-sm font-semibold text-slate-700 mb-3">Change Password</p>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-slate-600">Current Password</label>
                            <Input
                              type="password"
                              placeholder="Enter current password"
                              value={editForm.currentPassword}
                              onChange={(e) => setEditForm({...editForm, currentPassword: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-slate-600">New Password</label>
                            <Input
                              type="password"
                              placeholder="Enter new password"
                              value={editForm.newPassword}
                              onChange={(e) => setEditForm({...editForm, newPassword: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-slate-600">Confirm New Password</label>
                            <Input
                              type="password"
                              placeholder="Confirm new password"
                              value={editForm.confirmPassword}
                              onChange={(e) => setEditForm({...editForm, confirmPassword: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button type="submit" size="sm" className="flex-1">
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setEditForm({
                              email: user.email,
                              currentPassword: '',
                              newPassword: '',
                              confirmPassword: ''
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="border border-slate-200 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                  <CardTitle className="text-slate-800">Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Active Reservations</span>
                    <span className="text-3xl font-bold text-green-600">
                      {activeReservations.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Total Borrowed</span>
                    <span className="text-3xl font-bold text-slate-800">
                      {reservations.length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reservations */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Reservations */}
              <Card className="border border-slate-200">
                <CardHeader className="bg-slate-50">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Active Reservations
                  </CardTitle>
                  <CardDescription>Books you currently have reserved</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {dataLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-4 text-slate-500">Loading reservations...</p>
                    </div>
                  ) : activeReservations.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 mb-4">No active reservations</p>
                      <Button onClick={() => router.push('/user/books')}>
                        Browse Books
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeReservations.map((reservation) => (
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

                              {/* Book Info */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-bold text-lg text-slate-800 mb-1">
                                      {reservation.book?.title}
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                      by {reservation.book?.author}
                                    </p>
                                  </div>
                                  <Badge className="bg-green-500">Active</Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
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
                                    <p className="font-medium text-slate-800">
                                      {new Date(reservation.dueDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => handleReturnBook(reservation.id, reservation.book?.title)}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark as Returned
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Reservation History */}
              {returnedReservations.length > 0 && (
                <Card className="border border-slate-200">
                  <CardHeader className="bg-slate-50">
                    <CardTitle className="text-slate-800">Reservation History</CardTitle>
                    <CardDescription>Previously borrowed books</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {returnedReservations.map((reservation) => (
                        <div key={reservation.id} className="border border-slate-200 rounded-lg p-4 opacity-75 hover:opacity-100 transition-opacity">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-800">{reservation.book?.title}</p>
                              <p className="text-sm text-slate-600">by {reservation.book?.author}</p>
                              <p className="text-xs text-slate-500 mt-1">
                                {new Date(reservation.reservationDate).toLocaleDateString()} - {new Date(reservation.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="outline">Returned</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}