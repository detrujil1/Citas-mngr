# 📋 API Specification - Backend Documentation

## Índice
1. [Información General](#información-general)
2. [Autenticación](#autenticación)
3. [Endpoints - Auth](#endpoints---auth)
4. [Endpoints - Especialidades](#endpoints---especialidades)
5. [Endpoints - Médicos](#endpoints---médicos)
6. [Endpoints - Pacientes](#endpoints---pacientes)
7. [Endpoints - Citas](#endpoints---citas)
8. [Modelos de Datos](#modelos-de-datos)
9. [Códigos de Estado](#códigos-de-estado)
10. [Validaciones Requeridas](#validaciones-requeridas)
11. [CORS Configuration](#cors-configuration)

---

## Información General

### Base URL
```
http://localhost:8080/api
```

### Headers Estándar

**Todos los requests incluyen:**
```http
X-RqUID: <uuid-v4>
Content-Type: application/json
```

**Endpoints autenticados incluyen:**
```http
Authorization: Bearer <jwt-token>
```

### Formato de Respuesta

**Éxito:**
```json
{
  "data": <T>,
  "message": "Operación exitosa" // opcional
}
```

**Error:**
```json
{
  "error": "Mensaje de error descriptivo",
  "statusCode": 400,
  "timestamp": "2026-02-16T10:30:00Z" // opcional
}
```

---

## Autenticación

El sistema usa **JWT (JSON Web Tokens)** para autenticación.

### Estructura del JWT

**Payload:**
```json
{
  "sub": "123",           // ID del usuario (médico o paciente)
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "roles": ["MEDICO"],    // ["PACIENTE"] o ["MEDICO"]
  "iat": 1516239022,
  "exp": 1516242622
}
```

### Roles

- `PACIENTE` - Puede buscar médicos y agendar citas
- `MEDICO` - Puede gestionar su agenda y consultas

---

## Endpoints - Auth

### 1. Login

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "phone": "+57 300 1234567",
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-01-15T10:00:00Z"
    }
  }
}
```

**Errores:**
- `401` - Credenciales inválidas
- `400` - Campos faltantes

---

### 2. Registro de Médico

```http
POST /api/auth/register/doctor
```

**Request Body:**
```json
{
  "name": "Dr. Juan Pérez",
  "email": "doctor@example.com",
  "password": "password123",
  "phone": "+57 300 1234567",
  "specialtyId": 1,
  "licenseNumber": "MP-12345"
}
```

**Response (201 Created):**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Dr. Juan Pérez",
      "email": "doctor@example.com",
      "phone": "+57 300 1234567",
      "specialtyId": 1,
      "licenseNumber": "MP-12345",
      "createdAt": "2026-02-16T10:00:00Z"
    }
  }
}
```

**Validaciones:**
- Email debe ser único
- Password mínimo 6 caracteres
- specialtyId debe existir
- licenseNumber debe ser único

**Errores:**
- `409` - Email ya registrado
- `400` - Validación fallida
- `404` - Especialidad no encontrada

---

### 3. Registro de Paciente

```http
POST /api/auth/register/patient
```

**Request Body:**
```json
{
  "name": "María García",
  "email": "paciente@example.com",
  "password": "password123",
  "phone": "+57 300 9876543",
  "dateOfBirth": "1990-05-15",
  "address": "Calle 123 #45-67",
  "emergencyContact": "+57 300 1111111"
}
```

**Response (201 Created):**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 2,
      "name": "María García",
      "email": "paciente@example.com",
      "phone": "+57 300 9876543",
      "dateOfBirth": "1990-05-15",
      "address": "Calle 123 #45-67",
      "emergencyContact": "+57 300 1111111",
      "createdAt": "2026-02-16T10:00:00Z"
    }
  }
}
```

**Validaciones:**
- Email debe ser único
- Password mínimo 6 caracteres

**Errores:**
- `409` - Email ya registrado
- `400` - Validación fallida

---

### 4. Verificar Token

```http
GET /api/auth/verify
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "data": {
    "valid": true
  }
}
```

**Errores:**
- `401` - Token inválido o expirado

---

## Endpoints - Especialidades

### 1. Listar Todas las Especialidades

```http
GET /api/specialties
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Cardiología",
      "description": "Especialidad médica del corazón y sistema cardiovascular",
      "createdAt": "2026-01-01T00:00:00Z",
      "updatedAt": "2026-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "name": "Dermatología",
      "description": "Especialidad de la piel y sus enfermedades",
      "createdAt": "2026-01-01T00:00:00Z",
      "updatedAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

---

### 2. Obtener Especialidad por ID

```http
GET /api/specialties/{id}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "name": "Cardiología",
    "description": "Especialidad médica del corazón y sistema cardiovascular",
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  }
}
```

**Errores:**
- `404` - Especialidad no encontrada

---

### 3. Crear Especialidad (ADMIN)

```http
POST /api/specialties
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "Neurología",
  "description": "Especialidad del sistema nervioso"
}
```

**Response (201 Created):**
```json
{
  "data": {
    "id": 3,
    "name": "Neurología",
    "description": "Especialidad del sistema nervioso",
    "createdAt": "2026-02-16T10:00:00Z",
    "updatedAt": "2026-02-16T10:00:00Z"
  }
}
```

**Validaciones:**
- name es requerido y único

---

### 4. Actualizar Especialidad (ADMIN)

```http
PUT /api/specialties/{id}
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "Neurología Clínica",
  "description": "Especialidad actualizada"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 3,
    "name": "Neurología Clínica",
    "description": "Especialidad actualizada",
    "updatedAt": "2026-02-16T10:30:00Z"
  }
}
```

---

### 5. Eliminar Especialidad (ADMIN)

```http
DELETE /api/specialties/{id}
Authorization: Bearer <admin-token>
```

**Response (204 No Content)**

**Errores:**
- `404` - Especialidad no encontrada
- `409` - No se puede eliminar si tiene médicos asociados

---

## Endpoints - Médicos

### 1. Listar Todos los Médicos

```http
GET /api/doctors
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Dr. Juan Pérez",
      "email": "doctor@example.com",
      "phone": "+57 300 1234567",
      "specialtyId": 1,
      "specialty": {
        "id": 1,
        "name": "Cardiología",
        "description": "..."
      },
      "licenseNumber": "MP-12345",
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-01-15T10:00:00Z"
    }
  ]
}
```

---

### 2. Obtener Médicos por Especialidad

```http
GET /api/doctors/specialty/{specialtyId}
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Dr. Juan Pérez",
      "email": "doctor@example.com",
      "phone": "+57 300 1234567",
      "specialtyId": 1,
      "specialty": {
        "id": 1,
        "name": "Cardiología"
      },
      "licenseNumber": "MP-12345"
    }
  ]
}
```

---

### 3. Obtener Médico por ID

```http
GET /api/doctors/{id}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "name": "Dr. Juan Pérez",
    "email": "doctor@example.com",
    "phone": "+57 300 1234567",
    "specialtyId": 1,
    "specialty": {
      "id": 1,
      "name": "Cardiología",
      "description": "..."
    },
    "licenseNumber": "MP-12345",
    "workSchedule": [
      {
        "id": 1,
        "doctorId": 1,
        "dayOfWeek": 1,
        "startTime": "08:00",
        "endTime": "17:00",
        "isActive": true
      }
    ],
    "createdAt": "2026-01-15T10:00:00Z",
    "updatedAt": "2026-01-15T10:00:00Z"
  }
}
```

---

### 4. Actualizar Perfil de Médico

```http
PUT /api/doctors/{id}
Authorization: Bearer <doctor-token>
```

**Request Body:**
```json
{
  "name": "Dr. Juan Carlos Pérez",
  "phone": "+57 300 9999999",
  "specialtyId": 2
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "name": "Dr. Juan Carlos Pérez",
    "phone": "+57 300 9999999",
    "specialtyId": 2,
    "updatedAt": "2026-02-16T11:00:00Z"
  }
}
```

**Validaciones:**
- Solo el médico puede actualizar su propio perfil

---

### 5. Obtener Horario del Médico

```http
GET /api/doctors/{doctorId}/schedule
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "doctorId": 1,
      "dayOfWeek": 1,
      "startTime": "08:00",
      "endTime": "17:00",
      "isActive": true
    },
    {
      "id": 2,
      "doctorId": 1,
      "dayOfWeek": 2,
      "startTime": "08:00",
      "endTime": "17:00",
      "isActive": true
    }
  ]
}
```

**dayOfWeek:** 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

---

### 6. Actualizar Horario del Médico

```http
PUT /api/doctors/{doctorId}/schedule
Authorization: Bearer <doctor-token>
```

**Request Body:**
```json
{
  "schedules": [
    {
      "dayOfWeek": 1,
      "startTime": "08:00",
      "endTime": "17:00",
      "isActive": true
    },
    {
      "dayOfWeek": 2,
      "startTime": "08:00",
      "endTime": "14:00",
      "isActive": true
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "doctorId": 1,
      "dayOfWeek": 1,
      "startTime": "08:00",
      "endTime": "17:00",
      "isActive": true
    },
    {
      "id": 2,
      "doctorId": 1,
      "dayOfWeek": 2,
      "startTime": "08:00",
      "endTime": "14:00",
      "isActive": true
    }
  ]
}
```

---

## Endpoints - Pacientes

### 1. Obtener Paciente por ID

```http
GET /api/patients/{id}
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 2,
    "name": "María García",
    "email": "paciente@example.com",
    "phone": "+57 300 9876543",
    "dateOfBirth": "1990-05-15",
    "address": "Calle 123 #45-67",
    "emergencyContact": "+57 300 1111111",
    "createdAt": "2026-01-20T10:00:00Z",
    "updatedAt": "2026-01-20T10:00:00Z"
  }
}
```

---

### 2. Actualizar Perfil de Paciente

```http
PUT /api/patients/{id}
Authorization: Bearer <patient-token>
```

**Request Body:**
```json
{
  "name": "María Fernanda García",
  "phone": "+57 300 8888888",
  "address": "Nueva dirección"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 2,
    "name": "María Fernanda García",
    "phone": "+57 300 8888888",
    "address": "Nueva dirección",
    "updatedAt": "2026-02-16T11:30:00Z"
  }
}
```

---

## Endpoints - Citas

### 1. Listar Citas con Filtros

```http
GET /api/appointments?doctorId={id}&patientId={id}&status={status}&startDate={date}&endDate={date}
Authorization: Bearer <token>
```

**Query Parameters (todos opcionales):**
- `doctorId` - Filtrar por médico
- `patientId` - Filtrar por paciente
- `status` - `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`, `NO_SHOW`
- `startDate` - Fecha inicio (YYYY-MM-DD)
- `endDate` - Fecha fin (YYYY-MM-DD)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "patientId": 2,
      "patient": {
        "id": 2,
        "name": "María García",
        "phone": "+57 300 9876543"
      },
      "doctorId": 1,
      "doctor": {
        "id": 1,
        "name": "Dr. Juan Pérez",
        "specialty": {
          "id": 1,
          "name": "Cardiología"
        }
      },
      "appointmentDate": "2026-02-20",
      "startTime": "09:00",
      "endTime": "09:30",
      "status": "CONFIRMED",
      "reason": "Control rutinario",
      "notes": null,
      "createdAt": "2026-02-16T10:00:00Z",
      "updatedAt": "2026-02-16T10:00:00Z"
    }
  ]
}
```

---

### 2. Obtener Mis Citas (Paciente)

```http
GET /api/appointments/my-appointments
Authorization: Bearer <patient-token>
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "doctorId": 1,
      "doctor": {
        "id": 1,
        "name": "Dr. Juan Pérez",
        "phone": "+57 300 1234567",
        "specialty": {
          "id": 1,
          "name": "Cardiología"
        }
      },
      "appointmentDate": "2026-02-20",
      "startTime": "09:00",
      "endTime": "09:30",
      "status": "CONFIRMED",
      "reason": "Control rutinario",
      "notes": null
    }
  ]
}
```

---

### 3. Obtener Citas del Médico

```http
GET /api/appointments/doctor/{doctorId}
Authorization: Bearer <doctor-token>
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "patientId": 2,
      "patient": {
        "id": 2,
        "name": "María García",
        "phone": "+57 300 9876543"
      },
      "appointmentDate": "2026-02-20",
      "startTime": "09:00",
      "endTime": "09:30",
      "status": "PENDING",
      "reason": "Control rutinario"
    }
  ]
}
```

---

### 4. Obtener Cita por ID

```http
GET /api/appointments/{id}
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "patientId": 2,
    "patient": {
      "id": 2,
      "name": "María García",
      "phone": "+57 300 9876543",
      "email": "paciente@example.com"
    },
    "doctorId": 1,
    "doctor": {
      "id": 1,
      "name": "Dr. Juan Pérez",
      "specialty": {
        "id": 1,
        "name": "Cardiología"
      }
    },
    "appointmentDate": "2026-02-20",
    "startTime": "09:00",
    "endTime": "09:30",
    "status": "CONFIRMED",
    "reason": "Control rutinario",
    "notes": "Paciente en buen estado general",
    "createdAt": "2026-02-16T10:00:00Z",
    "updatedAt": "2026-02-16T11:00:00Z"
  }
}
```

---

### 5. Crear Cita (Paciente)

```http
POST /api/appointments
Authorization: Bearer <patient-token>
```

**Request Body:**
```json
{
  "doctorId": 1,
  "appointmentDate": "2026-02-25",
  "startTime": "10:00",
  "reason": "Dolor de pecho"
}
```

**Response (201 Created):**
```json
{
  "data": {
    "id": 5,
    "patientId": 2,
    "doctorId": 1,
    "appointmentDate": "2026-02-25",
    "startTime": "10:00",
    "endTime": "10:30",
    "status": "PENDING",
    "reason": "Dolor de pecho",
    "createdAt": "2026-02-16T12:00:00Z"
  }
}
```

**Validaciones CRÍTICAS:**
1. ✅ appointmentDate no puede ser fecha pasada
2. ✅ startTime debe estar en el horario de trabajo del médico
3. ✅ No puede haber solapamiento con otras citas del médico
4. ✅ El médico debe existir y estar activo
5. ✅ Calcular automáticamente endTime (startTime + 30 minutos)

**Errores:**
- `400` - Validación fallida
- `404` - Médico no encontrado
- `409` - Horario no disponible (solapamiento)

---

### 6. Actualizar Cita

```http
PUT /api/appointments/{id}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "CONFIRMED",
  "notes": "Paciente estable",
  "appointmentDate": "2026-02-26",
  "startTime": "11:00"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "status": "CONFIRMED",
    "notes": "Paciente estable",
    "updatedAt": "2026-02-16T12:30:00Z"
  }
}
```

**Validaciones:**
- Solo el médico puede cambiar status y notes
- Solo el paciente puede cancelar (cambiar a CANCELLED)
- No se puede modificar cita COMPLETED

---

### 7. Eliminar/Cancelar Cita

```http
DELETE /api/appointments/{id}
Authorization: Bearer <token>
```

**Response (204 No Content)**

**Validaciones:**
- Solo el paciente o médico relacionado puede eliminar
- Puede ser soft delete (cambiar status a CANCELLED)

---

### 8. Obtener Slots Disponibles ⭐ IMPORTANTE

```http
GET /api/appointments/available-slots/{doctorId}?date=2026-02-25
Authorization: Bearer <token>
```

**Query Parameters:**
- `date` - Fecha en formato YYYY-MM-DD (requerido)

**Response (200 OK):**
```json
{
  "data": [
    {
      "date": "2026-02-25",
      "startTime": "08:00",
      "endTime": "08:30",
      "isAvailable": true
    },
    {
      "date": "2026-02-25",
      "startTime": "08:30",
      "endTime": "09:00",
      "isAvailable": true
    },
    {
      "date": "2026-02-25",
      "startTime": "09:00",
      "endTime": "09:30",
      "isAvailable": false
    }
  ]
}
```

**Lógica del Backend:**
1. Obtener horario de trabajo del médico para el día de la semana
2. Generar slots de 30 minutos dentro del horario
3. Verificar citas existentes y marcar slots ocupados
4. Retornar solo slots dentro del horario laboral

**Ejemplo de Lógica:**
```
Si el médico trabaja Lunes 08:00-17:00:
- Generar slots: 08:00-08:30, 08:30-09:00, ..., 16:30-17:00
- Si existe cita 09:00-09:30, ese slot isAvailable = false
- Retornar todos los slots con su estado
```

---

### 9. Validar Slot Disponible

```http
POST /api/appointments/validate-slot
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "doctorId": 1,
  "date": "2026-02-25",
  "startTime": "10:00"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "available": true
  }
}
```

o

```json
{
  "data": {
    "available": false
  }
}
```

---

## Modelos de Datos

### User (Base)
```typescript
{
  id: number
  name: string
  email: string (unique)
  password: string (hashed)
  phone?: string
  createdAt: Date
  updatedAt: Date
}
```

### Doctor (extends User)
```typescript
{
  ...User,
  specialtyId: number
  specialty?: Specialty
  licenseNumber: string (unique)
  workSchedule?: WorkSchedule[]
}
```

### Patient (extends User)
```typescript
{
  ...User,
  dateOfBirth?: Date
  address?: string
  emergencyContact?: string
}
```

### Specialty
```typescript
{
  id: number
  name: string (unique)
  description?: string
  createdAt: Date
  updatedAt: Date
}
```

### WorkSchedule
```typescript
{
  id: number
  doctorId: number
  dayOfWeek: number (0-6)
  startTime: string (HH:mm)
  endTime: string (HH:mm)
  isActive: boolean
}
```

### Appointment
```typescript
{
  id: number
  patientId: number
  patient?: Patient
  doctorId: number
  doctor?: Doctor
  appointmentDate: Date (YYYY-MM-DD)
  startTime: string (HH:mm)
  endTime: string (HH:mm)
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'
  reason?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}
```

---

## Códigos de Estado

- `200 OK` - Operación exitosa
- `201 Created` - Recurso creado exitosamente
- `204 No Content` - Eliminación exitosa
- `400 Bad Request` - Validación fallida
- `401 Unauthorized` - No autenticado o token inválido
- `403 Forbidden` - No tiene permisos
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Conflicto (email duplicado, horario ocupado)
- `422 Unprocessable Entity` - Validación de negocio fallida
- `500 Internal Server Error` - Error del servidor

---

## Validaciones Requeridas

### Citas (Appointment)

#### Crear Cita
1. ✅ **Fecha futura**: appointmentDate >= hoy
2. ✅ **Horario laboral**: startTime dentro del horario del médico para ese día
3. ✅ **No solapamiento**: 
   ```
   No debe existir otra cita para el médico donde:
   (nueva.startTime < existente.endTime) AND (nueva.endTime > existente.startTime)
   ```
4. ✅ **Duración**: endTime = startTime + 30 minutos
5. ✅ **Médico activo**: El médico debe existir
6. ✅ **Paciente autenticado**: El patientId debe ser del usuario autenticado

#### Actualizar Cita
1. ✅ **Permisos**: 
   - Médico solo puede actualizar sus propias citas
   - Paciente solo puede cancelar sus propias citas
2. ✅ **Estado válido**: No se puede modificar cita COMPLETED
3. ✅ **Transiciones válidas**:
   - PENDING → CONFIRMED (médico)
   - PENDING → CANCELLED (médico o paciente)
   - CONFIRMED → COMPLETED (médico)
   - CONFIRMED → CANCELLED (médico o paciente)
   - CONFIRMED → NO_SHOW (médico)

### Usuarios

#### Registro
1. ✅ Email único
2. ✅ Password mínimo 6 caracteres
3. ✅ Email formato válido
4. ✅ (Médico) specialtyId debe existir
5. ✅ (Médico) licenseNumber único

### Horarios (WorkSchedule)

1. ✅ startTime < endTime
2. ✅ dayOfWeek entre 0-6
3. ✅ Formato de hora válido HH:mm
4. ✅ No puede haber solapamiento de horarios para el mismo día

---

## CORS Configuration

El backend debe permitir requests desde el frontend:

```javascript
// Configuración CORS recomendada (desarrollo)
cors({
  // Opción 1: Lista explícita de orígenes permitidos
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  
  // Opción 2 (Recomendada para desarrollo): Regex para cualquier puerto localhost
  // origin: /^http:\/\/localhost:\d+$/,
  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-RqUID'],
  credentials: true
})

// Para producción, especificar el dominio exacto:
// origin: 'https://tu-dominio-produccion.com'
```

---

## Seguridad

### Endpoints Públicos (Sin autenticación)
- `POST /api/auth/login`
- `POST /api/auth/register/doctor`
- `POST /api/auth/register/patient`
- `GET /api/specialties`
- `GET /api/specialties/{id}`
- `GET /api/doctors`
- `GET /api/doctors/specialty/{id}`
- `GET /api/doctors/{id}`
- `GET /api/doctors/{id}/schedule`

### Endpoints Autenticados
- Todos los demás requieren `Authorization: Bearer <token>`

### Validación de Permisos
- **Médicos** solo pueden:
  - Ver y gestionar sus propias citas
  - Actualizar su propio perfil y horario
  
- **Pacientes** solo pueden:
  - Ver y gestionar sus propias citas
  - Actualizar su propio perfil

---

## Datos de Semilla (Seeds)

Para testing, se recomienda crear:

### Especialidades
```sql
INSERT INTO specialties (name, description) VALUES
('Cardiología', 'Especialidad del corazón y sistema cardiovascular'),
('Dermatología', 'Especialidad de la piel'),
('Neurología', 'Especialidad del sistema nervioso'),
('Pediatría', 'Especialidad infantil'),
('Medicina General', 'Atención médica general');
```

### Usuario de Prueba - Médico
```
Email: doctor@test.com
Password: password123
Specialty: Cardiología
License: MP-12345
```

### Usuario de Prueba - Paciente
```
Email: paciente@test.com
Password: password123
```

---

## Testing del Backend

### Casos de Prueba Críticos

1. **Crear cita en horario disponible** → ✅ 201 Created
2. **Crear cita fuera de horario** → ❌ 409 Conflict
3. **Crear cita con solapamiento** → ❌ 409 Conflict
4. **Crear cita en fecha pasada** → ❌ 400 Bad Request
5. **Obtener slots disponibles** → ✅ 200 OK con slots correctos
6. **Login con credenciales correctas** → ✅ 200 OK con token
7. **Login con credenciales incorrectas** → ❌ 401 Unauthorized
8. **Registro con email duplicado** → ❌ 409 Conflict

---

## Contacto y Soporte

Para dudas sobre la implementación del backend:
1. Revisar los types en `src/types/` del frontend
2. Revisar los servicios en `src/services/` para ver el contrato esperado
3. Verificar las validaciones en `src/services/appointment-service.ts`

---

## Notas Finales

- Todos los timestamps deben ser UTC
- Las fechas deben seguir formato ISO 8601
- Los horarios deben ser formato 24 horas (HH:mm)
- El backend debe implementar validaciones tanto en request como en lógica de negocio
- Se recomienda usar transacciones para operaciones críticas (crear citas)
- Implementar logs para debugging
- Usar migrations para la base de datos

¡Este documento es tu guía completa para implementar el backend! 🚀
