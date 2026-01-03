import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  console.log("Session after login", session)

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome back, {session.user?.name || session.user?.email}!</h1>
      <p className="mt-4 text-lg">Your Kongden dashboard is ready.</p>
      <p className="mt-2">Start by creating your first board!</p>
    </div>
  );
}