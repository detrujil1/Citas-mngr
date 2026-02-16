import mongoose, { Schema, Document } from 'mongoose';

export interface ISpecialtyDocument extends Document {
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

const SpecialtySchema = new Schema<ISpecialtyDocument>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const SpecialtyModel = mongoose.model<ISpecialtyDocument>('Specialty', SpecialtySchema);
