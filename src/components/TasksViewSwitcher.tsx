'use client';

import { useState } from 'react';
import { ITask } from '@/models/Task';
import { Button } from '@/components/ui/Button';
import { MdList, MdViewKanban, MdCalendarMonth } from 'react-icons/md';
import ListView from './views/ListView';
import BoardView from './views/BoardView';
import CalendarView from './views/CalendarView';
import { clsx } from 'clsx';

interface TasksViewSwitcherProps {
    tasks: (ITask & { _id: string })[];
}

type ViewType = 'list' | 'board' | 'calendar';

export default function TasksViewSwitcher({ tasks }: TasksViewSwitcherProps) {
    const [view, setView] = useState<ViewType>('list');

    return (
        <div className="flex h-full flex-col space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 rounded-lg bg-muted p-1">
                    <button
                        onClick={() => setView('list')}
                        className={clsx(
                            'flex items-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                            view === 'list'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <MdList className="h-4 w-4" />
                        <span>List</span>
                    </button>
                    <button
                        onClick={() => setView('board')}
                        className={clsx(
                            'flex items-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                            view === 'board'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <MdViewKanban className="h-4 w-4" />
                        <span>Board</span>
                    </button>
                    <button
                        onClick={() => setView('calendar')}
                        className={clsx(
                            'flex items-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                            view === 'calendar'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <MdCalendarMonth className="h-4 w-4" />
                        <span>Calendar</span>
                    </button>
                </div>
            </div>

            <div className="flex-1">
                {view === 'list' && <ListView tasks={tasks} />}
                {view === 'board' && <BoardView tasks={tasks} />}
                {view === 'calendar' && <CalendarView tasks={tasks} />}
            </div>
        </div>
    );
}
