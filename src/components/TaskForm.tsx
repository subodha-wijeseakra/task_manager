'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema } from '@/lib/validations';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
    initialData?: TaskFormData & { _id?: string };
    action: (data: TaskFormData) => Promise<{ success?: boolean; error?: string; task?: any }>;
    submitLabel?: string;
}

export default function TaskForm({ initialData, action, submitLabel = 'Save Task' }: TaskFormProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: initialData ? {
            ...initialData,
            dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
        } : {
            status: 'pending',
            priority: 'medium',
        },
    });

    const onSubmit = async (data: TaskFormData) => {
        setLoading(true);
        setError(null);

        const result = await action(data);

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push('/tasks');
            router.refresh();
        }
    };


    return (

        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl space-y-6 rounded-xl border border-border bg-card p-8 shadow-sm">
            {error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <div className="mb-2">
                <h2 className="text-2xl font-normal text-foreground">Task Details</h2>
                <p className="mt-1 text-base text-muted-foreground">Please fill in the details below.</p>
            </div>

            <Input
                label="Title"
                placeholder="Finish report..."
                error={errors.title?.message}
                {...register('title')}
            />

            <div className="relative w-full">
                <textarea
                    id="description"
                    className="peer flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-3 text-sm text-foreground placeholder-transparent transition-all focus:border-2 focus:border-primary focus:outline-none"
                    placeholder="Description"
                    {...register('description')}
                />
                <label
                    htmlFor="description"
                    className="pointer-events-none absolute -top-2 left-2 z-10 bg-card px-1 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary"
                >
                    Description
                </label>
                {errors.description && (
                    <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="relative w-full">
                    <select
                        id="status"
                        className="peer flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-3 text-sm text-foreground transition-all focus:border-2 focus:border-primary focus:outline-none"
                        {...register('status')}
                    >
                        <option value="pending" className="bg-card text-foreground">Pending</option>
                        <option value="in-progress" className="bg-card text-foreground">In Progress</option>
                        <option value="completed" className="bg-card text-foreground">Completed</option>
                    </select>
                    <label
                        htmlFor="status"
                        className="pointer-events-none absolute -top-2 left-2 z-10 bg-card px-1 text-xs text-muted-foreground transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary"
                    >
                        Status
                    </label>
                    {errors.status && (
                        <p className="mt-1 text-xs text-destructive">{errors.status.message}</p>
                    )}
                </div>

                <div className="relative w-full">
                    <select
                        id="priority"
                        className="peer flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-3 text-sm text-foreground transition-all focus:border-2 focus:border-primary focus:outline-none"
                        {...register('priority')}
                    >
                        <option value="low" className="bg-card text-foreground">Low</option>
                        <option value="medium" className="bg-card text-foreground">Medium</option>
                        <option value="high" className="bg-card text-foreground">High</option>
                    </select>
                    <label
                        htmlFor="priority"
                        className="pointer-events-none absolute -top-2 left-2 z-10 bg-card px-1 text-xs text-muted-foreground transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary"
                    >
                        Priority
                    </label>
                    {errors.priority && (
                        <p className="mt-1 text-xs text-destructive">{errors.priority.message}</p>
                    )}
                </div>

                <Input
                    label="Due Date"
                    type="date"
                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
                    error={errors.dueDate?.message}
                    {...register('dueDate')}
                />
            </div>

            <div className="flex justify-end gap-3 pt-6">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    className="rounded-full hover:bg-muted"
                >
                    Cancel
                </Button>
                <Button type="submit" isLoading={loading} className="rounded-full px-8 shadow-none hover:shadow-md">
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}
