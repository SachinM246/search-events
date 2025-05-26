'use client';

import { useState, useEffect, useMemo } from 'react';
import { IEvent } from '@/models/Event';
import EventCard from '@/components/EventCard';
import SearchBar from '@/components/SearchBar';

export default function HomePage() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchTerm !== '') {
        fetchEvents(searchTerm);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (search = '') => {
    try {
      if (search) {
        setSearchLoading(true);
      } else {
        setLoading(true);
      }

      console.log('Fetching events for:', search);
      const url = search
        ? `/api/events?search=${encodeURIComponent(search)}`
        : '/api/events';

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setEvents(data.events || []);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch events');
        setEvents([]);
      }
    } catch (err) {
      setError('Failed to fetch events');
      setEvents([]);
      console.error(err);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (term === '') {
      fetchEvents();
    }
  };

  const searchInfo = useMemo(() => {
    if (!searchTerm) return null;

    return {
      hasResults: events.length > 0,
      count: events.length,
      term: searchTerm
    };
  }, [events.length, searchTerm]);

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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

          {searchLoading && (
            <div className="flex items-center justify-center mt-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-sm text-gray-600">Searching...</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {searchInfo && (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                {searchInfo.hasResults
                  ? `Found ${searchInfo.count} event${searchInfo.count === 1 ? '' : 's'} matching "${searchInfo.term}"`
                  : `No events found for "${searchInfo.term}"`
                }
              </p>
              {searchInfo.hasResults && (
                <p className="text-blue-600 text-sm mt-1">
                  Results include matches in titles, descriptions, organizer details, requirements, and more.
                </p>
              )}
            </div>
          </div>
        )}

        {events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">
              {searchTerm ? '🔍' : '📅'}
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? 'No events found' : 'No events available'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? 'Try adjusting your search terms or browse all events'
                : 'Check back later for new events'}
            </p>
            {searchTerm && (
              <button
                onClick={() => handleSearch('')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                View All Events
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="transition-all duration-300 opacity-100 transform hover:scale-105"
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