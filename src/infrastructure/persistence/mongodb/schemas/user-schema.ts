import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../../../../domain/entity/user';

export interface IUserDocument extends Document {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
