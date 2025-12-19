'use server';

import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { taskSchema } from '@/lib/validations';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

type TaskInput = z.infer<typeof taskSchema>;

async function getSessionUser() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error('Unauthorized');
    }
    return session.user;
}

export async function createTask(data: TaskInput) {
    try {
        const user = await getSessionUser();
        const result = taskSchema.safeParse(data);

        if (!result.success) {
            return { error: 'Invalid data' };
        }

        await dbConnect();

        const newTask = await Task.create({
            ...result.data,
            assignedTo: (user as any).id,
        });

        revalidatePath('/dashboard');
        revalidatePath('/tasks');

        return { success: true, task: JSON.parse(JSON.stringify(newTask)) };
    } catch (error) {
        console.error('Create Task Error:', error);
        return { error: 'Failed to create task' };
    }
}

export async function updateTask(id: string, data: TaskInput) {
    try {
        const user = await getSessionUser();
        const result = taskSchema.safeParse(data);

        if (!result.success) {
            return { error: 'Invalid data' };
        }

        await dbConnect();

        const task = await Task.findOne({ _id: id, assignedTo: (user as any).id });

        if (!task) {
            return { error: 'Task not found or unauthorized' };
        }

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { ...result.data },
            { new: true, runValidators: true }
        );

        revalidatePath(`/tasks/${id}`);
        revalidatePath('/tasks');
        revalidatePath('/dashboard');

        return { success: true, task: JSON.parse(JSON.stringify(updatedTask)) };
    } catch (error) {
        console.error('Update Task Error:', error);
        return { error: 'Failed to update task' };
    }
}

export async function deleteTask(id: string) {
    try {
        const user = await getSessionUser();
        await dbConnect();

        const task = await Task.findOneAndDelete({ _id: id, assignedTo: (user as any).id });

        if (!task) {
            return { error: 'Task not found or unauthorized' };
        }

        revalidatePath('/tasks');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Delete Task Error:', error);
        return { error: 'Failed to delete task' };
    }
}
