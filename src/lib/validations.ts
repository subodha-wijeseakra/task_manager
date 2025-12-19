import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required'),
});

export const taskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100),
    description: z.string().max(1000).optional(),
    status: z.enum(['pending', 'in-progress', 'completed']),
    priority: z.enum(['low', 'medium', 'high']),
    dueDate: z.string().optional().refine((val) => {
        if (!val) return true;
        const date = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
    }, { message: "Due date cannot be in the past" }), // We'll receive date as string from form
    assignedTo: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID').optional(), // For admin assignment
});

export const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const passwordChangeSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
});
