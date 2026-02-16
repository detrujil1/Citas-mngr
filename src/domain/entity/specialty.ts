export interface ISpecialty {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export class Specialty {
    constructor(private readonly data: ISpecialty) {}

    get id(): string {
        return this.data.id;
    }

    get name(): string {
        return this.data.name;
    }

    get description(): string {
        return this.data.description;
    }

    get createdAt(): Date {
        return this.data.createdAt;
    }

    get updatedAt(): Date {
        return this.data.updatedAt;
    }

    toJSON(): ISpecialty {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
