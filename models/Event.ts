import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  _id: string;
  name: string;
  type: string;
  address: string;
  description: string;
  date: Date;
  duration: string;
  maxParticipants: number;
  currentParticipants: number;
  difficulty: string;
  requirements: string[];
  organizer: string;
  contact: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  maxParticipants: {
    type: Number,
    required: true
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  requirements: [{
    type: String
  }],
  organizer: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: '/api/placeholder/400/250'
  }
}, {
  timestamps: true
});

EventSchema.index({
  name: 'text',
  type: 'text',
  address: 'text',
  description: 'text',
  organizer: 'text'
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);