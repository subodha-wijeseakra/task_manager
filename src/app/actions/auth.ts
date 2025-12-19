'use server';

import dbConnect from '@/lib/db';
import User from '@/models/User';
import { registerSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

type RegisterInput = z.infer<typeof registerSchema>;

export async function registerUser(data: RegisterInput) {
    const result = registerSchema.safeParse(data);

    if (!result.success) {
        return { error: 'Invalid input data' };
    }

    const { name, email, password } = result.data;

    try {
        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { error: 'User already exists' };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        await User.create({
            name,
            email,
            password: hashedPassword,
            provider: 'credentials',
        });

        return { success: true };
    } catch (error) {
        console.error('Registration Error:', error);
        return { error: 'Something went wrong during registration' };
    }
}
