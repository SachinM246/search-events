'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { IEvent } from '@/models/Event';

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [event, setEvent] = useState<IEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (params.id) {
            fetchEvent(params.id as string);
        }
    }, [params.id]);

    const fetchEvent = async (id: string) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/events/${id}`);
            const data = await response.json();

            if (response.ok) {
                setEvent(data.event);
            } else {
                setError(data.error || 'Failed to fetch event');
            }
        } catch (err) {
            setError('Failed to fetch event');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'beginner':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'intermediate':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'advanced':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getAvailabilityColor = (current: number, max: number) => {
        const percentage = (current / max) * 100;
        if (percentage >= 90) return 'text-red-600';
        if (percentage >= 70) return 'text-yellow-600';
        return 'text-green-600';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading event details...</p>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'The event you\'re looking for doesn\'t exist.'}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => router.push('/')}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Events
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                        <div className="absolute bottom-6 left-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-90 text-gray-800">
                                {event.type}
                            </span>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.name}</h1>

                            <div className="flex flex-wrap gap-4 mb-6">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${getDifficultyColor(event.difficulty)}`}>
                                    {event.difficulty} Level
                                </span>

                                <div className={`flex items-center text-sm font-medium ${getAvailabilityColor(event.currentParticipants, event.maxParticipants)}`}>
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.196-2.085M17 20v-2a3 3 0 00-3-3H8a3 3 0 00-3 3v2m8-10a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {event.currentParticipants}/{event.maxParticipants} participants
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Event</h2>
                            <p className="text-gray-700 leading-relaxed">{event.description}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Details</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <div>
                                                <p className="font-medium text-gray-900">{formatDate(event.date)}</p>
                                                <p className="text-sm text-gray-600">Duration: {event.duration}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <div>
                                                <p className="font-medium text-gray-900">Location</p>
                                                <p className="text-gray-700">{event.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {event.requirements && event.requirements.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">What to Bring</h3>
                                        <ul className="space-y-2">
                                            {event.requirements.map((req, index) => (
                                                <li key={index} className="flex items-center">
                                                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span className="text-gray-700">{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Organizer</h3>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="font-medium text-gray-900 mb-1">{event.organizer}</p>
                                        <p className="text-gray-600 mb-3">{event.contact}</p>
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                            Contact Organizer
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to Join?</h3>
                                    <p className="text-blue-700 mb-4">
                                        {event.maxParticipants - event.currentParticipants} spots remaining
                                    </p>
                                    <button
                                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                        disabled={event.currentParticipants >= event.maxParticipants}
                                    >
                                        {event.currentParticipants >= event.maxParticipants ? 'Event Full' : 'Register Now'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}