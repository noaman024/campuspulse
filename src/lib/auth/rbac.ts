import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Authentication required");
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if ((session.user as { role: string }).role !== "admin") {
    throw new Error("Admin access required");
  }
  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user) return null;
  return {
    id: (session.user as { id: string }).id,
    name: session.user.name!,
    email: session.user.email!,
    role: (session.user as { role: string }).role as "student" | "admin",
    department: (session.user as { department: string }).department,
  };
}
