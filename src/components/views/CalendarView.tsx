'use client';

import { useState } from 'react';
import { ITask } from '@/models/Task';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    parseISO,
} from 'date-fns';
import { clsx } from 'clsx';
import { MdChevronLeft, MdChevronRight, MdFlag } from 'react-icons/md';
import Link from 'next/link';

interface CalendarViewProps {
    tasks: (ITask & { _id: string })[];
}

export default function CalendarView({ tasks }: CalendarViewProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const onNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const onPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const days = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const getTasksForDay = (day: Date) => {
        return tasks.filter(task => {
            if (!task.dueDate) return false;
            // Parse dueDate if it's a string, assuming ISO format
            const taskDate = typeof task.dueDate === 'string' ? parseISO(task.dueDate) : task.dueDate;
            return isSameDay(taskDate, day);
        });
    };

    const priorityColors = {
        low: 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
        medium: 'bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-100',
        high: 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100',
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="flex h-full flex-col rounded-lg border border-border bg-card shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-4">
                <span className="text-lg font-bold text-foreground">
                    {format(currentMonth, 'MMMM yyyy')}
                </span>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onPrevMonth}
                        className="rounded-full p-1 hover:bg-muted"
                    >
                        <MdChevronLeft className="h-6 w-6 text-muted-foreground" />
                    </button>
                    <button
                        onClick={onNextMonth}
                        className="rounded-full p-1 hover:bg-muted"
                    >
                        <MdChevronRight className="h-6 w-6 text-muted-foreground" />
                    </button>
                </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-border bg-secondary">
                {weekDays.map((day) => (
                    <div
                        key={day}
                        className="py-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid flex-1 grid-cols-7 grid-rows-5 lg:grid-rows-6">
                {days.map((day, dayIdx) => {
                    const dayTasks = getTasksForDay(day);
                    return (
                        <div
                            key={day.toString()}
                            className={clsx(
                                'min-h-[100px] border-b border-r border-border p-2',
                                !isSameMonth(day, monthStart)
                                    ? 'bg-muted/50 text-muted-foreground'
                                    : 'bg-card',
                                isSameDay(day, new Date()) && 'bg-primary/10'
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <span
                                    className={clsx(
                                        'text-sm font-medium',
                                        isSameDay(day, new Date())
                                            ? 'flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground'
                                            : 'text-foreground'
                                    )}
                                >
                                    {format(day, dateFormat)}
                                </span>
                            </div>
                            <div className="mt-2 space-y-1">
                                {dayTasks.map((task) => (
                                    <Link key={task._id} href={`/tasks/${task._id}`}>
                                        <div
                                            className={clsx(
                                                'group flex items-center rounded px-1.5 py-1 text-xs font-medium hover:opacity-80',
                                                priorityColors[task.priority]
                                            )}
                                        >
                                            <span className="mr-1 truncate">{task.title}</span>
                                        </div>
                                    </Link>
                                ))}
                                {dayTasks.length > 3 && (
                                    <div className="text-xs text-muted-foreground">
                                        + {dayTasks.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
