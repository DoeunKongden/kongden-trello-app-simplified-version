import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/prisma";

export default async function BoardDetailPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const { boardId } = await params;

  // Verify board exists and user owns it
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    select: {
      id: true,
      title: true,
      description: true,
      backgroundColor: true,
      ownerId: true,
    },
  });

  if (!board) {
    redirect("/dashboard");
  }

  if (board.ownerId !== session.user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{board.title}</h1>
        {board.description && (
          <p className="text-muted-foreground mt-2">{board.description}</p>
        )}
      </div>
      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">
          Board detail view coming soon. This board has been loaded successfully.
        </p>
        <p className="text-sm text-muted-foreground mt-2">Board ID: {board.id}</p>
      </div>
    </div>
  );
}
