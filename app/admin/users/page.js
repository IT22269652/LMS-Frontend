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
import { Search, Ban, UserCheck, Mail, Calendar, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { usersAPI } from '@/lib/api';

export default function AdminUsersPage() {
  const router = useRouter();
  const { isLibrarian, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [users, setUsers] = useState([]);
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
      fetchUsers();
    }
  }, [isLibrarian]);

  const fetchUsers = async () => {
    try {
      setDataLoading(true);
      const response = await usersAPI.getAll();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Failed to load users');
    } finally {
      setDataLoading(false);
    }
  };

  const handleBlacklist = async (userId, userEmail, isBlacklisted) => {
    const action = isBlacklisted ? 'unblacklist' : 'blacklist';
    if (!confirm(`Are you sure you want to ${action} ${userEmail}?`)) return;

    try {
      if (isBlacklisted) {
        await usersAPI.unblacklist(userId);
      } else {
        await usersAPI.blacklist(userId);
      }
      setSuccess(`✓ Successfully ${action}ed ${userEmail}!`);
      await fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      setError(error.response?.data?.error || `Failed to ${action} user`);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (!confirm(`Are you sure you want to DELETE ${userEmail}? This action cannot be undone!`)) return;

    try {
      await usersAPI.delete(userId);
      setSuccess(`✓ Successfully deleted user ${userEmail}!`);
      await fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to delete user:', error);
      setError(error.response?.data?.error || 'Failed to delete user');
      setTimeout(() => setError(''), 5000);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    const matchesStatus = filterStatus === 'ALL' || 
      (filterStatus === 'ACTIVE' && !user.isBlacklisted) ||
      (filterStatus === 'BLACKLISTED' && user.isBlacklisted);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    users: users.filter(u => u.role === 'USER').length,
    librarians: users.filter(u => u.role === 'LIBRARIAN').length,
    blacklisted: users.filter(u => u.isBlacklisted).length
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
              <h1 className="text-4xl font-bold text-slate-800 mb-2">Manage Users</h1>
              <p className="text-slate-600 text-lg">View and manage library members and administrators</p>
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
                  <CardTitle className="text-sm font-medium text-slate-700">Total Users</CardTitle>
                </CardHeader>
                <CardContent className="bg-transparent">
                  <div className="text-4xl font-bold text-slate-800">
                    {dataLoading ? '...' : stats.total}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader className="pb-3 bg-transparent">
                  <CardTitle className="text-sm font-medium text-slate-700">Members</CardTitle>
                </CardHeader>
                <CardContent className="bg-transparent">
                  <div className="text-4xl font-bold text-slate-800">
                    {dataLoading ? '...' : stats.users}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 bg-gradient-to-br from-purple-50 to-purple-100">
                <CardHeader className="pb-3 bg-transparent">
                  <CardTitle className="text-sm font-medium text-slate-700">Librarians</CardTitle>
                </CardHeader>
                <CardContent className="bg-transparent">
                  <div className="text-4xl font-bold text-slate-800">
                    {dataLoading ? '...' : stats.librarians}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 bg-gradient-to-br from-red-50 to-red-100">
                <CardHeader className="pb-3 bg-transparent">
                  <CardTitle className="text-sm font-medium text-slate-700">Blacklisted</CardTitle>
                </CardHeader>
                <CardContent className="bg-transparent">
                  <div className="text-4xl font-bold text-red-600">
                    {dataLoading ? '...' : stats.blacklisted}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6 border border-slate-200">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Search Users</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        placeholder="Search by email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 border-2 border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Filter by Role</label>
                    <select
                      className="flex h-10 w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2 text-sm"
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                    >
                      <option value="ALL">All Roles</option>
                      <option value="USER">Users</option>
                      <option value="LIBRARIAN">Librarians</option>
                    </select>
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
                      <option value="BLACKLISTED">Blacklisted</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card className="border border-slate-200">
              <CardHeader className="bg-slate-50">
                <CardTitle className="text-slate-800">Users List ({filteredUsers.length})</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {dataLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-500">Loading users...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-500">No users found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <Card key={user.id} className="border border-slate-200 hover:shadow-lg transition-all">
                        <CardContent className="pt-6 bg-white">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="font-bold text-lg text-slate-800">{user.email}</h3>
                                <Badge variant={user.role === 'LIBRARIAN' ? 'default' : 'secondary'}>
                                  {user.role}
                                </Badge>
                                {user.isBlacklisted && (
                                  <Badge variant="destructive">Blacklisted</Badge>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-blue-500" />
                                  <span>Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-purple-500" />
                                  <span>ID: {user.id}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              {user.role === 'USER' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant={user.isBlacklisted ? 'outline' : 'destructive'}
                                    onClick={() => handleBlacklist(user.id, user.email, user.isBlacklisted)}
                                  >
                                    {user.isBlacklisted ? (
                                      <>
                                        <UserCheck className="mr-2 h-4 w-4" />
                                        Unblacklist
                                      </>
                                    ) : (
                                      <>
                                        <Ban className="mr-2 h-4 w-4" />
                                        Blacklist
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteUser(user.id, user.email)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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