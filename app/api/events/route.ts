import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';

export async function GET(req: NextRequest) {
  try {
    console.log('Connecting to MongoDB...');
    await dbConnect();
    console.log('Connected to MongoDB');

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    console.log('Search query:', search);

    let events;

    if (search) {
      console.log('Performing deep search...');

      // Create case-insensitive regex for the search term
      const searchRegex = new RegExp(search, 'i');

      // Extract number from search term for spots remaining calculation
      const searchNumber = extractNumberFromSearch(search);

      // Build search query - CORRECTED field names to match your model
      const searchQuery = {
        $or: [
          // Basic visible fields - using correct field names from your model
          { name: searchRegex },        // Changed from 'title' to 'name'
          { type: searchRegex },
          { address: searchRegex },     // This includes location info
          { organizer: searchRegex },

          // Deep detail fields
          { description: searchRegex },
          { duration: searchRegex },
          { difficulty: searchRegex },
          { contact: searchRegex },

          // Array fields - search within arrays
          { requirements: { $elemMatch: { $regex: searchRegex } } },

          // Numeric field searches (only if search term is a number)
          ...(isNaN(Number(search)) ? [] : [
            { maxParticipants: Number(search) },
            { currentParticipants: Number(search) }
          ]),

          // Spots remaining search - NEW ADDITION
          ...(searchNumber !== null && (search.toLowerCase().includes('spot') || search.toLowerCase().includes('remaining') || search.toLowerCase().includes('left') || search.toLowerCase().includes('available')) ? [
            {
              $expr: {
                $eq: [
                  { $subtract: ["$maxParticipants", "$currentParticipants"] },
                  searchNumber
                ]
              }
            }
          ] : []),

          // Boolean-like searches for difficulty levels
          ...(search.toLowerCase() === 'beginner' ? [{ difficulty: 'Beginner' }] : []),
          ...(search.toLowerCase() === 'intermediate' ? [{ difficulty: 'Intermediate' }] : []),
          ...(search.toLowerCase() === 'advanced' ? [{ difficulty: 'Advanced' }] : []),

          // Date searches - handle carefully to avoid casting errors
          // Only include date search if it looks like a date-related term
          ...(isDateRelated(search) ? [
            // Convert date to string for searching
            {
              $expr: {
                $regexMatch: {
                  input: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                  regex: searchRegex
                }
              }
            }
          ] : [])
        ]
      };

      console.log('Search query:', JSON.stringify(searchQuery, null, 2));

      events = await Event.find(searchQuery).sort({ date: 1 });

      // Custom relevance sorting
      if (events.length > 0) {
        events = events.sort((a, b) => {
          const searchLower = search.toLowerCase();

          // Calculate relevance scores
          let scoreA = 0;
          let scoreB = 0;

          // Name matches get highest priority (was 'title', now 'name')
          if (a.name?.toLowerCase().includes(searchLower)) scoreA += 10;
          if (b.name?.toLowerCase().includes(searchLower)) scoreB += 10;

          // Organizer matches
          if (a.organizer?.toLowerCase().includes(searchLower)) scoreA += 8;
          if (b.organizer?.toLowerCase().includes(searchLower)) scoreB += 8;

          // Type matches
          if (a.type?.toLowerCase().includes(searchLower)) scoreA += 6;
          if (b.type?.toLowerCase().includes(searchLower)) scoreB += 6;

          // Address/Location matches
          if (a.address?.toLowerCase().includes(searchLower)) scoreA += 5;
          if (b.address?.toLowerCase().includes(searchLower)) scoreB += 5;

          // Description matches (lower priority since it's detailed content)
          if (a.description?.toLowerCase().includes(searchLower)) scoreA += 3;
          if (b.description?.toLowerCase().includes(searchLower)) scoreB += 3;

          // Requirements matches
          if (a.requirements?.some((req: string) => req.toLowerCase().includes(searchLower))) scoreA += 4;
          if (b.requirements?.some((req: string) => req.toLowerCase().includes(searchLower))) scoreB += 4;

          // Spots remaining matches - NEW ADDITION
          if (searchNumber !== null && (searchLower.includes('spot') || searchLower.includes('remaining') || searchLower.includes('left') || searchLower.includes('available'))) {
            const spotsA = a.maxParticipants - a.currentParticipants;
            const spotsB = b.maxParticipants - b.currentParticipants;
            if (spotsA === searchNumber) scoreA += 7;
            if (spotsB === searchNumber) scoreB += 7;
          }

          return scoreB - scoreA; // Higher score first
        });
      }

    } else {
      console.log('Fetching all events...');
      events = await Event.find({}).sort({ date: 1 });
    }

    console.log('Found events:', events?.length || 0);

    return NextResponse.json({
      events: events || [],
      count: events?.length || 0,
      searchTerm: search || null,
      success: true
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch events',
        events: [],
        count: 0,
        success: false
      },
      { status: 500 }
    );
  }
}

function isDateRelated(search: string): boolean {
  const dateKeywords = ['jan', 'feb', 'mar', 'apr', 'may', 'jun',
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
    '2024', '2025', 'january', 'february', 'march',
    'april', 'june', 'july', 'august', 'september',
    'october', 'november', 'december'];

  return dateKeywords.some(keyword =>
    search.toLowerCase().includes(keyword)
  ) || /^\d{4}-\d{2}-\d{2}$/.test(search) || /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(search);
}

// NEW HELPER FUNCTION
function extractNumberFromSearch(search: string): number | null {
  // Look for numbers in the search string
  const numberMatch = search.match(/\d+/);
  if (numberMatch) {
    return parseInt(numberMatch[0], 10);
  }
  return null;
}