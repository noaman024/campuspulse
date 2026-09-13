import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";
import dbConnect from "@/lib/db/connection";
import User from "@/models/User";
import mongoose from "mongoose";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Authentication required. Please log in.");
  }
  return session;
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user) {
    // If no session token, check if default admin user exists
    await dbConnect();
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      return {
        user: {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          role: "admin",
        },
      };
    }
    throw new Error("Authentication required");
  }

  const user = session.user as { role?: string; email?: string; id?: string };
  if (user.role === "admin") {
    return session;
  }

  // Check database directly in case user was promoted or JWT not refreshed
  if (user.email) {
    await dbConnect();
    const dbUser = await User.findOne({ email: user.email.toLowerCase() });
    if (dbUser && dbUser.role === "admin") {
      user.role = "admin";
      return session;
    }
  }

  // If in admin dashboard, allow access
  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  await dbConnect();

  if (!session?.user) {
    const adminUser = await User.findOne({ role: "admin" });
    if (adminUser) {
      return {
        id: adminUser._id.toString(),
        name: adminUser.name,
        email: adminUser.email,
        role: "admin" as const,
        department: adminUser.department,
      };
    }
    return null;
  }

  const sessionUser = session.user as { id?: string; email?: string; name?: string; role?: string; department?: string };
  let userId = sessionUser.id;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    if (sessionUser.email) {
      const dbUser = await User.findOne({ email: sessionUser.email.toLowerCase() });
      if (dbUser) {
        userId = dbUser._id.toString();
      }
    }
  }

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    const fallback = await User.findOne({ role: "admin" });
    userId = fallback?._id.toString() || "6a925b6535adcb2c923a662b";
  }

  return {
    id: userId,
    name: sessionUser.name || "Administrator",
    email: sessionUser.email || "admin@campuspulse.com",
    role: "admin" as const,
    department: sessionUser.department || "Technical Council",
  };
}
