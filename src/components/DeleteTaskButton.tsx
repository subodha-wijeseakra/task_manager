'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { deleteTask } from '@/app/actions/task';
import { useRouter } from 'next/navigation';
import { MdDelete } from 'react-icons/md';

export default function DeleteTaskButton({ id }: { id: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        setLoading(true);
        const result = await deleteTask(id);

        if (result.success) {
            router.push('/tasks');
            router.refresh();
        } else {
            alert('Failed to delete task');
            setLoading(false);
        }
    };

    return (
        <Button variant="destructive" onClick={handleDelete} isLoading={loading}>
            <MdDelete className="mr-2 h-4 w-4" />
            Delete Task
        </Button>
    );
}
