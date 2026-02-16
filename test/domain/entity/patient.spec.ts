import { Patient } from '../../../src/domain/entity/patient';

describe('Patient Entity', () => {
    const mockPatientData = {
        id: 'patient-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        phone: '1234567890',
        dateOfBirth: new Date('1990-01-01'),
        address: '123 Main St',
        emergencyContact: 'Jane Doe - 0987654321',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
    };

    describe('constructor', () => {
        it('should create a patient instance with all fields', () => {
            const patient = new Patient(mockPatientData);

            expect(patient).toBeInstanceOf(Patient);
            expect(patient.id).toBe('patient-123');
            expect(patient.name).toBe('John Doe');
            expect(patient.email).toBe('john@example.com');
        });

        it('should create a patient with optional fields as undefined', () => {
            const minimalData = {
                id: 'patient-456',
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: 'hashed',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const patient = new Patient(minimalData);

            expect(patient.phone).toBeUndefined();
            expect(patient.dateOfBirth).toBeUndefined();
            expect(patient.address).toBeUndefined();
            expect(patient.emergencyContact).toBeUndefined();
        });
    });

    describe('getters', () => {
        it('should access id', () => {
            const patient = new Patient(mockPatientData);
            expect(patient.id).toBe('patient-123');
        });

        it('should access name', () => {
            const patient = new Patient(mockPatientData);
            expect(patient.name).toBe('John Doe');
        });

        it('should access email', () => {
            const patient = new Patient(mockPatientData);
            expect(patient.email).toBe('john@example.com');
        });

        it('should access password', () => {
            const patient = new Patient(mockPatientData);
            expect(patient.password).toBe('hashedPassword');
        });

        it('should access phone', () => {
            const patient = new Patient(mockPatientData);
            expect(patient.phone).toBe('1234567890');
        });

        it('should access dateOfBirth', () => {
            const patient = new Patient(mockPatientData);
            expect(patient.dateOfBirth).toEqual(new Date('1990-01-01'));
        });

        it('should access address', () => {
            const patient = new Patient(mockPatientData);
            expect(patient.address).toBe('123 Main St');
        });

        it('should access emergencyContact', () => {
            const patient = new Patient(mockPatientData);
            expect(patient.emergencyContact).toBe('Jane Doe - 0987654321');
        });

        it('should access createdAt', () => {
            const patient = new Patient(mockPatientData);
            expect(patient.createdAt).toEqual(new Date('2024-01-01'));
        });

        it('should access updatedAt', () => {
            const patient = new Patient(mockPatientData);
            expect(patient.updatedAt).toEqual(new Date('2024-01-02'));
        });
    });

    describe('optional fields', () => {
        it('should handle undefined phone', () => {
            const data = { ...mockPatientData, phone: undefined };
            const patient = new Patient(data);
            expect(patient.phone).toBeUndefined();
        });

        it('should handle undefined dateOfBirth', () => {
            const data = { ...mockPatientData, dateOfBirth: undefined };
            const patient = new Patient(data);
            expect(patient.dateOfBirth).toBeUndefined();
        });

        it('should handle undefined address', () => {
            const data = { ...mockPatientData, address: undefined };
            const patient = new Patient(data);
            expect(patient.address).toBeUndefined();
        });

        it('should handle undefined emergencyContact', () => {
            const data = { ...mockPatientData, emergencyContact: undefined };
            const patient = new Patient(data);
            expect(patient.emergencyContact).toBeUndefined();
        });
    });
});
