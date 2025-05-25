// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { IEvent } from '@/models/Event';
import EventCard from '@/components/EventCard';
import SearchBar from '@/components/SearchBar';

export default function HomePage() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchEvents(searchTerm);
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  // ✅ Initial fetch on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (search = '') => {
    try {
      setLoading(true);
      console.log('Fetching events for:', search);
      const url = search
        ? `/api/events?search=${encodeURIComponent(search)}`
        : '/api/events';

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setEvents(data.events);
        setFilteredEvents(data.events);
      } else {
        setError(data.error || 'Failed to fetch events');
      }
    } catch (err) {
      setError('Failed to fetch events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchEvents()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Hobby Events
            </h1>
            <p className="text-lg text-gray-600">
              Discover amazing hobby events and workshops in your area
            </p>
          </div>

          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {searchTerm && (
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredEvents.length > 0
                ? `Found ${filteredEvents.length} event${filteredEvents.length === 1 ? '' : 's'} for "${searchTerm}"`
                : `No events found for "${searchTerm}"`}
            </p>
          </div>
        )}

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? 'No events found' : 'No events available'}
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? 'Try adjusting your search terms or browse all events'
                : 'Check back later for new events'}
            </p>
            {searchTerm && (
              <button
                onClick={() => handleSearch('')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                View All Events
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event._id}
                className="transition-all duration-300 opacity-100"
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
