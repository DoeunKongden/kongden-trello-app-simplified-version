import { prisma } from "@/prisma";
import { NextResponse, NextRequest } from "next/server";
import { record, success, z, ZodError } from "zod"
import { randomBytes, createHash } from "crypto";
import { sendVerficationEmail } from "@/lib/sendVerificationEmail";



export async function POST(request: NextRequest) {

    // Validation schema
    const resendSchema = z.object({
        email: z.email('Invalid email address')
    });

    try {
        const body = await request.json();

        const { email } = resendSchema.parse(body)

        const recordUser = await prisma.user.findUnique({
            // The condition
            where: { email },
            // Selecting which data to return
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true
            }
        });


        // Validate user not exist and emailVerified is not null meaning that the user is already verified
        if (!recordUser || recordUser.emailVerified !== null) {
            return NextResponse.json(
                {
                    success: true,
                    message: "If an unverified account exists with this email, a new verification link has been sent.",
                    status: 200
                },
            )
        }

        // If we get here it mean that the user exist and is not verified yet
        // 5. Generation verification token
        const verificationToken = randomBytes(32).toString('hex');
        const hashedToken = createHash('sha256').update(verificationToken).digest('hex');

        // set expiration time (24 hours)
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // save to the database
        await prisma.emailVerifiedToken.create({
            data: {
                token: hashedToken,
                expiredAt: expires,
                email
            }
        });

        // send email verification to user
        await sendVerficationEmail(email, recordUser.name ?? '', verificationToken)


        return NextResponse.json({
            success: true,
            message: 'Verification email sent successfully!',
            status: 200
        })

        
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(error.issues, { status: 400 })
        }
    }
}