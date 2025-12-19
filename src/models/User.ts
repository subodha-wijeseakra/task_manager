import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
    name: string;
    email: string;
    password?: string;
    image?: string;
    role: 'student' | 'admin';
    provider: 'credentials' | 'google';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            select: false, // Don't return password by default
        },
        image: {
            type: String,
        },
        role: {
            type: String,
            enum: ['student', 'admin'],
            default: 'student',
        },
        provider: {
            type: String,
            enum: ['credentials', 'google'],
            default: 'credentials',
        },
    },
    {
        timestamps: true,
    }
);

// Prevent overwriting the model if it's already compiled
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
