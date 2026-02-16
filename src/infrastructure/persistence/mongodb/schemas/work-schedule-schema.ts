import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkScheduleDocument extends Document {
    doctorId: mongoose.Types.ObjectId;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
}

const WorkScheduleSchema = new Schema<IWorkScheduleDocument>(
    {
        doctorId: {
            type: Schema.Types.ObjectId,
            ref: 'Doctor',
            required: true,
        },
        dayOfWeek: {
            type: Number,
            required: true,
            min: 0,
            max: 6,
        },
        startTime: {
            type: String,
            required: true,
            match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        },
        endTime: {
            type: String,
            required: true,
            match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: false,
    }
);

WorkScheduleSchema.index({ doctorId: 1, dayOfWeek: 1 });

export const WorkScheduleModel = mongoose.model<IWorkScheduleDocument>('WorkSchedule', WorkScheduleSchema);
