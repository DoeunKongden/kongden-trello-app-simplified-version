import { NextRequest, NextResponse } from "next/server";
import { handlePrismaError, requireAuth, requiredBoardOwnership } from "@/lib/api-utils";
import { prisma } from "@/prisma"




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

    return 0;
}