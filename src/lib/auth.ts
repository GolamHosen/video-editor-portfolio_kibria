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

// ── Bcrypt helpers ──────────────────────────────────────────────────
// 10 rounds is the industry standard (bcrypt default). 12 rounds doubles
// the hashing time for negligible security gain in an admin-only login.
const BCRYPT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ── JWT helpers ─────────────────────────────────────────────────────
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

// ── Bootstrap cache ─────────────────────────────────────────────────
// Track whether the default admin has been bootstrapped during this process
// lifetime. Once verified, we never check the DB again — eliminates an
// extra findOne on every single login attempt.
let adminBootstrapped = false;

/**
 * Bootstraps the default admin ONLY on first run if database is empty.
 */
async function ensureAdminInDatabase(): Promise<void> {
  if (adminBootstrapped) return;

  const targetEmail = (process.env.ADMIN_EMAIL || "kibria1625@gmail.com").toLowerCase().trim();
  const defaultPassword = process.env.ADMIN_PASSWORD || "kibria1625";

  const anyAdmin = await AdminUser.findOne().lean();
  if (anyAdmin) {
    adminBootstrapped = true;
    return;
  }

  const passwordHash = await hashPassword(defaultPassword);
  await AdminUser.create({
    id: 1,
    email: targetEmail,
    passwordHash,
    name: "Golam Kibria",
  });
  adminBootstrapped = true;
  console.log(`[Auth] Bootstrapped default admin in MongoDB: ${targetEmail}`);
}

// Re-export for external callers that might need it (e.g. seed scripts).
export { ensureAdminInDatabase };

/**
 * Authenticates admin STRICTLY against the MongoDB database.
 * Fetches the user record and password hash directly from the database collection
 * and compares with bcrypt.
 *
 * Professional performance optimizations:
 *  1. Single DB query for normal login (bypasses bootstrap check when admin found).
 *  2. Uses .select("id email passwordHash name") to transfer only required fields.
 *  3. Uses .lean() to skip Mongoose document hydration.
 *  4. Fast-path bootstrap: only triggers if email is not found and DB is brand new.
 */
export async function authenticateAdmin(email: string, password: string): Promise<AuthResult> {
  const inputEmail = email.toLowerCase().trim();

  try {
    await connectToDatabase();

    // 1. Fast direct lookup with lean projection (1 single DB roundtrip)
    let user = await AdminUser.findOne({ email: inputEmail })
      .select("id email passwordHash name")
      .lean();

    // If user not found and bootstrap hasn't run, check if DB is empty (first run only)
    if (!user && !adminBootstrapped) {
      const adminExists = await AdminUser.exists({});
      if (!adminExists) {
        await ensureAdminInDatabase();
        // Re-check in case the bootstrapped account matches the input email
        user = await AdminUser.findOne({ email: inputEmail })
          .select("id email passwordHash name")
          .lean();
      } else {
        adminBootstrapped = true;
      }
    } else if (user) {
      adminBootstrapped = true;
    }

    if (!user) {
      return {
        success: false,
        error: GENERIC_AUTH_ERROR,
      };
    }

    // 2. Compare password with bcrypt
    const valid = await verifyPassword(password, user.passwordHash);

    if (!valid) {
      return {
        success: false,
        error: GENERIC_AUTH_ERROR,
      };
    }

    // 3. Return user data
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
