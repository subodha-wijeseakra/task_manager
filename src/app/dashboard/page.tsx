import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import {
    MdAssignment,
    MdAssignmentTurnedIn,
    MdAssignmentLate,
    MdDonutLarge
} from 'react-icons/md';

async function getStats(userId: string) {
    await dbConnect();

    // Parallelize queries for performance
    const [total, completed, pending, inProgress] = await Promise.all([
        Task.countDocuments({ assignedTo: userId }),
        Task.countDocuments({ assignedTo: userId, status: 'completed' }),
        Task.countDocuments({ assignedTo: userId, status: 'pending' }),
        Task.countDocuments({ assignedTo: userId, status: 'in-progress' }),
    ]);

    return { total, completed, pending, inProgress };
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    const { total, completed, pending, inProgress } = await getStats((session.user as any).id);

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const stats = [
        {
            label: 'Total Tasks',
            value: total,
            icon: MdAssignment,
            color: 'text-blue-600',
            bg: 'bg-blue-100 dark:bg-blue-900/20',
        },
        {
            label: 'Completed',
            value: completed,
            icon: MdAssignmentTurnedIn,
            color: 'text-green-600',
            bg: 'bg-green-100 dark:bg-green-900/20',
        },
        {
            label: 'Pending',
            value: pending,
            icon: MdAssignmentLate,
            color: 'text-yellow-600',
            bg: 'bg-yellow-100 dark:bg-yellow-900/20',
        },
        {
            label: 'In Progress',
            value: inProgress,
            icon: MdDonutLarge,
            color: 'text-purple-600',
            bg: 'bg-purple-100 dark:bg-purple-900/20',
        },
    ];

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Welcome back, {session.user?.name}
                    </p>
                </div>
                <Link href="/tasks/new">
                    <Button>Create New Task</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div
                        key={item.label}
                        className="overflow-hidden rounded-xl border border-border bg-card px-4 py-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
                    >
                        <div className="flex items-center">
                            <div className="flex-shrink-0 rounded-md bg-secondary/50 p-3">
                                <item.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dt className="truncate text-sm font-medium text-muted-foreground">
                                    {item.label}
                                </dt>
                                <dd className="mt-1 text-3xl font-semibold text-foreground">
                                    {item.value}
                                </dd>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-medium leading-6 text-foreground">
                    Overall Progress
                </h3>
                <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                            Completion Rate
                        </span>
                        <span className="text-sm font-medium text-foreground">
                            {completionRate}%
                        </span>
                    </div>
                    <div className="h-4 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                            className="h-full rounded-full bg-green-500 transition-all duration-500 ease-out"
                            style={{ width: `${completionRate}%` }}
                        />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                        You have completed {completed} out of {total} tasks.
                    </p>
                </div>
            </div>
        </div>
    );
}
