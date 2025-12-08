'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, Calendar, CheckCircle, AlertCircle, Image as ImageIcon, Filter } from 'lucide-react';
import { booksAPI, categoriesAPI, reservationsAPI } from '@/lib/api';

export default function UserBooksPage() {
  const router = useRouter();
  const { user, isUser, loading } = useAuth();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reservingBookId, setReservingBookId] = useState(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
const [selectedBook, setSelectedBook] = useState(null);
const [reservationDays, setReservationDays] = useState(7);
useEffect(() => {
if (!loading && !user) {
router.push('/login');
}
}, [loading, user, router]);
useEffect(() => {
if (user) {
fetchData();
}
}, [user]);
const fetchData = async () => {
try {
setDataLoading(true);
const [booksRes, categoriesRes] = await Promise.all([
booksAPI.getAll(),
categoriesAPI.getAll()
]);
  setBooks(booksRes.data || []);
  setCategories(categoriesRes.data || []);
} catch (error) {
  console.error('Failed to fetch data:', error);
  setError('Failed to load books. Please refresh the page.');
} finally {
  setDataLoading(false);
}
};
// Get unique languages from books
const languages = [...new Set(books.map(book => book.language).filter(Boolean))];
const filteredBooks = books.filter(book => {
const matchesSearch =
book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
book.genre?.toLowerCase().includes(searchQuery.toLowerCase());
const matchesCategory = !selectedCategory || book.category?.id?.toString() === selectedCategory;
const matchesLanguage = !selectedLanguage || book.language === selectedLanguage;

return matchesSearch && matchesCategory && matchesLanguage;
});
const availableBooks = filteredBooks.filter(book => book.status === 'AVAILABLE');
const openReservationModal = (book) => {
setSelectedBook(book);
setShowReservationModal(true);
setReservationDays(7);
};
const closeReservationModal = () => {
setSelectedBook(null);
setShowReservationModal(false);
setReservationDays(7);
};
const handleReserveBook = async () => {
if (!selectedBook) return;
try {
  setReservingBookId(selectedBook.id);
  setError('');

  const reservationData = {
    bookId: selectedBook.id,
    days: reservationDays
  };

  await reservationsAPI.create(reservationData);
  
  setSuccess(`✓ Successfully reserved "${selectedBook.title}" for ${reservationDays} days!`);
  closeReservationModal();
  await fetchData();
  
  setTimeout(() => setSuccess(''), 5000);
} catch (error) {
  console.error('Failed to reserve book:', error);
  const errorMessage = error.response?.data?.error || 
                      error.response?.data?.message || 
                      'Failed to reserve book. Please try again.';
  setError(errorMessage);
  setTimeout(() => setError(''), 5000);
} finally {
  setReservingBookId(null);
}
};
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
<h1 className="text-4xl font-bold text-slate-800 mb-2">Browse Books</h1>
<p className="text-slate-600 text-lg">Discover and reserve books from our collection</p>
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

      {/* Filters */}
      <Card className="mb-6 border border-slate-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                <Search className="inline h-4 w-4 mr-1" />
                Search Books
              </label>
              <Input
                placeholder="Search by title, author, or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-2 border-slate-300"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                <Filter className="inline h-4 w-4 mr-1" />
                Category
              </label>
              <select
                className="flex h-10 w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2 text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Language</label>
              <select
                className="flex h-10 w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2 text-sm"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="">All Languages</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex gap-4 text-sm text-slate-600">
            <span>Total Books: <strong>{books.length}</strong></span>
            <span>Available: <strong className="text-green-600">{availableBooks.length}</strong></span>
            <span>Showing: <strong>{filteredBooks.length}</strong></span>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dataLoading ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-500">Loading books...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-2">No books found</p>
            <p className="text-sm text-slate-400">Try adjusting your filters</p>
          </div>
        ) : (
          filteredBooks.map((book) => (
            <Card key={book.id} className="border border-slate-200 hover:shadow-xl transition-all overflow-hidden group">
              {/* Book Image */}
              <div className="relative h-56 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                {book.imageUrl ? (
                  <img
                    src={`http://localhost:8080${book.imageUrl}`}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-20 w-20 text-slate-300" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                    book.status === 'AVAILABLE' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {book.status}
                  </span>
                </div>

                {/* Category Badge */}
                {book.category && (
                  <div className="absolute top-2 left-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500 text-white shadow-lg">
                      {book.category.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Book Details */}
              <CardContent className="pt-4">
                <h3 className="font-bold text-lg text-slate-800 mb-1 line-clamp-2 h-14">
                  {book.title}
                </h3>
                <p className="text-sm text-slate-600 mb-3">by {book.author}</p>
                
                <div className="space-y-1 mb-4 text-xs text-slate-500">
                  {book.genre && (
                    <p><strong>Genre:</strong> {book.genre}</p>
                  )}
                  {book.language && (
                    <p><strong>Language:</strong> {book.language}</p>
                  )}
                  {book.isbn && (
                    <p className="font-mono"><strong>ISBN:</strong> {book.isbn}</p>
                  )}
                </div>

                {/* Reserve Button */}
                <Button 
                  className="w-full"
                  disabled={book.status !== 'AVAILABLE' || reservingBookId === book.id}
                  onClick={() => openReservationModal(book)}
                >
                  {reservingBookId === book.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Reserving...
                    </>
                  ) : book.status === 'AVAILABLE' ? (
                    <>
                      <Calendar className="mr-2 h-4 w-4" />
                      Reserve Book
                    </>
                  ) : (
                    'Not Available'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  </div>

  {/* Reservation Modal */}
  {showReservationModal && selectedBook && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-2 border-slate-300 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="text-xl">Reserve Book</CardTitle>
          <CardDescription className="text-blue-100">
            Choose your reservation period
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6">
            <div className="flex gap-4 mb-4">
              {selectedBook.imageUrl ? (
                <img
                  src={`http://localhost:8080${selectedBook.imageUrl}`}
                  alt={selectedBook.title}
                  className="w-20 h-28 object-cover rounded"
                />
              ) : (
                <div className="w-20 h-28 bg-slate-200 rounded flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-slate-400" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 mb-1">{selectedBook.title}</h3>
                <p className="text-sm text-slate-600">{selectedBook.author}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-3 block">
                Select Reservation Period
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[7, 14, 21].map(days => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setReservationDays(days)}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      reservationDays === days
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-300 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-2xl font-bold">{days}</div>
                    <div className="text-xs">days</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Due Date:</strong> {new Date(Date.now() + reservationDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleReserveBook}
              className="flex-1"
              disabled={reservingBookId === selectedBook.id}
            >
              {reservingBookId === selectedBook.id ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Reserving...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm Reservation
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={closeReservationModal}
              className="flex-1"
              disabled={reservingBookId === selectedBook.id}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )}
</>
);
}