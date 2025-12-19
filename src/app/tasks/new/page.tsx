'use client';

import TaskForm from '@/components/TaskForm';
import { createTask } from '@/app/actions/task';

export default function NewTaskPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">Create New Task</h1>
            <TaskForm action={createTask} submitLabel="Create Task" />
        </div>
    );
}
