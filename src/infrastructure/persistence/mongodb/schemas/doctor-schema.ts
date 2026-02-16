import mongoose, { Schema, Document } from 'mongoose';

export interface IDoctorDocument extends Document {
    name: string;
    email: string;
    password: string;
    phone?: string;
    specialtyId: string; // Cambiar de ObjectId a string
    licenseNumber: string;
    workSchedule?: Array<{
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        isActive: boolean;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const DoctorSchema = new Schema<IDoctorDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
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
        phone: {
            type: String,
            trim: true,
        },
        specialtyId: {
            type: String, // Cambiar de Schema.Types.ObjectId a String
            required: true,
        },
        licenseNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        workSchedule: [{
            dayOfWeek: {
                type: Number,
                required: true,
                min: 0,
                max: 6,
            },
            startTime: {
                type: String,
                required: true,
            },
            endTime: {
                type: String,
                required: true,
            },
            isActive: {
                type: Boolean,
                default: true,
            },
        }],
    },
    {
        timestamps: true,
    }
);

export const DoctorModel = mongoose.model<IDoctorDocument>('Doctor', DoctorSchema);
