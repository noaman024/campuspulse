import { getSession } from "@/lib/auth/rbac";
import { redirect } from "next/navigation";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login?callbackUrl=/portal/feedback");
  }

  return <>{children}</>;
}
