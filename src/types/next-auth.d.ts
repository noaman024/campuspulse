import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "student" | "admin";
      department: string;
      image?: string;
    };
  }

  interface User {
    id: string;
    role: string;
    department: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    role: string;
    department: string;
  }
}
