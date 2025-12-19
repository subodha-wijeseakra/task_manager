'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { profileSchema, passwordChangeSchema } from '@/lib/validations';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function updateProfile(data: z.infer<typeof profileSchema>) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return { error: 'Not authenticated' };
        }

        const validation = profileSchema.safeParse(data);
        if (!validation.success) {
            return { error: validation.error.errors[0].message };
        }

        await dbConnect();

        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            { name: data.name },
            { new: true }
        );

        if (!user) {
            return { error: 'User not found' };
        }

        revalidatePath('/settings');
        return { success: true };
    } catch (error) {
        console.error('Update profile error:', error);
        return { error: 'Failed to update profile' };
    }
}

export async function changePassword(data: z.infer<typeof passwordChangeSchema>) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return { error: 'Not authenticated' };
        }

        const validation = passwordChangeSchema.safeParse(data);
        if (!validation.success) {
            return { error: validation.error.errors[0].message };
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email }).select('+password');

        if (!user) {
            return { error: 'User not found' };
        }

        // Check if user has a password (they might be OAuth users)
        if (!user.password) {
            return { error: 'You are logged in with a provider (Google/etc). Please set a password first via "Forgot Password" flow or stick to provider login.' };
        }

        const isValid = await bcrypt.compare(data.currentPassword, user.password);

        if (!isValid) {
            return { error: 'Incorrect current password' };
        }

        const hashedPassword = await bcrypt.hash(data.newPassword, 12);

        user.password = hashedPassword;
        await user.save();

        return { success: true };
    } catch (error) {
        console.error('Change password error:', error);
        return { error: 'Failed to change password' };
    }
}
