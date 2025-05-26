import Link from 'next/link';
import { IEvent } from '@/models/Event';

interface EventCardProps {
    event: IEvent;
}

export default function EventCard({ event }: EventCardProps) {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'beginner':
                return 'bg-green-100 text-green-800';
            case 'intermediate':
                return 'bg-yellow-100 text-yellow-800';
            case 'advanced':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeColor = (type: string) => {
        const colors = [
            'bg-blue-100 text-blue-800',
            'bg-purple-100 text-purple-800',
            'bg-pink-100 text-pink-800',
            'bg-indigo-100 text-indigo-800',
            'bg-cyan-100 text-cyan-800',
            'bg-teal-100 text-teal-800',
            'bg-orange-100 text-orange-800',
        ];

        const index = type.length % colors.length;
        return colors[index];
    };

    return (
        <Link href={`/events/${event._id}`} className="block group h-full">
            <div className="event-card group-hover:border-blue-300">
                <div className="event-card-image">
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                    <div className="absolute bottom-4 left-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                            {event.type}
                        </span>
                    </div>
                </div>

                <div className="event-card-content">
                    <h3 className="event-card-title group-hover:text-blue-600 transition-colors duration-200">
                        {event.name}
                    </h3>

                    <div className="mb-3 space-y-1 flex-shrink-0">
                        <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="truncate">{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{event.duration}</span>
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="flex items-start text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="event-card-address">{event.address}</span>
                        </div>
                    </div>

                    <div className="event-card-bottom">
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(event.difficulty)}`}>
                                {event.difficulty}
                            </span>

                            <div className="flex items-center text-sm text-gray-500">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                                <span>{event.currentParticipants}/{event.maxParticipants}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}