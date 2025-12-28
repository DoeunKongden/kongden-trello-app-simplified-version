import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma"
import { createHash } from "crypto";

export async function GET(request:NextRequest){
    try {
        const token = request.nextUrl.searchParams.get('token')

        // checking token availability
        if(!token){
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/auth/verification-error?message=missing-token`
            )
        }

        // hashed the token
        const hashedToken = createHash('sha256').update(token).digest('hex');

        // token from database
        const tokenRecord = await prisma.emailVerifiedToken.findUnique({
            where:{
                token: hashedToken,
            }
        })

        // check if the token is valide or not
        if (!tokenRecord){
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/auth/verification-error?message=invalid-token`
            )
        }

        // checking token expire or not
        if(tokenRecord.expiredAt < new Date()){
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/auth/verification-error?message=expired-token`
            )
        }

        // Check if user exists before updating
        const user = await prisma.user.findUnique({
            where: {
                email: tokenRecord.email,
            }
        })

        if (!user) {
            // Delete the orphaned token
            await prisma.emailVerifiedToken.delete({
                where: {id: tokenRecord.id}
            })
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/auth/verification-error?message=user-not-found`
            )
        }

        // Mark user as verified
        await prisma.user.update({
            where: {
                email: tokenRecord.email,
            },
            data:{
                emailVerified: new Date(),
            }
        });

        // after updating the user, delete the token
        await prisma.emailVerifiedToken.delete({
            where: {id: tokenRecord.id}
        })

        // return to success page
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/verified`);
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/auth/verification-error?message=server-error`
        )
    }
}