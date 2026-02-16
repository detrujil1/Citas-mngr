export enum UserRole {
    PACIENTE = 'PACIENTE',
    MEDICO = 'MEDICO',
    ADMIN = 'ADMIN'
}

export interface IUser {
    id: string;
    email: string;
    password: string;
    name: string;
    role: UserRole;
    phone?: string;
    createdAt: Date;
    updatedAt: Date;
}

export class User {
    constructor(private readonly data: IUser) {}

    get id(): string {
        return this.data.id;
    }

    get email(): string {
        return this.data.email;
    }

    get password(): string {
        return this.data.password;
    }

    get name(): string {
        return this.data.name;
    }

    get role(): UserRole {
        return this.data.role;
    }

    get phone(): string | undefined {
        return this.data.phone;
    }

    get createdAt(): Date {
        return this.data.createdAt;
    }

    get updatedAt(): Date {
        return this.data.updatedAt;
    }

    isPaciente(): boolean {
        return this.data.role === UserRole.PACIENTE;
    }

    isMedico(): boolean {
        return this.data.role === UserRole.MEDICO;
    }

    isAdmin(): boolean {
        return this.data.role === UserRole.ADMIN;
    }
}
