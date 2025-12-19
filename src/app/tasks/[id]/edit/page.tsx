import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import { redirect, notFound } from 'next/navigation';
import TaskForm from '@/components/TaskForm';
import { updateTask } from '@/app/actions/task';
import { taskSchema } from '@/lib/validations';
import { z } from 'zod';

async function getTask(id: string, userId: string) {
    await dbConnect();
    try {
        const task = await Task.findOne({ _id: id, assignedTo: userId });
        return task ? JSON.parse(JSON.stringify(task)) : null;
    } catch (e) {
        return null;
    }
}


export default async function EditTaskPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    const task: (z.infer<typeof taskSchema> & { _id: string }) | null = await getTask(params.id, (session.user as any).id);

    if (!task) {
        notFound();
    }

    const bindUpdates = updateTask.bind(null, params.id);

    return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">Edit Task</h1>
            <TaskForm initialData={task} action={bindUpdates} submitLabel="Save Changes" />
        </div>
    );
}
