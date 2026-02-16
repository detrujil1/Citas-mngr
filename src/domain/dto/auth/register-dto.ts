export interface IRegisterDoctor {
    name: string;
    email: string;
    password: string;
    phone: string;
    specialtyId: string;
    licenseNumber: string;
    workSchedule?: Array<{
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        isActive: boolean;
    }>;
}

export interface IRegisterPatient {
    name: string;
    email: string;
    password: string;
    phone: string;
    dateOfBirth?: string;
    address?: string;
    emergencyContact?: string;
}

export interface IAuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        [key: string]: any;
    };
}
