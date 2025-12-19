'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { ITask } from '@/models/Task';
import { updateTask } from '@/app/actions/task';
import { clsx } from 'clsx';
import Link from 'next/link';
import { MdFlag, MdCalendarToday } from 'react-icons/md';

interface BoardViewProps {
    tasks: (ITask & { _id: string })[];
}

const COLUMNS = {
    'pending': 'Pending',
    'in-progress': 'In Progress',
    'completed': 'Completed'
} as const;

export default function BoardView({ tasks: initialTasks }: BoardViewProps) {
    const [tasks, setTasks] = useState(initialTasks);

    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newStatus = destination.droppableId as ITask['status'];
        const taskToUpdate = tasks.find(t => t._id === draggableId);

        if (!taskToUpdate) return;

        // Optimistic update
        const updatedTasks = tasks.map(t =>
            t._id === draggableId ? { ...t, status: newStatus } : t
        );
        setTasks(updatedTasks);

        // Server action
        try {
            await updateTask(draggableId, {
                ...taskToUpdate,
                status: newStatus,
                dueDate: taskToUpdate.dueDate ? new Date(taskToUpdate.dueDate).toISOString() : undefined,
                assignedTo: taskToUpdate.assignedTo.toString()
            });
        } catch (error) {
            console.error('Failed to update task:', error);
            // Revert on error
            setTasks(initialTasks);
        }
    };

    const getTasksByStatus = (status: string) => {
        return tasks.filter(task => task.status === status);
    };

    const priorityColors = {
        low: 'text-gray-500',
        medium: 'text-orange-500',
        high: 'text-red-500',
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex h-full gap-4 overflow-x-auto pb-4">
                {(Object.entries(COLUMNS) as [keyof typeof COLUMNS, string][]).map(([statusId, statusLabel]) => (
                    <div key={statusId} className="flex h-full min-w-[300px] flex-1 flex-col rounded-lg bg-secondary">
                        <div className="p-4 font-semibold text-foreground">
                            {statusLabel} <span className="ml-2 text-sm text-muted-foreground">({getTasksByStatus(statusId).length})</span>
                        </div>
                        <Droppable droppableId={statusId}>
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={clsx(
                                        "flex-1 space-y-3 p-3 transition-colors",
                                        snapshot.isDraggingOver ? "bg-muted" : ""
                                    )}
                                >
                                    {getTasksByStatus(statusId).map((task, index) => (
                                        <Draggable key={task._id} draggableId={task._id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={clsx(
                                                        "group relative flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md",
                                                        snapshot.isDragging ? "rotate-2 shadow-xl ring-2 ring-primary ring-opacity-50" : ""
                                                    )}
                                                >
                                                    <div className="mb-2 flex items-start justify-between">
                                                        <Link href={`/tasks/${task._id}`} className="hover:underline">
                                                            <h4 className="font-medium text-foreground line-clamp-2">
                                                                {task.title}
                                                            </h4>
                                                        </Link>
                                                        <MdFlag className={clsx('h-4 w-4 flex-shrink-0 mt-1', priorityColors[task.priority])} />
                                                    </div>

                                                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                                                        {task.dueDate && (
                                                            <div className="flex items-center">
                                                                <MdCalendarToday className="mr-1 h-3 w-3" />
                                                                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </div>
        </DragDropContext>
    );
}
