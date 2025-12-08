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
import { Plus, Edit, Trash2, FolderOpen, AlertCircle } from 'lucide-react';
import { categoriesAPI } from '@/lib/api';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const { isLibrarian, loading } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categoryForm, setCategoryForm] = useState({ name: '' });

  useEffect(() => {
    if (!loading && !isLibrarian) {
      router.push('/');
    }
  }, [loading, isLibrarian, router]);

  useEffect(() => {
    if (isLibrarian) {
      fetchCategories();
    }
  }, [isLibrarian]);

  const fetchCategories = async () => {
    try {
      setDataLoading(true);
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setError('Failed to load categories');
    } finally {
      setDataLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await categoriesAPI.create(categoryForm);
      setSuccess('Category added successfully!');
      setShowAddForm(false);
      setCategoryForm({ name: '' });
      fetchCategories();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to add category:', error);
      setError(error.response?.data?.error || 'Failed to add category');
    }
  };

  const handleEditCategory = async (e)=> {
e.preventDefault();
setError('');
setSuccess('');
try {
  await categoriesAPI.update(editingId, categoryForm);
  setSuccess('Category updated successfully!');
  setEditingId(null);
  setCategoryForm({ name: '' });
  setShowAddForm(false);
  fetchCategories();
  setTimeout(() => setSuccess(''), 3000);
} catch (error) {
  console.error('Failed to update category:', error);
  setError(error.response?.data?.error || 'Failed to update category');
}
};
const handleDeleteCategory = async (categoryId) => {
if (!confirm('Are you sure you want to delete this category?')) return;
try {
  await categoriesAPI.delete(categoryId);
  setSuccess('Category deleted successfully!');
  fetchCategories();
  setTimeout(() => setSuccess(''), 3000);
} catch (error) {
  console.error('Failed to delete category:', error);
  setError(error.response?.data?.error || 'Failed to delete category');
}
};
const startEdit = (category) => {
setEditingId(category.id);
setCategoryForm({ name: category.name });
setShowAddForm(true);
};
const handleCancel = () => {
setShowAddForm(false);
setEditingId(null);
setCategoryForm({ name: '' });
setError('');
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
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Manage Categories</h1>
          <p className="text-slate-600 text-lg">Organize your library books by categories</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add/Edit Category Form */}
          <div className="lg:col-span-1">
            <Card className="border border-slate-200">
              <CardHeader className="bg-gradient-to-br from-purple-50 to-purple-100">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <FolderOpen className="h-6 w-6 text-purple-600" />
                  {editingId ? 'Edit Category' : 'Add Category'}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  {editingId ? 'Update category information' : 'Create a new book category'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={editingId ? handleEditCategory : handleAddCategory} className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Category Name *</label>
                    <Input
                      placeholder="e.g., Science Fiction"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({name: e.target.value})}
                      required
                      className="border-2 border-slate-300"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingId ? 'Update' : 'Add'} Category
                    </Button>
                    {(showAddForm || editingId) && (
                      <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>

                {!showAddForm && !editingId && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setShowAddForm(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Category
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="mt-6 border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-slate-800">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                  <span className="text-slate-600 font-medium">Total Categories</span>
                  <span className="text-3xl font-bold text-slate-800">
                    {dataLoading ? '...' : categories.length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Categories List */}
          <div className="lg:col-span-2">
            <Card className="border border-slate-200">
              <CardHeader className="bg-slate-50">
                <CardTitle className="text-slate-800">All Categories</CardTitle>
                <CardDescription>Manage your book categories</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {dataLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-500">Loading categories...</p>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="inline-block p-6 bg-slate-100 rounded-full mb-4">
                      <FolderOpen className="h-16 w-16 text-slate-400" />
                    </div>
                    <p className="text-slate-600 mb-4">No categories yet</p>
                    <Button onClick={() => setShowAddForm(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Category
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map((category) => (
                      <Card key={category.id} className="border border-slate-200 hover:shadow-lg transition-all">
                        <CardContent className="pt-6 bg-white">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-bold text-xl mb-2 text-slate-800">{category.name}</h3>
                              <Badge variant="secondary">
                                ID: {category.id}
                              </Badge>
                            </div>
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-blue-600 hover:bg-blue-50"
                                onClick={() => startEdit(category)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteCategory(category.id)}
                              >
                                <Trash2 className="h-4 w-4" />
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
          </div>
        </div>
      </div>
    </div>
  </div>
</>
);
}