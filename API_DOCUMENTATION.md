# API Documentation - Sistema de Gestión de Citas Médicas

## Base URL
```
http://localhost:3000/api/v1
```

## Headers Requeridos

Todas las peticiones deben incluir:
- `Content-Type: application/json`
- `X-RqUID: <UUID válido>` (Identificador único de la petición)

Para endpoints protegidos también:
- `Authorization: Bearer <JWT token>`

---

## Autenticación

### Registro de Usuario
**POST** `/auth/signup`

**Request Body:**
```json
{
  "email": "usuario@example.com",
  "password": "Password123!",
  "name": "Juan Pérez",
  "role": "PATIENT"
}
```

**Roles disponibles:** `PATIENT`, `DOCTOR`, `ADMIN`

**Response (201):**
```json
{
  "success": true,
  "uuid": "123e4567-e89b-12d3-a456-426614174000",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "message": "User registered successfully",
  "data": {}
}
```

### Inicio de Sesión
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "usuario@example.com",
  "password": "Password123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "uuid": "123e4567-e89b-12d3-a456-426614174000",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "message": "Login successful",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com",
    "role": "PATIENT",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Especialidades

### Listar Especialidades
**GET** `/specialties`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Cardiología",
      "description": "Especialista en enfermedades del corazón",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

### Obtener Especialidad por ID
**GET** `/specialties/:id`

### Crear Especialidad (Admin)
**POST** `/specialties`
🔒 Requiere autenticación y rol `ADMIN`

**Request Body:**
```json
{
  "name": "Cardiología",
  "description": "Especialista en enfermedades del corazón"
}
```

### Actualizar Especialidad (Admin)
**PUT** `/specialties/:id`
🔒 Requiere autenticación y rol `ADMIN`

### Eliminar Especialidad (Admin)
**DELETE** `/specialties/:id`
🔒 Requiere autenticación y rol `ADMIN`

---

## Médicos

### Listar Médicos
**GET** `/doctors`

### Obtener Médico por ID
**GET** `/doctors/:id`

### Buscar Médicos por Especialidad
**GET** `/doctors/specialty/:specialtyId`

### Crear Perfil de Médico
**POST** `/doctors`
🔒 Requiere autenticación (DOCTOR o ADMIN)

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "specialtyId": "507f1f77bcf86cd799439012",
  "licenseNumber": "MED-12345",
  "availableTimeSlots": [
    {
      "dayOfWeek": 1,
      "startTime": "09:00",
      "endTime": "13:00"
    },
    {
      "dayOfWeek": 1,
      "startTime": "14:00",
      "endTime": "18:00"
    }
  ]
}
```

**Días de la semana:** 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

### Actualizar Perfil de Médico
**PUT** `/doctors/:id`
🔒 Requiere autenticación (DOCTOR o ADMIN)

### Eliminar Médico (Admin)
**DELETE** `/doctors/:id`
🔒 Requiere autenticación y rol `ADMIN`

---

## Citas

### Listar Citas con Filtros
**GET** `/appointments?patientId=xxx&doctorId=yyy&startDate=2024-01-01`
🔒 Requiere autenticación

**Query Parameters:**
- `patientId` (opcional): ID del paciente
- `doctorId` (opcional): ID del médico
- `specialtyId` (opcional): ID de la especialidad
- `startDate` (opcional): Fecha de inicio (ISO 8601)
- `endDate` (opcional): Fecha de fin (ISO 8601)
- `status` (opcional): Estado de la cita

### Obtener Cita por ID
**GET** `/appointments/:id`
🔒 Requiere autenticación

### Crear Cita
**POST** `/appointments`
🔒 Requiere autenticación (PATIENT o ADMIN)

**Request Body:**
```json
{
  "patientId": "507f1f77bcf86cd799439011",
  "doctorId": "507f1f77bcf86cd799439012",
  "specialtyId": "507f1f77bcf86cd799439013",
  "appointmentDate": "2024-01-20",
  "startTime": "10:00",
  "endTime": "11:00",
  "reason": "Consulta de control",
  "notes": "Paciente presenta síntomas leves"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "patientId": "507f1f77bcf86cd799439011",
    "doctorId": "507f1f77bcf86cd799439012",
    "specialtyId": "507f1f77bcf86cd799439013",
    "appointmentDate": "2024-01-20T00:00:00.000Z",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "SCHEDULED",
    "reason": "Consulta de control",
    "notes": "Paciente presenta síntomas leves",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Actualizar Cita
**PUT** `/appointments/:id`
🔒 Requiere autenticación (PATIENT, DOCTOR o ADMIN)

### Cancelar Cita
**PATCH** `/appointments/:id/cancel`
🔒 Requiere autenticación (PATIENT, DOCTOR o ADMIN)

### Eliminar Cita (Admin)
**DELETE** `/appointments/:id`
🔒 Requiere autenticación y rol `ADMIN`

---

## Estados de Cita

- `SCHEDULED`: Cita programada
- `CONFIRMED`: Cita confirmada
- `COMPLETED`: Cita completada
- `CANCELLED`: Cita cancelada

---

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Token inválido o expirado |
| 403 | Forbidden - Permisos insuficientes |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error |

**Formato de Error:**
```json
{
  "success": false,
  "uuid": "123e4567-e89b-12d3-a456-426614174000",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "error": {
    "message": "Descripción del error",
    "details": {}
  }
}
```

---

## Ejemplos de Uso con cURL

### Registro
```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -H "X-RqUID: $(uuidgen)" \
  -d '{
    "email": "paciente@example.com",
    "password": "Password123!",
    "name": "María García",
    "role": "PATIENT"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "X-RqUID: $(uuidgen)" \
  -d '{
    "email": "paciente@example.com",
    "password": "Password123!"
  }'
```

### Crear Cita
```bash
TOKEN="tu-jwt-token-aqui"

curl -X POST http://localhost:3000/api/v1/appointments \
  -H "Content-Type: application/json" \
  -H "X-RqUID: $(uuidgen)" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "patientId": "507f1f77bcf86cd799439011",
    "doctorId": "507f1f77bcf86cd799439012",
    "specialtyId": "507f1f77bcf86cd799439013",
    "appointmentDate": "2024-01-20",
    "startTime": "10:00",
    "endTime": "11:00",
    "reason": "Consulta de control"
  }'
```

---

## Validaciones Implementadas

### Citas
- ✅ La fecha de la cita no puede estar en el pasado
- ✅ El médico debe estar disponible en el horario solicitado
- ✅ No puede haber solapamiento de citas para el mismo médico
- ✅ Solo se pueden modificar citas en estado SCHEDULED
- ✅ Solo se pueden cancelar citas activas (SCHEDULED o CONFIRMED)

### Médicos
- ✅ Un usuario solo puede tener un perfil de médico
- ✅ La especialidad debe existir
- ✅ Número de licencia único

### Especialidades
- ✅ Nombre único (no distingue mayúsculas/minúsculas)
