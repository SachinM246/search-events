'use client';

import { useState, useEffect } from 'react';

interface SearchBarProps {
    onSearch: (term: string) => void;
    initialValue?: string;
}

export default function SearchBar({ onSearch, initialValue = '' }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState(initialValue);

    useEffect(() => {
        setSearchTerm(initialValue);
    }, [initialValue]);

    const handleClear = () => {
        setSearchTerm('');
        onSearch('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="Search events by name, type, location, organizer, or spots remaining..."
                        autoComplete="off"
                    />

                    {searchTerm && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <button
                                type="button"
                                onClick={handleClear}
                                className="h-5 w-5 text-gray-400 hover:text-gray-600 focus:outline-none"
                                title="Clear search"
                            >
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}