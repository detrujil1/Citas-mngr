import mongoose, { Schema, Document } from 'mongoose';

export interface IPatientDocument extends Document {
    name: string;
    email: string;
    password: string;
    phone?: string;
    dateOfBirth?: Date;
    address?: string;
    emergencyContact?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PatientSchema = new Schema<IPatientDocument>(
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
        dateOfBirth: {
            type: Date,
        },
        address: {
            type: String,
        },
        emergencyContact: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const PatientModel = mongoose.model<IPatientDocument>('Patient', PatientSchema);
