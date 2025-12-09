'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

export default function BookDetailsPage() {
  const [selectedDays, setSelectedDays] = useState(7);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [reserving, setReserving] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookId = searchParams.get('id');

  // Empty book object - will be fetched from backend using bookId
  const book = null;

  const handleReserve = () => {
    setReserving(true);
    setMessage({ type: '', text: '' });

    // Backend integration needed here
    setTimeout(() => {
      setMessage({ 
        type: 'success', 
        text: `Book reserved successfully for ${selectedDays} days!` 
      });
      setReserving(false);
    }, 1000);
  };

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">Book not found</p>
        <Button onClick={() => router.push('/user/books')}>Back to Books</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        ← Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Book Image */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center mb-4">
                {book.imageUrl ? (
                  <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <BookOpen className="h-24 w-24 text-muted-foreground/50" />
                )}
              </div>
              <Badge variant={book.status === 'AVAILABLE' ? 'success' : 'warning'} className="w-full justify-center py-2">
                {book.status}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Book Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{book.title}</CardTitle>
              <p className="text-xl text-muted-foreground">by {book.author}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {book.description && (
                <div>
                  <p className="text-muted-foreground mb-2">Description</p>
                  <p className="leading-relaxed">{book.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Genre</p>
                  <p className="font-medium">{book.genre || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Language</p>
                  <p className="font-medium">{book.language || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ISBN</p>
                  <p className="font-medium">{book.isbn || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{book.category || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reservation Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Reserve This Book
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {message.text && (
                <div className={`px-4 py-3 rounded-md flex items-start gap-2 ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-destructive/10 text-destructive'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  )}
                  <p className="text-sm">{message.text}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">Reservation Period</label>
                <div className="grid grid-cols-3 gap-3">
                  {[7, 14, 21].map((days) => (
                    <Button
                      key={days}
                      variant={selectedDays === days ? 'default' : 'outline'}
                      onClick={() => setSelectedDays(days)}
                      disabled={book.status !== 'AVAILABLE'}
                    >
                      {days} Days
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleReserve}
                disabled={book.status !== 'AVAILABLE' || reserving}
              >
                {reserving ? 'Reserving...' : `Reserve for ${selectedDays} Days`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}