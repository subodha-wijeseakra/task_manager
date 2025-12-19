import { ITask } from '@/models/Task';
import Link from 'next/link';
import { clsx } from 'clsx';
import { MdFlag, MdCalendarToday } from 'react-icons/md';

interface ListViewProps {
    tasks: (ITask & { _id: string })[];
}

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100',
    'in-progress': 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100',
    completed: 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100',
};

const priorityColors = {
    low: 'text-gray-500',
    medium: 'text-orange-500',
    high: 'text-red-500',
};

export default function ListView({ tasks }: ListViewProps) {
    if (tasks.length === 0) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-lg text-gray-500 dark:text-gray-400">No tasks found</p>
                {/* Button for new task is handled in the parent/header usually, or we can add it here if needed, but context suggests it's in the header */}
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
                <Link key={task._id} href={`/tasks/${task._id}`}>
                    <div className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                        <div>
                            <div className="flex items-start justify-between">
                                <span className={clsx(
                                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                    statusColors[task.status]
                                )}>
                                    {task.status.replace('-', ' ')}
                                </span>
                                <MdFlag className={clsx('h-5 w-5', priorityColors[task.priority])} />
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-foreground group-hover:text-primary">
                                {task.title}
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                {task.description}
                            </p>
                        </div>

                        <div className="mt-4 flex items-center text-sm text-muted-foreground">
                            {task.dueDate && (
                                <div className="flex items-center">
                                    <MdCalendarToday className="mr-1.5 h-4 w-4 flex-shrink-0" />
                                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
