import mongoose, { Schema, Model, Types } from 'mongoose';

export interface ITask {
    title: string;
    description?: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date;
    assignedTo: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: [true, 'Please provide a title'],
            trim: true,
            maxlength: [100, 'Title cannot be more than 100 characters'],
        },
        description: {
            type: String,
            maxlength: [1000, 'Description cannot be more than 1000 characters'],
        },
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed'],
            default: 'pending',
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        dueDate: {
            type: Date,
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
