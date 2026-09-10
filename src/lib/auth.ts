import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { AdminUser } from "@/models";

// NEVER hard-code the secret in source. In production, JWT_SECRET must be
// present in the environment; the dev fallback is intentionally weak and only
// used when NODE_ENV !== "production".
const DEV_FALLBACK_SECRET =
  "dev-insecure-fallback-8f2c1d3a4b5c6d7e8f9a0b1c2d3e4f5a-change-me";

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET || DEV_FALLBACK_SECRET;
  if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is not configured. Set a strong secret in production.");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(payload: { id: number; email: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifyToken(token: string): Promise<{ id: number; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as { id: number; email: string };
  } catch {
    return null;
  }
}

export type AuthResult =
  | { success: true; user: { id: number; email: string; name: string } }
  | { success: false; error: string };

// Generic failure message (prevents account enumeration for the public login).
const GENERIC_AUTH_ERROR = "Invalid email or password.";

/**
 * Bootstraps the default admin ONLY on first run.
 *
 * MongoDB is the single source of truth for admin credentials. ENV vars
 * (ADMIN_EMAIL / ADMIN_PASSWORD) are used just once, to create the first
 * admin row when the database has none. They are NEVER re-applied afterwards,
 * so changing the password in MongoDB is safe and permanent.
 */
export async function ensureAdminInDatabase(): Promise<void> {
  const targetEmail = (process.env.ADMIN_EMAIL || "kibria1625@gmail.com").toLowerCase().trim();
  const defaultPassword = process.env.ADMIN_PASSWORD || "kibria1625";

  // If ANY admin already exists in MongoDB, respect the database — do nothing.
  const anyAdmin = await AdminUser.findOne();
  if (anyAdmin) return;

  const passwordHash = await hashPassword(defaultPassword);
  await AdminUser.create({
    id: 1,
    email: targetEmail,
    passwordHash,
    name: "Golam Kibria",
  });
  console.log(`[Auth] Bootstrapped default admin in MongoDB: ${targetEmail}`);
}

/**
 * Authenticates admin STRICTLY against the MongoDB database.
 * Fetches the user record and password hash directly from the database collection
 * and compares with bcrypt. No credentials are ever written during login.
 */
export async function authenticateAdmin(email: string, password: string): Promise<AuthResult> {
  const inputEmail = email.toLowerCase().trim();

  try {
    await connectToDatabase();

    // First-run only bootstrap (no-op when an admin already exists).
    await ensureAdminInDatabase();

    // 1. Fetch user record directly from MongoDB database
    const user = await AdminUser.findOne({ email: inputEmail });

    if (!user) {
      return {
        success: false,
        error: GENERIC_AUTH_ERROR,
      };
    }

    // 2. Fetch stored password hash from the database document and compare with bcrypt
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return {
        success: false,
        error: GENERIC_AUTH_ERROR,
      };
    }

    // 3. Return user data fetched directly from the database document
    return {
      success: true,
      user: {
        id: user.id || 1,
        email: user.email,
        name: user.name || "Golam Kibria",
      },
    };
  } catch (err: unknown) {
    console.error("Database auth error:", err);
    const message = err instanceof Error ? err.message : String(err);
    const isConnError = message.includes("ECONN") || message.includes("topology") || message.includes("timed out") || message.includes("ServerSelection");
    return {
      success: false,
      error: isConnError
        ? "Unable to connect to the database. Please verify your MongoDB connection and try again."
        : `Authentication failed: ${message}`,
    };
  }
}
