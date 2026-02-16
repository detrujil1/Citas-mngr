import bcrypt from 'bcrypt';
import { IRegisterDoctor, IRegisterPatient, IAuthResponse } from '../../domain/dto/auth/register-dto';
import { MongoAuthCreator } from '../../infrastructure/persistence/mongodb/repositories/auth-creator';
import { JWTAuthenticatorAdapter } from '../../infrastructure/adapter/jwt/authentication';
import { UserRole } from '../../domain/entity/user';
import { MongoDoctorRepository } from '../../infrastructure/persistence/mongodb/repositories/doctor-repository';
import { MongoPatientRepository } from '../../infrastructure/persistence/mongodb/repositories/patient-repository';

export class AuthService {
    constructor(
        private readonly authCreator: MongoAuthCreator,
        private readonly authenticator: JWTAuthenticatorAdapter,
        private readonly doctorRepository: MongoDoctorRepository,
        private readonly patientRepository: MongoPatientRepository
    ) {}

    async registerDoctor(data: IRegisterDoctor): Promise<IAuthResponse> {
        // Verificar si el email ya existe
        const existingDoctor = await this.doctorRepository.findByEmail(data.email);
        if (existingDoctor) {
            throw new Error('Email already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Crear doctor
        const doctor = await this.authCreator.createDoctor({
            ...data,
            password: hashedPassword,
        });

        // Generar token
        const token = await this.authenticator.generateToken(
            doctor.id,
            doctor.email,
            UserRole.MEDICO
        );

        return {
            token,
            user: {
                id: doctor.id,
                name: doctor.name,
                email: doctor.email,
                phone: doctor.phone,
                specialtyId: doctor.specialtyId,
                licenseNumber: doctor.licenseNumber,
                createdAt: doctor.createdAt,
                updatedAt: doctor.updatedAt,
            },
        };
    }

    async registerPatient(data: IRegisterPatient): Promise<IAuthResponse> {
        // Verificar si elmail ya existe
        const existingPatient = await this.patientRepository.findByEmail(data.email);
        if (existingPatient) {
            throw new Error('Email already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Crear paciente
        const patient = await this.authCreator.createPatient({
            ...data,
            password: hashedPassword,
        });

        // Generar token
        const token = await this.authenticator.generateToken(
            patient.id,
            patient.email,
            UserRole.PACIENTE
        );

        return {
            token,
            user: {
                id: patient.id,
                name: patient.name,
                email: patient.email,
                phone: patient.phone,
                dateOfBirth: patient.dateOfBirth,
                address: patient.address,
                emergencyContact: patient.emergencyContact,
                createdAt: patient.createdAt,
                updatedAt: patient.updatedAt,
            },
        };
    }

    async login(email: string, password: string): Promise<IAuthResponse> {
        // Buscar en doctors
        let user: any = await this.doctorRepository.findByEmail(email);
        let role = UserRole.MEDICO;

        // Si no es doctor, buscar en patients
        if (!user) {
            user = await this.patientRepository.findByEmail(email);
            role = UserRole.PACIENTE;
        }

        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Verificar contraseña
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        // Generar token
        const token = await this.authenticator.generateToken(
            user.id,
            user.email,
            role
        );

        // Preparar respuesta de usuario
        const userResponse: any = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        // Agregar campos específicos según el rol
        if (role === UserRole.MEDICO) {
            userResponse.specialtyId = user.specialtyId;
            userResponse.licenseNumber = user.licenseNumber;
        } else {
            userResponse.dateOfBirth = user.dateOfBirth;
            userResponse.address = user.address;
            userResponse.emergencyContact = user.emergencyContact;
        }

        return {
            token,
            user: userResponse,
        };
    }
}
