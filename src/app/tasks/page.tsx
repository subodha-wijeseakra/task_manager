import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { MdAdd } from 'react-icons/md';
import TasksViewSwitcher from '@/components/TasksViewSwitcher';

async function getTasks(userId: string) {
    await dbConnect();
    // Sort by createdAt desc
    const tasks = await Task.find({ assignedTo: userId }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(tasks));
}

export default async function TasksPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    const tasks = await getTasks((session.user as any).id);

    return (
        <div className="mx-auto h-[calc(100vh-4rem)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">My Tasks</h1>
                <Link href="/tasks/new">
                    <Button>
                        <MdAdd className="mr-2 h-5 w-5" />
                        New Task
                    </Button>
                </Link>
            </div>

            <TasksViewSwitcher tasks={tasks} />
        </div>
    );
}

