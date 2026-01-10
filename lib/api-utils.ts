import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma"


// Standard Error response format
export function apiErrorResponse(message: string, status: number, details?: any) {
    return NextResponse.json(
        { error: message, details },
        { status }
    )
}

// Common auth check - returns session or error
export async function requireAuth(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return apiErrorResponse("Unauthorized", 401)
    }

    return { session, userId: session.user.id }
}


// Ownership check for board
export async function requiredBoardOwnership(boardId: string, userId: string) {
    const board = await prisma.board.findUnique({
        where: { id: boardId },
        select: { ownerId: true },
    })


    if (!board) {
        return { error: apiErrorResponse('Board not found', 404) };
    }

    if (board.ownerId !== userId) {
        return { error: apiErrorResponse("Forbidden: You do not own this board", 403) }
    }


    return { board };
}


// Primsa error
export function handlePrismaError(error: any) {
    if (error.code === "P2025") {
        return apiErrorResponse("Resource not found", 404);
    }

    if (error.code === "P2002") {
        return apiErrorResponse("Unique constraint violation", 409)
    }

    return apiErrorResponse("Internal Server Error", 500)
}
