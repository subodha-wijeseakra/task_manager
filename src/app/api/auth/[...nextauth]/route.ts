import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please provide email and password');
                }

                await dbConnect();
                const user = await User.findOne({ email: credentials.email }).select('+password');

                if (!user) {
                    throw new Error('Invalid email or password');
                }

                if (user.provider !== 'credentials') {
                    throw new Error(`This email is registered with ${user.provider}. Please login with that provider.`);
                }

                const isMatch = await bcrypt.compare(credentials.password, user.password!);

                if (!isMatch) {
                    throw new Error('Invalid email or password');
                }

                return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                await dbConnect();
                const existingUser = await User.findOne({ email: user.email });

                if (existingUser) {
                    // If user exists but used a different provider initially (shouldn't happen with strict flow but good to check)
                    // Actually for Google, we can link or just let them in if key fields match.
                    // For simplicity, if they exist with 'credentials', we might want to error or merge.
                    // Here we will just return true if they allow it, or update them.
                    // Let's keep it simple: if user exists, we good.
                    return true;
                } else {
                    // Create new user for Google login
                    await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        provider: 'google',
                        role: 'student', // Default role
                    });
                    return true;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
            }
            // If it's a google login, we might need to fetch the role from DB if it's a subsequent login
            // because `user` object in jwt callback is only available on first sign in.
            if (token.email && !token.role) {
                await dbConnect();
                const dbUser = await User.findOne({ email: token.email });
                if (dbUser) {
                    token.role = dbUser.role;
                    token.id = dbUser._id.toString();
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
    pages: {
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
