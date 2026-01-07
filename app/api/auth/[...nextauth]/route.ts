import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@/prisma";
import bcrypt from "bcrypt";
import { record } from "zod";

/**
 * Next Auth Configuration
 * 
 * This file sets up authentication for our app using NextAuth.js
 * It configures:
 * 1. Database Adapter (Prisma) - stores sessions and accounts
 * 2. Authentication providers (Email/Password, Google OAuth, GitHub OAuth)
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
            credentials: {
                email: { label: "Email", type: "email", placeholder: "your@email.com" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials) {

                console.log("credentials login", credentials)
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter both email & password')
                };

                //Finding user
                const recordUser = await prisma.user.findUnique({
                    where: { email: credentials?.email.toLowerCase() }
                });

                if (!recordUser || !recordUser.password) {
                    throw new Error('Invalid email or password');
                }

                if (!recordUser.emailVerified) {
                    throw new Error('Please verify your email address first. Check your inbox or spam folder.')
                }

                // compare password
                const isValidPassword = await bcrypt.compare(credentials?.password, recordUser?.password)

                if (!isValidPassword) {
                    throw new Error('Invalid email or password');
                }

                return {
                    id: recordUser.id,
                    email: recordUser.email,
                    name: recordUser.name,
                    image: recordUser.image
                };
            }
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),

        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        })
    ],

    // My own custom page: override default NextAuth pages
    pages: {
        signIn: "/login",
        signOut: "/logout",
        error: "/login",
    },


    // Callbacks: are functions that run at different stages
    callbacks: {
        // Run when a JWT is created or updates
        async jwt({ token, user, account }) {

            console.log("Callback Url jwt:", token)
            console.log("Callback url user:", token)
            if (user) {
                token.id = user.id
                token.email = user.email
            }

            return token
        },


        // Run whenever a session is checked (getServerSession)
        async session({ session, token }) {
            // Add user ID to session object
            if (session.user) {
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


export { handler as GET, handler as POST }