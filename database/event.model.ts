import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: 'online' | 'offline' | 'hybrid';
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    // Slug is derived from title in the pre-save hook — not set manually
    slug: { type: String, unique: true, trim: true },
    description: { type: String, required: [true, 'Description is required'], trim: true },
    overview: { type: String, required: [true, 'Overview is required'], trim: true },
    image: { type: String, required: [true, 'Image is required'], trim: true },
    venue: { type: String, required: [true, 'Venue is required'], trim: true },
    location: { type: String, required: [true, 'Location is required'], trim: true },
    date: { type: String, required: [true, 'Date is required'] },
    time: { type: String, required: [true, 'Time is required'] },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'Mode must be online, offline, or hybrid',
      },
    },
    audience: { type: String, required: [true, 'Audience is required'], trim: true },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'Agenda must have at least one item',
      },
    },
    organizer: { type: String, required: [true, 'Organizer is required'], trim: true },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'Tags must have at least one item',
      },
    },
  },
  { timestamps: true }
);

EventSchema.pre<IEvent>('save', function (next) {
  // Regenerate slug only when title is new or has changed
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')   // strip special characters
      .replace(/\s+/g, '-')            // spaces → hyphens
      .replace(/-+/g, '-');            // collapse consecutive hyphens
  }

  // Normalize date to ISO 8601 (YYYY-MM-DD) if title or date changed
  if (this.isModified('date')) {
    const parsed = new Date(this.date);
    if (isNaN(parsed.getTime())) {
      return next(new Error(`Invalid date value: "${this.date}"`));
    }
    this.date = parsed.toISOString().split('T')[0];
  }

  // Normalize time to HH:MM 24-hour format
  if (this.isModified('time')) {
    const match = this.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) {
      return next(new Error(`Invalid time value: "${this.time}"`));
    }
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = match[3]?.toUpperCase();

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    this.time = `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  next();
});

// Compound index to speed up slug lookups
EventSchema.index({ slug: 1 });

const Event: Model<IEvent> =
  mongoose.models.Event ?? mongoose.model<IEvent>('Event', EventSchema);

export default Event;
