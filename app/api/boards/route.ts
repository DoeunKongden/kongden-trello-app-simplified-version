import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/prisma"
import { error, timeLog } from "node:console";


// GET: List all board for authenticated user
export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized Access" }, { status: 401 });
    }

    //If user is authorize 
    const board = await prisma.board.findMany({
        where: {
            ownerId: session.user.id
        },
        select: {
            id: true,
            title: true,
            description: true,
            backgroundColor: true,
            createdAt: true,
        },
    })

    //response the board back to user 
    return NextResponse.json(board, { status: 200 })
}

// POST: Create a new board 
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized Access" }, { status: 401 });
    }

    const {title,description, backgroundColor='blue'} = await request.json();

    if(!title.trim()){
        return NextResponse.json({error: "Title is required"}, {status:400})
    }

    const board = await prisma.board.create({
        data:{
            title: title.trim(),
            description: description.trim() || null,
            backgroundColor,
            ownerId: session?.user?.id
        }
    })

    return NextResponse.json(board, {status: 201});
}



