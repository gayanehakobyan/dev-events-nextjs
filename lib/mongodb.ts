import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

/**
 * In development, Next.js hot-reloads the module system on every change,
 * which would open a new connection on each reload without this cache.
 * We attach the cache to the global object so it persists across reloads.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

export async function connectToDatabase(): Promise<Mongoose> {
  // Return the existing connection if already established
  if (cached.conn) {
    return cached.conn;
  }

  // If no pending connection, start one
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, {
      bufferCommands: false, // Fail immediately if not connected instead of queuing
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
