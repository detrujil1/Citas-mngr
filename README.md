# Sistema de Gestión de Citas Médicas

Sistema de agenda de citas para consultorio médico implementado con arquitectura limpia y principios SOLID.

## 🏗️ Arquitectura

El proyecto sigue los principios de **Clean Architecture** con la siguiente estructura de capas:

### Capas

1. **Domain (Dominio)**
   - Entities: Entidades de negocio (Doctor, Patient, Appointment, Specialty)
   - DTOs: Objetos de transferencia de datos
   - Ports: Interfaces para los casos de uso y repositorios

2. **Use Cases (Casos de Uso)**
   - Lógica de negocio pura
   - Independiente de frameworks y librerías externas

3. **Infrastructure (Infraestructura)**
   - Implementaciones de repositorios (MongoDB)
   - Adaptadores externos (JWT, HTTP)
   - Bootstrap del servidor

4. **Adapter (Adaptadores)**
   - Controllers: Manejo de peticiones HTTP
   - Routes: Configuración de rutas
   - Middleware: Validaciones y autenticación

## 🚀 Características

- ✅ Gestión de usuarios (Médicos y Pacientes)
- ✅ CRUD de especialidades médicas
- ✅ CRUD de citas médicas
- ✅ Control de disponibilidad de médicos
- ✅ Prevención de solapamiento de citas
- ✅ Autenticación y autorización por roles
- ✅ Validaciones de datos

## 🛠️ Tecnologías

- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **MongoDB** + **Mongoose** - Base de datos
- **JWT** - Autenticación
- **bcrypt** - Encriptación de contraseñas
- **Winston** - Logging

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Compilar TypeScript
npm run build

# Iniciar servidor
npm start
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Modo desarrollo con nodemon
npm run build        # Compilar TypeScript
npm start            # Iniciar servidor
npm test             # Ejecutar tests
npm run test:watch   # Tests en modo watch
npm run lint         # Verificar código
npm run format       # Formatear código
```

## 📚 Endpoints API

### Autenticación
- `POST /api/v1/auth/signup` - Registro de usuarios
- `POST /api/v1/auth/login` - Inicio de sesión

### Especialidades
- `GET /api/v1/specialties` - Listar especialidades
- `POST /api/v1/specialties` - Crear especialidad (Admin)
- `PUT /api/v1/specialties/:id` - Actualizar especialidad (Admin)
- `DELETE /api/v1/specialties/:id` - Eliminar especialidad (Admin)

### Médicos
- `GET /api/v1/doctors` - Listar médicos
- `GET /api/v1/doctors/:id` - Obtener médico
- `GET /api/v1/doctors/:id/availability` - Ver disponibilidad

### Citas
- `GET /api/v1/appointments` - Listar citas
- `POST /api/v1/appointments` - Crear cita
- `PUT /api/v1/appointments/:id` - Actualizar cita
- `DELETE /api/v1/appointments/:id` - Cancelar cita

## 🔐 Roles de Usuario

- **PATIENT**: Puede crear y consultar sus propias citas
- **DOCTOR**: Puede ver sus citas asignadas y actualizar disponibilidad
- **ADMIN**: Acceso completo al sistema

## 🎯 Principios de Diseño

### SOLID
- **S**ingle Responsibility: Cada clase tiene una única responsabilidad
- **O**pen/Closed: Abierto para extensión, cerrado para modificación
- **L**iskov Substitution: Las implementaciones son intercambiables
- **I**nterface Segregation: Interfaces específicas por cliente
- **D**ependency Inversion: Dependencia de abstracciones, no de concreciones

### DRY (Don't Repeat Yourself)
- Reutilización de código mediante abstracciones
- Factorías y utilidades compartidas

## 📝 Licencia

ISC
