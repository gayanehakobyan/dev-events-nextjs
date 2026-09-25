import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// RFC 5322-compliant email regex — covers the vast majority of valid addresses
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<IBooking>(
  {
    // Ref enables Mongoose populate() and makes the relationship explicit in the schema
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => EMAIL_REGEX.test(v),
        message: 'Email address is not valid',
      },
    },
  },
  { timestamps: true }
);

BookingSchema.pre<IBooking>('save', async function (next) {
  // Guard: only run the DB lookup when eventId is new or changed
  if (!this.isModified('eventId')) return next();

  const eventExists = await mongoose.models.Event?.exists({ _id: this.eventId });
  if (!eventExists) {
    return next(new Error(`Event with ID "${this.eventId}" does not exist`));
  }

  next();
});

// Index on eventId so queries like "all bookings for event X" stay fast
BookingSchema.index({ eventId: 1 });

const Booking: Model<IBooking> =
  mongoose.models.Booking ?? mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
