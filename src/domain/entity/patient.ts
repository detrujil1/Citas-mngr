export interface IPatient {
    id: string;
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

export class Patient {
    constructor(private readonly data: IPatient) {}

    get id(): string {
        return this.data.id;
    }

    get name(): string {
        return this.data.name;
    }

    get email(): string {
        return this.data.email;
    }

    get password(): string {
        return this.data.password;
    }

    get phone(): string | undefined {
        return this.data.phone;
    }

    get dateOfBirth(): Date | undefined {
        return this.data.dateOfBirth;
    }

    get address(): string | undefined {
        return this.data.address;
    }

    get emergencyContact(): string | undefined {
        return this.data.emergencyContact;
    }

    get createdAt(): Date {
        return this.data.createdAt;
    }

    get updatedAt(): Date {
        return this.data.updatedAt;
    }
}
