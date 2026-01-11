import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { prisma } from "@/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // Fetch boards directly from database
  const boards = await prisma.board.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      backgroundColor: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { lists: true },
      },
    },
  });

  // Convert dates to ISO strings for client-side
  const serializedBoards = boards.map((board) => ({
    ...board,
    createdAt: board.createdAt.toISOString(),
    updatedAt: board.updatedAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-background">
      <DashboardClient initialBoards={serializedBoards} />
    </div>
  );
}
