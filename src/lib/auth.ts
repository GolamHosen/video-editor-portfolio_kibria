import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { AdminUser } from "@/models";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production";
const secretKey = new TextEncoder().encode(JWT_SECRET);

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
    .sign(secretKey);
}

export async function verifyToken(token: string): Promise<{ id: number; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as { id: number; email: string };
  } catch {
    return null;
  }
}

export type AuthResult =
  | { success: true; user: { id: number; email: string; name: string } }
  | { success: false; error: string };

/**
 * Ensures the admin account exists in MongoDB with the designated email and hashed password.
 */
export async function ensureAdminInDatabase(): Promise<void> {
  const targetEmail = (process.env.ADMIN_EMAIL || "kibria1625@gmail.com").toLowerCase().trim();
  const defaultPassword = process.env.ADMIN_PASSWORD || "kibria1625";

  let user = await AdminUser.findOne({ email: targetEmail });
  if (!user) {
    const passwordHash = await hashPassword(defaultPassword);
    // Check if there is an existing admin with id: 1 or any existing admin user
    const existingAdmin = (await AdminUser.findOne({ id: 1 })) || (await AdminUser.findOne());
    if (existingAdmin) {
      existingAdmin.email = targetEmail;
      existingAdmin.passwordHash = passwordHash;
      existingAdmin.name = "Golam Kibria";
      await existingAdmin.save();
      console.log(`[Auth] Migrated existing admin user to: ${targetEmail}`);
    } else {
      await AdminUser.create({
        id: 1,
        email: targetEmail,
        passwordHash,
        name: "Golam Kibria",
      });
      console.log(`[Auth] Stored default admin in database: ${targetEmail}`);
    }
  } else {
    // If the database password hash does not match current password, update it in MongoDB
    const matches = await verifyPassword(defaultPassword, user.passwordHash);
    if (!matches) {
      user.passwordHash = await hashPassword(defaultPassword);
      await user.save();
      console.log(`[Auth] Synchronized admin password hash in database for: ${targetEmail}`);
    }
  }
}

/**
 * Authenticates admin strictly against the MongoDB database.
 * Fetches the user record and password hash directly from the database collection.
 */
export async function authenticateAdmin(email: string, password: string): Promise<AuthResult> {
  const inputEmail = email.toLowerCase().trim();

  try {
    await connectToDatabase();

    // Ensure the admin account exists in the MongoDB database
    await ensureAdminInDatabase();

    // 1. Fetch user record directly from MongoDB database
    const user = await AdminUser.findOne({ email: inputEmail });

    if (!user) {
      return {
        success: false,
        error: "No admin account found with that email address. Please verify your email.",
      };
    }

    // 2. Fetch stored password hash from the database document and compare with bcrypt
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return {
        success: false,
        error: "Incorrect password. Please check your password and try again.",
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
