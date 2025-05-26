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

      const searchRegex = new RegExp(search, 'i');

      const searchNumber = extractNumberFromSearch(search);

      const searchQuery = {
        $or: [
          { name: searchRegex },        
          { type: searchRegex },
          { address: searchRegex },     
          { organizer: searchRegex },

          { description: searchRegex },
          { duration: searchRegex },
          { difficulty: searchRegex },
          { contact: searchRegex },

          { requirements: { $elemMatch: { $regex: searchRegex } } },

          ...(isNaN(Number(search)) ? [] : [
            { maxParticipants: Number(search) },
            { currentParticipants: Number(search) }
          ]),

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

          ...(search.toLowerCase() === 'beginner' ? [{ difficulty: 'Beginner' }] : []),
          ...(search.toLowerCase() === 'intermediate' ? [{ difficulty: 'Intermediate' }] : []),
          ...(search.toLowerCase() === 'advanced' ? [{ difficulty: 'Advanced' }] : []),

          ...(isDateRelated(search) ? [
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

      if (events.length > 0) {
        events = events.sort((a, b) => {
          const searchLower = search.toLowerCase();

          let scoreA = 0;
          let scoreB = 0;

          if (a.name?.toLowerCase().includes(searchLower)) scoreA += 10;
          if (b.name?.toLowerCase().includes(searchLower)) scoreB += 10;

          if (a.organizer?.toLowerCase().includes(searchLower)) scoreA += 8;
          if (b.organizer?.toLowerCase().includes(searchLower)) scoreB += 8;

          if (a.type?.toLowerCase().includes(searchLower)) scoreA += 6;
          if (b.type?.toLowerCase().includes(searchLower)) scoreB += 6;

          if (a.address?.toLowerCase().includes(searchLower)) scoreA += 5;
          if (b.address?.toLowerCase().includes(searchLower)) scoreB += 5;

          if (a.description?.toLowerCase().includes(searchLower)) scoreA += 3;
          if (b.description?.toLowerCase().includes(searchLower)) scoreB += 3;

          if (a.requirements?.some((req: string) => req.toLowerCase().includes(searchLower))) scoreA += 4;
          if (b.requirements?.some((req: string) => req.toLowerCase().includes(searchLower))) scoreB += 4;

          if (searchNumber !== null && (searchLower.includes('spot') || searchLower.includes('remaining') || searchLower.includes('left') || searchLower.includes('available'))) {
            const spotsA = a.maxParticipants - a.currentParticipants;
            const spotsB = b.maxParticipants - b.currentParticipants;
            if (spotsA === searchNumber) scoreA += 7;
            if (spotsB === searchNumber) scoreB += 7;
          }

          return scoreB - scoreA; 
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

function extractNumberFromSearch(search: string): number | null {
  const numberMatch = search.match(/\d+/);
  if (numberMatch) {
    return parseInt(numberMatch[0], 10);
  }
  return null;
}