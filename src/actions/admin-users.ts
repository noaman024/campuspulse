"use server";

import dbConnect from "@/lib/db/connection";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth/rbac";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export interface AdminUserData {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  createdAt: string;
}

export async function getAdminUsers(): Promise<AdminUserData[]> {
  await requireAdmin();
  await dbConnect();

  try {
    const admins = await User.find({ role: "admin" })
      .select("_id name email department role createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return admins.map((admin) => ({
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      department: admin.department,
      role: admin.role,
      createdAt: admin.createdAt ? new Date(admin.createdAt).toISOString() : new Date().toISOString(),
    }));
  } catch (err) {
    console.error("Failed to fetch admin users:", err);
    throw new Error("Could not retrieve admin team members");
  }
}

export async function createAdminUser(data: {
  name: string;
  email: string;
  department: string;
  password: string;
}) {
  await requireAdmin();
  await dbConnect();

  const name = data.name.trim();
  const email = data.email.trim().toLowerCase();
  const department = data.department.trim();
  const password = data.password.trim();

  if (!name || name.length < 2) {
    throw new Error("Full name must be at least 2 characters long");
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error("Please provide a valid email address");
  }
  if (!department || department.length < 2) {
    throw new Error("Department or designation is required");
  }
  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  // Check if account already exists
  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role === "admin") {
      throw new Error("An administrative account with this email already exists.");
    }

    // If existing student, promote to admin and update password
    const passwordHash = await bcrypt.hash(password, 12);
    existing.role = "admin";
    existing.name = name;
    existing.department = department;
    existing.passwordHash = passwordHash;
    await existing.save();

    revalidatePath("/admin/settings");
    return {
      id: existing._id.toString(),
      name: existing.name,
      email: existing.email,
      department: existing.department,
      role: existing.role,
      message: "Existing user account promoted to Administrator successfully!",
    };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const newUser = await User.create({
    name,
    email,
    passwordHash,
    department,
    role: "admin",
  });

  revalidatePath("/admin/settings");

  return {
    id: newUser._id.toString(),
    name: newUser.name,
    email: newUser.email,
    department: newUser.department,
    role: newUser.role,
    message: "New Administrator account created successfully!",
  };
}

export async function deleteAdminUser(adminId: string) {
  const session = await requireAdmin();
  await dbConnect();

  const currentAdminId = (session.user as { id: string }).id;
  const currentAdminEmail = session.user?.email;

  if (currentAdminId === adminId) {
    throw new Error("You cannot delete your own logged-in admin account for safety.");
  }

  const targetUser = await User.findById(adminId);
  if (!targetUser) {
    throw new Error("Admin account not found");
  }

  if (targetUser.email === currentAdminEmail) {
    throw new Error("You cannot delete your own logged-in admin account for safety.");
  }

  // Count total admins to make sure at least 1 admin remains
  const totalAdmins = await User.countDocuments({ role: "admin" });
  if (totalAdmins <= 1) {
    throw new Error("Cannot delete the last remaining administrator account.");
  }

  await User.findByIdAndDelete(adminId);
  revalidatePath("/admin/settings");

  return { success: true, message: "Admin account removed successfully." };
}
