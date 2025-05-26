import 'dotenv/config';
import dbConnect from '../lib/mongodb';
import Event from '../models/Event';

const sampleEvents = [
  {
    name: "Weekend Photography Workshop",
    type: "Photography",
    address: "Central Park, New York, NY 10024",
    description: "Learn the fundamentals of landscape and portrait photography in this hands-on workshop. We'll cover camera settings, composition techniques, and editing basics.",
    date: new Date('2024-06-15T09:00:00Z'),
    duration: "4 hours",
    maxParticipants: 15,
    currentParticipants: 8,
    difficulty: "Beginner",
    requirements: ["DSLR or Mirrorless Camera", "Comfortable walking shoes"],
    organizer: "Sarah Johnson",
    contact: "sarah.photo@email.com",
    imageUrl: "/api/placeholder/400/250"
  },
  {
    name: "Pottery Making for Beginners",
    type: "Ceramics",
    address: "Artisan Studio, 45 Clay Street, Brooklyn, NY 11201",
    description: "Create your own ceramic pieces from scratch! Learn basic techniques like centering, throwing, and glazing in this beginner-friendly pottery class.",
    date: new Date('2024-06-18T14:00:00Z'),
    duration: "3 hours",
    maxParticipants: 12,
    currentParticipants: 5,
    difficulty: "Beginner",
    requirements: ["Apron or old clothes", "Towel"],
    organizer: "Michael Chen",
    contact: "mike.pottery@email.com",
    imageUrl: "/api/placeholder/400/250"
  },
  {
    name: "Urban Sketching Adventure",
    type: "Drawing",
    address: "Times Square, Manhattan, NY 10036",
    description: "Capture the energy of the city through sketching! We'll explore different locations and techniques for drawing urban landscapes and street scenes.",
    date: new Date('2024-06-20T10:00:00Z'),
    duration: "5 hours",
    maxParticipants: 20,
    currentParticipants: 12,
    difficulty: "Intermediate",
    requirements: ["Sketchbook", "Pencils and pens", "Portable stool (optional)"],
    organizer: "Emma Rodriguez",
    contact: "emma.sketch@email.com",
    imageUrl: "/api/placeholder/400/250"
  },
  {
    name: "Cooking Masterclass: Italian Cuisine",
    type: "Cooking",
    address: "Culinary Institute, 789 Food Avenue, Queens, NY 11375",
    description: "Master the art of Italian cooking! Learn to make fresh pasta, classic sauces, and traditional desserts from a professional chef.",
    date: new Date('2024-06-22T16:00:00Z'),
    duration: "6 hours",
    maxParticipants: 16,
    currentParticipants: 14,
    difficulty: "Intermediate",
    requirements: ["Apron", "Hair tie (if needed)", "Appetite for learning!"],
    organizer: "Chef Antonio Rossi",
    contact: "antonio.chef@email.com",
    imageUrl: "/api/placeholder/400/250"
  },
  {
    name: "Beginner's Guitar Circle",
    type: "Music",
    address: "Community Center, 123 Harmony Lane, Manhattan, NY 10001",
    description: "Join our friendly guitar circle! Perfect for beginners wanting to learn basic chords, strumming patterns, and simple songs in a supportive group environment.",
    date: new Date('2024-06-25T19:00:00Z'),
    duration: "2 hours",
    maxParticipants: 10,
    currentParticipants: 7,
    difficulty: "Beginner",
    requirements: ["Acoustic guitar", "Pick", "Notebook for chord charts"],
    organizer: "David Martinez",
    contact: "david.music@email.com",
    imageUrl: "/api/placeholder/400/250"
  },
  {
    name: "Indoor Rock Climbing Introduction",
    type: "Climbing",
    address: "Vertical Adventures Gym, 456 Rock Street, Brooklyn, NY 11215",
    description: "New to climbing? This introduction session covers safety basics, equipment usage, and fundamental climbing techniques on our beginner-friendly walls.",
    date: new Date('2024-06-28T18:00:00Z'),
    duration: "3 hours",
    maxParticipants: 12,
    currentParticipants: 9,
    difficulty: "Beginner",
    requirements: ["Athletic clothing", "Closed-toe shoes", "Water bottle"],
    organizer: "Lisa Thompson",
    contact: "lisa.climb@email.com",
    imageUrl: "/api/placeholder/400/250"
  },
  {
    name: "Watercolor Painting Workshop",
    type: "Painting",
    address: "Art Studio Loft, 321 Canvas Drive, Manhattan, NY 10003",
    description: "Explore the beautiful medium of watercolors! Learn wet-on-wet and wet-on-dry techniques while painting landscapes and still life compositions.",
    date: new Date('2024-07-01T13:00:00Z'),
    duration: "4 hours",
    maxParticipants: 18,
    currentParticipants: 11,
    difficulty: "Beginner",
    requirements: ["None - all materials provided"],
    organizer: "Grace Kim",
    contact: "grace.art@email.com",
    imageUrl: "/api/placeholder/400/250"
  },
  {
    name: "Woodworking Basics: Build a Birdhouse",
    type: "Woodworking",
    address: "Maker Space Workshop, 987 Craft Boulevard, Queens, NY 11354",
    description: "Learn fundamental woodworking skills while building a functional birdhouse! We'll cover measuring, cutting, drilling, and assembly techniques.",
    date: new Date('2024-07-03T10:00:00Z'),
    duration: "5 hours",
    maxParticipants: 8,
    currentParticipants: 6,
    difficulty: "Beginner",
    requirements: ["Safety glasses", "Work gloves", "Dust mask"],
    organizer: "Robert Wilson",
    contact: "robert.wood@email.com",
    imageUrl: "/api/placeholder/400/250"
  },
  {
    name: "Yoga and Meditation Retreat",
    type: "Wellness",
    address: "Serenity Studio, 654 Peace Street, Manhattan, NY 10011",
    description: "Find your inner balance through gentle yoga flows and guided meditation. Perfect for beginners and those seeking stress relief and mindfulness.",
    date: new Date('2024-07-05T08:00:00Z'),
    duration: "3 hours",
    maxParticipants: 25,
    currentParticipants: 18,
    difficulty: "Beginner",
    requirements: ["Yoga mat", "Comfortable clothing", "Water bottle"],
    organizer: "Maya Patel",
    contact: "maya.yoga@email.com",
    imageUrl: "/api/placeholder/400/250"
  },
  {
    name: "Digital Photography Editing Bootcamp",
    type: "Photography",
    address: "Tech Hub, 159 Digital Avenue, Brooklyn, NY 11222",
    description: "Take your photos to the next level! Learn advanced editing techniques using Lightroom and Photoshop to enhance your digital photography portfolio.",
    date: new Date('2024-07-08T14:00:00Z'),
    duration: "6 hours",
    maxParticipants: 14,
    currentParticipants: 10,
    difficulty: "Advanced",
    requirements: ["Laptop with Lightroom/Photoshop", "Sample photos to edit", "External mouse (recommended)"],
    organizer: "Alex Turner",
    contact: "alex.digital@email.com",
    imageUrl: "/api/placeholder/400/250"
  }
];

async function seedDatabase() {
  try {
    await dbConnect();

    await Event.deleteMany({});

    await Event.insertMany(sampleEvents);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };