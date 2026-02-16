import mongoose, { Schema, Document } from 'mongoose';
import { AppointmentStatus } from '../../../../domain/entity/appointment';

export interface IAppointmentDocument extends Document {
    patientId: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
    specialtyId: mongoose.Types.ObjectId;
    appointmentDate: Date;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    reason: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointmentDocument>(
    {
        patientId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        doctorId: {
            type: Schema.Types.ObjectId,
            ref: 'Doctor',
            required: true,
        },
        specialtyId: {
            type: Schema.Types.ObjectId,
            ref: 'Specialty',
            required: true,
        },
        appointmentDate: {
            type: Date,
            required: true,
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
        status: {
            type: String,
            enum: Object.values(AppointmentStatus),
            default: AppointmentStatus.PENDING,
        },
        reason: {
            type: String,
            required: true,
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Índice compuesto para mejorar búsquedas de disponibilidad
AppointmentSchema.index({ doctorId: 1, appointmentDate: 1, startTime: 1 });
AppointmentSchema.index({ patientId: 1, appointmentDate: 1 });

export const AppointmentModel = mongoose.model<IAppointmentDocument>('Appointment', AppointmentSchema);
