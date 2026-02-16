// Script de inicialización para MongoDB
db = db.getSiblingDB('citas-db');

db.createCollection('users');
db.createCollection('specialties');
db.createCollection('doctors');
db.createCollection('appointments');

// Crear índices
db.users.createIndex({ "email": 1 }, { unique: true });
db.specialties.createIndex({ "name": 1 }, { unique: true });
db.doctors.createIndex({ "userId": 1 }, { unique: true });
db.doctors.createIndex({ "licenseNumber": 1 }, { unique: true });
db.appointments.createIndex({ "doctorId": 1, "appointmentDate": 1, "startTime": 1 });
db.appointments.createIndex({ "patientId": 1, "appointmentDate": 1 });

// Seed de Especialidades
const specialties = [
    {
        _id: ObjectId(),
        name: 'Cardiología',
        description: 'Especialidad médica que se encarga del estudio, diagnóstico y tratamiento de las enfermedades del corazón y del aparato circulatorio.',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId(),
        name: 'Pediatría',
        description: 'Rama de la medicina que se especializa en la salud y las enfermedades de los niños desde el nacimiento hasta la adolescencia.',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId(),
        name: 'Dermatología',
        description: 'Especialidad médica que se ocupa del diagnóstico y tratamiento de las enfermedades de la piel, el cabello y las uñas.',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId(),
        name: 'Traumatología',
        description: 'Rama de la medicina que se dedica al estudio de las lesiones del aparato locomotor: huesos, articulaciones, ligamentos, tendones y músculos.',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId(),
        name: 'Ginecología',
        description: 'Especialidad médica dedicada al cuidado del sistema reproductor femenino (útero, vagina y ovarios).',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId(),
        name: 'Oftalmología',
        description: 'Especialidad médica que estudia las enfermedades del ojo y su tratamiento, incluyendo el globo ocular, la musculatura y el sistema lagrimal.',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId(),
        name: 'Neurología',
        description: 'Especialidad médica que trata los trastornos del sistema nervioso, incluyendo cerebro, médula espinal, nervios periféricos y músculos.',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId(),
        name: 'Psiquiatría',
        description: 'Rama de la medicina dedicada al estudio y tratamiento de los trastornos mentales, emocionales y del comportamiento.',
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

db.specialties.insertMany(specialties);

// Obtener IDs de especialidades para asignar a los doctores
const cardiologia = db.specialties.findOne({ name: 'Cardiología' });
const pediatria = db.specialties.findOne({ name: 'Pediatría' });

// Seed de Usuarios (Médicos)
// Nota: La contraseña es 'password123' hasheada con bcrypt (10 rounds)
const hashedPassword = '$2b$10$K7L1OJ45/4Y2nxTHtqBVq.9C3w3GVT2vEHJLGi7q6VU3yG9bsJ95O';

const doctor1User = {
    _id: ObjectId(),
    email: 'dr.martinez@hospital.com',
    password: hashedPassword,
    name: 'Dr. Carlos Martínez',
    role: 'MEDICO',
    phone: '+57 300 123 4567',
    createdAt: new Date(),
    updatedAt: new Date()
};

const doctor2User = {
    _id: ObjectId(),
    email: 'dra.rodriguez@hospital.com',
    password: hashedPassword,
    name: 'Dra. Ana Rodríguez',
    role: 'MEDICO',
    phone: '+57 301 987 6543',
    createdAt: new Date(),
    updatedAt: new Date()
};

db.users.insertMany([doctor1User, doctor2User]);

// Seed de Doctores
const doctors = [
    {
        _id: ObjectId(),
        userId: doctor1User._id,
        name: doctor1User.name,
        email: doctor1User.email,
        password: doctor1User.password,
        phone: doctor1User.phone,
        specialtyId: cardiologia._id.toString(),
        licenseNumber: 'MED-2024-001',
        workSchedule: [
            {
                dayOfWeek: 1, // Lunes
                startTime: '08:00',
                endTime: '16:00',
                isActive: true
            },
            {
                dayOfWeek: 2, // Martes
                startTime: '08:00',
                endTime: '16:00',
                isActive: true
            },
            {
                dayOfWeek: 3, // Miércoles
                startTime: '08:00',
                endTime: '16:00',
                isActive: true
            },
            {
                dayOfWeek: 4, // Jueves
                startTime: '08:00',
                endTime: '16:00',
                isActive: true
            },
            {
                dayOfWeek: 5, // Viernes
                startTime: '08:00',
                endTime: '14:00',
                isActive: true
            }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId(),
        userId: doctor2User._id,
        name: doctor2User.name,
        email: doctor2User.email,
        password: doctor2User.password,
        phone: doctor2User.phone,
        specialtyId: pediatria._id.toString(),
        licenseNumber: 'MED-2024-002',
        workSchedule: [
            {
                dayOfWeek: 1, // Lunes
                startTime: '09:00',
                endTime: '17:00',
                isActive: true
            },
            {
                dayOfWeek: 2, // Martes
                startTime: '09:00',
                endTime: '17:00',
                isActive: true
            },
            {
                dayOfWeek: 3, // Miércoles
                startTime: '09:00',
                endTime: '17:00',
                isActive: true
            },
            {
                dayOfWeek: 5, // Viernes
                startTime: '09:00',
                endTime: '15:00',
                isActive: true
            }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

db.doctors.insertMany(doctors);

print('Database initialized successfully with seed data!');
print('Specialties created: ' + db.specialties.countDocuments());
print('Doctors created: ' + db.doctors.countDocuments());
print('\nDoctor credentials for testing:');
print('1. Email: dr.martinez@hospital.com | Password: password123 | Specialty: Cardiología');
print('2. Email: dra.rodriguez@hospital.com | Password: password123 | Specialty: Pediatría');
