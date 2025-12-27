import { NextResponse } from "next/server"
import {prisma} from "@/prisma"
import bcrypt from "bcrypt"
import {z} from "zod"
import { v4 as uuidv4 } from "uuid"


/**
 * Signup API Route
 * 
 * This endpoint is for handling user registration:
 * 1. Validate input data
 * 2. Check if the user already exists
 * 3. Hashes the password
 * 4. Create the user in database
 * 5. Return success/error response
 */
const complexRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)


// Schema for validation using zod
const signupSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    email:z.email('Invalid email address'),
    password: z.string().regex(complexRegex, "Password is not strong enough. Must be at least 8 characters and include uppercase, lowercase, number and special character.")
})

export async function POST(req: Request) {
    try {
        // 1. Parse and validate request body
        const body = await req.json()

        // Validate with ZOD Schema
        const validationResult = signupSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validationResult.error.message
                },
                {status: 400}
            )
        }

        const { name, email, password } = validationResult.data

        // 2. Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: {email}
        })

        if (existingUser){
            return NextResponse.json(
                {error: "User's email already exists"},
                {status: 400}
            )
        }


        // 3. Hashing the password
        // bcrypt.hash(password, saltRounds)
        // saltRounds = 10 is a good balance between security and performance
        const hashedPassword = await bcrypt.hash(password,10)

        // Generate UUID for id
        const id = uuidv4()

        // 4. Create user in the database
        const newUser = await prisma.user.create({
            data:{
                id,
                name: name ?? null, // optional -> if not provided
                email,
                password: hashedPassword,
                image: null,
                emailVerified: null, // initially not verified yet
                updatedAt: new Date(), // set current time for updateAt
            },
            select:{
                id: true,
                name: true,
                image: true,
                email: true,
                emailVerified: true,
                updatedAt: true,
                createdAt: true,
            },
        })

        return NextResponse.json(
            { 
              user: newUser,
              message: "User created successfully" 
            },
            { status: 201 }
          )

    } catch (error: any) {
        
        if (error instanceof z.ZodError){
            // Return validation error: any instance of ZodError are validation error
            return NextResponse.json(
                {error:error.issues},
                {status: 400}
            )
        }

        console.log('Signup error:', error);

        // Don't expose internal error to client
        return NextResponse.json(
            {error: 'Failed to create account. Please try again.'},
            {status: 500}
        )
    }
}