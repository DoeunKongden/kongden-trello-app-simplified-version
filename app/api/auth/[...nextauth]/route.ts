import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/prisma";
import bcrypt from "bcrypt";

/**
 * Next Auth Configuration
 * 
 * This file sets up authentication for our app using NextAuth.js
 * It configures:
 * 1. Database Adapter (Prisma) - stores sessions and accounts
 * 2. Authentication providers (Email/Password, Google OAuth)
 * 3. Session strategy (JWT or database)
 * 4. Custom pages and callbacks
 */


export const authOptions: NextAuthOptions = {

    // Prisma Adapter: Connect NextAuth to our database
    // Automatically create/manages sessions, accounts and users 
    adapter: PrismaAdapter(prisma),

    //Session strategy: define how the session are stored
    //"jwt" : stored in cookies (stateless, faster)
    //"database" : stored in database (more secure, can revoke session)
    session: {
        strategy: 'jwt', // can switch to database later if want
    },

    providers: [
        // Email and Password Providers (Credentials)
        CredentialsProvider({
            name: 'Credentials',
            credentials:{
                email: {label: "Email", type: "email", placeholder: "your@email.com" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials){
                // This function will run when user try to sign in with email and password
                if (!credentials?.email || !credentials?.password){
                    throw new Error('Email and password are required')
                }

                // Find user in database
                const user = await prisma.user.findUnique({
                    where:{
                        email: credentials.email
                    }
                })

                if (!user) {
                    throw new Error('User not found');
                }

                // Check for password nullable before comparing 
                if(!user.password){
                    throw new Error('Password is not set for this user')
                }

                // TODO: Add password hasing
                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                )
                if (!isPasswordValid) {
                    throw new Error("Invalid email or password")
                  }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                }
            }
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        })
    ],

    // My own custom page: override default NextAuth pages
    pages:{
        signIn: "/login",
        signOut: "/logout",
        error: "/login", 
    },


    // Callbacks: are functions that run at different stages
    callbacks:{
        // Run when a JWT is created or updates
        async jwt({token, user, account}){
            if(user){
                token.id = user.id
                token.email = user.email
            }

            return token
        },


        // Run whenever a session is checked (getServerSession)
        async session({session, token}){
            // Add user ID to session object
            if(session.user){
                session.user.id = token.id as string
            }
            return session
        },
    },


    // Security setting
    secret: process.env.NEXTAUTH_SECRET,
}

// Export the handler for GET and POST request
const handler = NextAuth(authOptions)


export {handler as GET, handler as POST}