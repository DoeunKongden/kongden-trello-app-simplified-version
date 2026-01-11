import { NextRequest, NextResponse } from "next/server";
import { handlePrismaError, requireAuth, requiredBoardOwnership } from "@/lib/api-utils";
import { prisma } from "@/prisma"
import { updateBoardSchema } from "@/lib/validation/board-schema";
import { z } from "zod"


//GET: Get board by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ boardId: string }> }) {

    const auth = await requireAuth(request);

    // If it success it doesn't return an instance of reponse but it return an object.
    if (auth instanceof NextResponse) return auth; // Since the requireAuth function will return a apiErrorResponse

    const { boardId } = await params


    //Verify board ownership 
    const ownership = await requiredBoardOwnership(boardId as string, auth.userId);

    // Check if ownership check failed
    if (ownership.error) return ownership.error;

    try {
        // Fetching the board by boardId
        const board = await prisma.board.findUnique({
            where: {
                id: boardId
            },
            include: {
                lists: {
                    orderBy: { position: 'asc' },
                    include: {
                        tasks: {
                            orderBy: { position: 'asc' }
                        }
                    }
                }
            }
        })

        if (!board) {
            return NextResponse.json({ error: 'Board not found' }, { status: 404 });
        }

        return NextResponse.json(board, { status: 200 });


    } catch (error) {
        return handlePrismaError(error);
    }
}

//PATCH: Update board details
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ boardId: string }> }) {

    const auth = await requireAuth(request);

    if (auth instanceof NextResponse) return auth;

    const { boardId } = await params;

    const ownership = await requiredBoardOwnership(boardId, auth.userId);

    if (ownership.error) return ownership.error;

    try {
        const data = updateBoardSchema.parse(await request.json());

        const board = await prisma.board.update({
            where: {
                id: boardId
            },
            data,
            include: {
                lists: {
                    orderBy: { position: 'asc' },
                },
            },
        });

        return NextResponse.json(board, { status: 200 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error }, { status: 400 });
        }

        console.error('Board update error:', error);
        return NextResponse.json({ error: 'Failed to update board. Internal Server Error' }, { status: 500 })
    }
}

//DELETE: Delete board (cascades to lists/task)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ boardId: string }> }) {

    const auth = await requireAuth(request);

    if (auth instanceof NextResponse) return auth;

    const { boardId } = await params;

    console.log("Delete - boardId received", boardId);
    console.log("Delete - userId:", auth.userId);

    //cleaned up the boardId incase of extra spacing
    const trimmedBoardId = boardId?.trim();
    if (!trimmedBoardId) {
        return NextResponse.json(
            { error: 'Board ID is required' },
            { status: 400 }
        );
    }


    const ownership = await requiredBoardOwnership(trimmedBoardId, auth.userId);

    if (ownership.error) {
        console.log("Ownership check failed: ", ownership.error);
        return ownership.error;
    }

    try {
        // Double-check the board exists before deleting
        const boardToDelete = await prisma.board.findUnique({
            where: { id: trimmedBoardId },
            select: { id: true, ownerId: true }
        });

        if (!boardToDelete) {
            console.log('Board not found in database:', trimmedBoardId);
            return NextResponse.json(
                { error: 'Board not found' },
                { status: 404 }
            );
        }

        if (boardToDelete.ownerId !== auth.userId) {
            return NextResponse.json(
                { error: 'Forbidden: You do not own this board' },
                { status: 403 }
            );
        }

        await prisma.board.delete({
            where: {
                id: trimmedBoardId
            }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        // Handle case where board doesn't exist (might have been deleted already)
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Board not found' },
                { status: 404 }
            );
        }

        console.error('Board deletion error:', error);
        return handlePrismaError(error);
    }
}
