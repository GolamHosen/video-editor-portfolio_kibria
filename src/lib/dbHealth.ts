import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

/**
 * MongoDB connectivity & health verification check.
 * Returns true if MongoDB connection is active and reachable.
 */
export async function isDatabaseOnline(): Promise<boolean> {
  try {
    await connectToDatabase();
    return mongoose.connection.readyState === 1;
  } catch {
    return false;
  }
}
