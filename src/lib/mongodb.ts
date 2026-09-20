import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || (process.env.NODE_ENV === "production" ? "" : "mongodb://127.0.0.1:27017/kibria_portfolio");

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // Allow global caching in Node.js development mode
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  // If connection is alive, return cached connection immediately
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured in environment variables");
  }

  // Reset cache if disconnected or disconnecting
  if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    cached.promise = null;
    cached.conn = null;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: true, // Allow commands to buffer briefly during connection
      maxPoolSize: 10,      // Maintain up to 10 socket connections
      minPoolSize: 1,       // Keep at least 1 persistent connection warm to avoid handshake latency
      maxIdleTimeMS: 45000, // Re-use connection sockets efficiently
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    throw e;
  }

  return cached.conn;
}
