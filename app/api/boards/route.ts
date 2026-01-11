import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma"
import { handlePrismaError, requireAuth } from "@/lib/api-utils";
import { createBoardSchema } from "@/lib/validation/board-schema";
import { z } from "zod"


// GET: List all board for authenticated user
export async function GET(request: NextRequest) {

    const auth = await requireAuth(request);

    if (auth instanceof Response) return auth; //Unauthorized

    try {
        const boards = await prisma.board.findMany({
            where: { ownerId: auth.userId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                description: true,
                backgroundColor: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: { lists: true },
                }
            }
        });

        return NextResponse.json(boards, { status: 200 });
    } catch (error) {
        return handlePrismaError(error);
    }
}



// POST: Create a new board 
export async function POST(request: NextRequest) {
    const auth = await requireAuth(request);

    if (auth instanceof Response) return auth;

    try {
        const body = await request.json();
        const { title, description, backgroundColor } = createBoardSchema.parse(body);

        const defaultLists = [
            { title: 'To Do', position: 0 },
            { title: 'In Progress', position: 65536 },
            { title: 'Done', position: 131072 },
        ];

        const board = await prisma.board.create({
            data: {
                title,
                description,
                backgroundColor,
                ownerId: auth.userId as string,
                lists: {
                    createMany: {
                        data: defaultLists,
                    },
                },
            },

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

        return NextResponse.json(board, { status: 201 })
    } catch (error) {
        console.error('Error creating board:', error); // ← Crucial: see the real error

        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error }, { status: 400 });
        }

        return NextResponse.json(
            { error: 'Failed to create board', details: (error as Error).message },
            { status: 500 }
        );
    }
}