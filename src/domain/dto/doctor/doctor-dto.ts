export interface ICreateDoctor {
    name: string;
    email: string;
    password: string;
    phone: string;
    specialtyId: string;
    licenseNumber: string;
}

export interface IUpdateDoctor {
    name?: string;
    phone?: string;
    specialtyId?: string;
}
