import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import DeleteTaskButton from '@/components/DeleteTaskButton';
import { MdEdit, MdArrowBack, MdCalendarToday, MdFlag, MdCheckCircle } from 'react-icons/md';
import { clsx } from 'clsx';
import { ITask } from '@/models/Task';

async function getTask(id: string, userId: string) {
    await dbConnect();
    try {
        const task = await Task.findOne({ _id: id, assignedTo: userId });
        return task ? JSON.parse(JSON.stringify(task)) : null;
    } catch (e) {
        return null;
    }
}

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100',
    'in-progress': 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100',
    completed: 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100',
};

const priorityColors = {
    low: 'text-muted-foreground',
    medium: 'text-orange-500',
    high: 'text-red-500',
};

export default async function TaskDetailsPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    const task: (ITask & { _id: string }) | null = await getTask(params.id, (session.user as any).id);

    if (!task) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
                <Link href="/tasks" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                    <MdArrowBack className="mr-1 h-4 w-4" />
                    Back to Tasks
                </Link>
            </div>

            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                <div className="border-b border-border px-4 py-5 sm:px-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold leading-6 text-foreground">
                            {task.title}
                        </h1>
                        <span className={clsx(
                            'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium',
                            statusColors[task.status]
                        )}>
                            {task.status.replace('-', ' ')}
                        </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                            <MdFlag className={clsx('mr-1.5 h-5 w-5', priorityColors[task.priority])} />
                            <span className="capitalize">{task.priority} Priority</span>
                        </div>
                        {task.dueDate && (
                            <div className="flex items-center">
                                <MdCalendarToday className="mr-1.5 h-5 w-5" />
                                <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                        )}
                        <div className="flex items-center">
                            <MdCheckCircle className="mr-1.5 h-5 w-5" />
                            <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-base font-semibold leading-6 text-foreground">Description</h3>
                    <div className="mt-2 max-w-xl text-sm text-muted-foreground">
                        <p className="whitespace-pre-wrap">{task.description || 'No description provided.'}</p>
                    </div>
                </div>
                <div className="bg-muted/30 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6">
                    <div className="flex space-x-3">
                        <Link href={`/tasks/${task._id}/edit`}>
                            <Button variant="outline">
                                <MdEdit className="mr-2 h-4 w-4" />
                                Edit Task
                            </Button>
                        </Link>
                        <DeleteTaskButton id={task._id} />
                    </div>
                </div>
            </div>
        </div>
    );
}
