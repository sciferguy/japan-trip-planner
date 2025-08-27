import NextAuth, { type NextAuthConfig } from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { z } from "zod";

const credentialsSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

const config: NextAuthConfig = {
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    session: { strategy: "jwt" },
    pages: {
        signIn: "/sign-in",
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (token) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
            }
            return session;
        },
        // Add this callback to handle redirects after sign in
        redirect: async ({ url, baseUrl }) => {
            console.log('Redirect callback:', { url, baseUrl }); // Add debugging

            // Always redirect to dashboard after successful sign in
            if (url === baseUrl + "/sign-in" || url.includes("callbackUrl")) {
                return baseUrl + "/dashboard";
            }

            // If it's already pointing to dashboard, allow it
            if (url.startsWith(baseUrl + "/dashboard")) {
                return url;
            }

            // Default to dashboard
            return baseUrl + "/dashboard";
        },
        signIn: async ({ user, account }) => {
            if (account?.provider === "google") {
                // Store Google user in database
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! }
                });

                if (!existingUser) {
                    const newUser = await prisma.user.create({
                        data: {
                            email: user.email!,
                            name: user.name!,
                            image: user.image,
                            emailVerified: new Date()
                        }
                    });
                    // Update the user object with the database ID
                    user.id = newUser.id;
                } else {
                    // Update the user object with the existing database ID
                    user.id = existingUser.id;
                }
            }
            return true;
        }
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                const parsed = credentialsSchema.safeParse(credentials);
                if (!parsed.success) return null;

                const { email, password } = parsed.data;
                const user = await prisma.user.findUnique({ where: { email } });

                if (!user?.hashedPassword) return null;

                const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
                if (!passwordMatch) return null;

                return {
                    id: user.id,
                    email: user.email!,
                    name: user.name!
                };
            }
        })
    ]
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);