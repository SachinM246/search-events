import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';

export async function GET(request: NextRequest) {
  try {
    console.log('Connecting to MongoDB...');
    await dbConnect();
    console.log('Connected to MongoDB');
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    console.log('Search query:', search);
    
    let events;
    
    if (search) {
      console.log('Searching events...');
      events = await Event.find(
        { $text: { $search: search } },
        { score: { $meta: 'textScore' } }
      ).sort({ score: { $meta: 'textScore' } });
    } else {
      console.log('Fetching all events...');
      events = await Event.find({}).sort({ date: 1 });
    }
    
    console.log('Found events:', events?.length || 0);
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch events' },
      { status: 500 }
    );
  }
}