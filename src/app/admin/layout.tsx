import { requireAdmin } from "@/lib/auth/rbac";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
  } catch {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-[calc(100vh-4rem)] overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
