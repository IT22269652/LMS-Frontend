'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Search, X, AlertCircle, CheckCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { booksAPI, categoriesAPI, filesAPI } from '@/lib/api';

export default function AdminBooksPage() {
  const router = useRouter();
  const { isLibrarian, loading } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    genre: '',
    language: '',
    isbn: '',
    categoryId: '',
    imageUrl: '',
    status: 'AVAILABLE'
  });

  useEffect(() => {
    if (!loading && !isLibrarian) {
      router.push('/');
    }
  }, [loading, isLibrarian, router]);

  useEffect(() => {
    if (isLibrarian) {
      fetchData();
    }
  }, [isLibrarian]);

  const fetchData = async () => {
    try {
      setDataLoading(true);
      const [booksRes, categoriesRes] = await Promise.all([
        booksAPI.getAll(),
        categoriesAPI.getAll()
      ]);
      
      console.log('📚 Books loaded:', booksRes.data);
      console.log('📁 Categories loaded:', categoriesRes.data);
      
      setBooks(booksRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('❌ Failed to fetch data:', error);
      setError('Failed to load data. Please refresh the page.');
    } finally {
      setDataLoading(false);
    }
  };

  const filteredBooks = books.filter(book =>
    book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile) return null;

    try {
      setUploadingImage(true);
      const response = await filesAPI.upload(selectedFile);
      console.log('✓ Image uploaded:', response.data);
      return response.data; // Returns the image URL
    } catch (error) {
      console.error('❌ Failed to upload image:', error);
      throw new Error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      // Upload image first if selected
      let imageUrl = bookForm.imageUrl;
      if (selectedFile) {
        imageUrl = await handleUploadImage();
      }

      const bookData = {
        ...bookForm,
        imageUrl: imageUrl || null,
      };

      console.log('📤 Sending book data:', bookData);
      const response = await booksAPI.create(bookData);
      console.log('✓ Book created:', response.data);
      
      setSuccess(`✓ Book "${bookForm.title}" added successfully!`);
      setShowAddForm(false);
      resetForm();
      await fetchData();
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      console.error('❌ Failed to add book:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message ||
                          'Failed to add book. Please try again.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditBook = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      // Upload new image if selected
      let imageUrl = bookForm.imageUrl;
      if (selectedFile) {
        imageUrl = await handleUploadImage();
      }

      const bookData = {
        ...bookForm,
        imageUrl: imageUrl || null,
      };

      console.log('📤 Updating book:', bookData);
      const response = await booksAPI.update(editingBook.id, bookData);
      console.log('✓ Book updated:', response.data);
      
      setSuccess(`✓ Book "${bookForm.title}" updated successfully!`);
      setEditingBook(null);
      setShowAddForm(false);
      resetForm();
      await fetchData();
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      console.error('❌ Failed to update book:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Failed to update book. Please try again.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBook = async (bookId, bookTitle) => {
    if (!confirm(`Are you sure you want to delete "${bookTitle}"?`)) return;

    try {
      await booksAPI.delete(bookId);
      setSuccess(`✓ Book "${bookTitle}" deleted successfully!`);
      await fetchData();
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      console.error('❌ Failed to delete book:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Failed to delete book. Please try again.';
      setError(errorMessage);
    }
  };

  const handleStatusChange = async (bookId, bookTitle, newStatus) => {
    try {
      await booksAPI.updateStatus(bookId, newStatus);
      setSuccess(`✓ Status updated to "${newStatus}" for "${bookTitle}"!`);
      await fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('❌ Failed to update status:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Failed to update status. Please try again.';
      setError(errorMessage);
    }
  };

  const startEdit = (book) => {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      author: book.author,
      genre: book.genre || '',
      language: book.language || '',
      isbn: book.isbn || '',
      categoryId: book.category?.id?.toString() || '',
      imageUrl: book.imageUrl || '',
      status: book.status
    });
    setImagePreview(book.imageUrl || null);
    setSelectedFile(null);
    setShowAddForm(true);
    setError('');
    setSuccess('');
  };

  const resetForm = () => {
    setBookForm({
      title: '',
      author: '',
      genre: '',
      language: '',
      isbn: '',
      categoryId: '',
      imageUrl: '',
      status: 'AVAILABLE'
    });
    setImagePreview(null);
    setSelectedFile(null);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingBook(null);
    resetForm();
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
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-slate-800 mb-2">Manage Books</h1>
                <p className="text-slate-600 text-lg">Add, edit, and manage your library's book collection</p>
              </div>
              <Button onClick={() => setShowAddForm(true)} className="shadow-lg">
                <Plus className="mr-2 h-5 w-5" />
                Add Book
              </Button>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 shadow-md animate-in slide-in-from-top-2">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <p className="font-medium">{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2 shadow-md animate-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Search */}
            <Card className="mb-6 border border-slate-200">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="Search books by title or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 text-lg border-slate-300"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dataLoading ? (
                <div className="col-span-full text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-slate-500">Loading books...</p>
                </div>
              ) : filteredBooks.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-500 mb-4">No books available</p>
                  <Button onClick={() => setShowAddForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Book
                  </Button>
                </div>
              ) : (
                filteredBooks.map((book) => (
                  <Card key={book.id} className="border border-slate-200 hover:shadow-xl transition-all overflow-hidden">
                    {/* Book Image */}
                    <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200">
                      {book.imageUrl ? (
                        <img
                          src={`http://localhost:8080${book.imageUrl}`}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-16 w-16 text-slate-400" />
                        </div>
                      )}
                      {/* Status Badge */}
                      <div className="absolute top-2 right-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          book.status === 'AVAILABLE' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-orange-500 text-white'
                        }`}>
                          {book.status}
                        </span>
                      </div>
                    </div>

                    {/* Book Details */}
                    <CardContent className="pt-4">
                      <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2">{book.title}</h3>
                      <p className="text-sm text-slate-600 mb-3">by {book.author}</p>
                      
                      <div className="space-y-2 mb-4">
                        {book.category && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              {book.category.name}
                            </span>
                          </div>
                        )}
                        {book.genre && (
                          <p className="text-xs text-slate-500">Genre: {book.genre}</p>
                        )}
                        {book.isbn && (
                          <p className="text-xs text-slate-500 font-mono">ISBN: {book.isbn}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => startEdit(book)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteBook(book.id, book.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Status Change */}
                      <div className="mt-3">
                        <select 
                          className="w-full text-sm border-2 border-slate-300 rounded-lg px-3 py-2 bg-white"
                          value={book.status}
                          onChange={(e) => handleStatusChange(book.id, book.title, e.target.value)}
                        >
                          <option value="AVAILABLE">Mark as Available</option>
                          <option value="RESERVED">Mark as Reserved</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Book Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-4xl my-8 border-2 border-slate-300 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">
                  {editingBook ? 'Edit Book' : 'Add New Book'}
                </CardTitle>
                <button
                  onClick={cancelForm}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  type="button"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <CardDescription className="text-blue-100">
                {editingBook ? 'Update book details' : 'Fill in the details to add a new book'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6 max-h-[70vh] overflow-y-auto">
              <form onSubmit={editingBook ? handleEditBook : handleAddBook} className="space-y-6">
                {/* Image Upload Section */}
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 bg-slate-50">
                  <label className="text-sm font-semibold text-slate-700 mb-3 block">
                    Book Cover Image
                  </label>
                  
                  {imagePreview ? (
                    <div className="relative w-full h-64 mb-4">
                      <img
                        src={imagePreview.startsWith('http') ? imagePreview : imagePreview}
                        alt="Preview"
                        className="w-full h-full object-contain rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setSelectedFile(null);
                          setBookForm({...bookForm, imageUrl: ''});
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                      <ImageIcon className="h-20 w-20 text-slate-300" />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
                        <Upload className="h-4 w-4" />
                        Choose Image
                      </div>
                    </label>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Supported formats: JPG, PNG, GIF (Max 5MB)
                  </p>
                </div>

                {/* Book Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Book title"
                      value={bookForm.title}
                      onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
                      required
                      className="border-2 border-slate-300"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Author <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Author name"
                      value={bookForm.author}
                      onChange={(e) => setBookForm({...bookForm, author: e.target.value})}
                      required
                      className="border-2 border-slate-300"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="flex h-10 w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={bookForm.categoryId}
                      onChange={(e) => {
                        console.log('Selected category ID:', e.target.value);
                        setBookForm({...bookForm, categoryId: e.target.value});
                      }}
                      required
                    >
                      <option value="">-- Select Category --</option>
                      {categories && categories.length > 0 ? (
                        categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>No categories available</option>
                      )}
                    </select>
                    {(!categories || categories.length === 0) && (
                      <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Please add categories first from Categories page
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Genre</label>
                    <Input
                      placeholder="e.g., Fiction, Science"
                      value={bookForm.genre}
                      onChange={(e) => setBookForm({...bookForm, genre: e.target.value})}
                      className="border-2 border-slate-300"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Language</label>
                    <Input
                      placeholder="e.g., English"
                      value={bookForm.language}
                      onChange={(e) => setBookForm({...bookForm, language: e.target.value})}
                      className="border-2 border-slate-300"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">ISBN</label>
                    <Input
                      placeholder="13-digit ISBN"
                      value={bookForm.isbn}
                      onChange={(e) => setBookForm({...bookForm, isbn: e.target.value})}
                      className="border-2 border-slate-300"
                      maxLength={13}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Status</label>
                    <select
                      className="flex h-10 w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2 text-sm"
                      value={bookForm.status}
                      onChange={(e) => setBookForm({...bookForm, status: e.target.value})}
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="RESERVED">Reserved</option>
                    </select>
                  </div>
                </div>
                
                {/* Form Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={submitting || uploadingImage || (!categories || categories.length === 0)}
                  >
                    {submitting || uploadingImage ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {uploadingImage ? 'Uploading Image...' : (editingBook ? 'Updating...' : 'Adding...')}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {editingBook ? 'Update Book' : 'Add Book'}
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={cancelForm} 
                    className="flex-1"
                    disabled={submitting || uploadingImage}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}