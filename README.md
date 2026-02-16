# 🏥 Sistema de Gestión de Citas Médicas

Sistema backend para la gestión integral de citas médicas desarrollado con Clean Architecture, TypeScript y Node.js.

[![Test Coverage](https://img.shields.io/badge/coverage-29.67%25-yellow.svg)](https://github.com/detrujil1/Citas-mngr)
[![Tests](https://img.shields.io/badge/tests-124%20passing-brightgreen.svg)](https://github.com/detrujil1/Citas-mngr)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Testing](#-testing)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación API](#-documentación-api)
- [Principios SOLID y DRY](#-principios-solid-y-dry)
- [Contribuir](#-contribuir)

## ✨ Características

- ✅ **Gestión de Citas**: Crear, consultar, actualizar y cancelar citas médicas
- ✅ **Gestión de Doctores**: CRUD completo con especialidades y horarios de trabajo
- ✅ **Gestión de Pacientes**: Registro y autenticación de pacientes
- ✅ **Gestión de Especialidades**: Administración de especialidades médicas
- ✅ **Autenticación JWT**: Sistema seguro de autenticación basado en tokens
- ✅ **Validación de Horarios**: Verificación de disponibilidad y conflictos
- ✅ **Slots Disponibles**: Consulta de horarios disponibles por doctor y fecha
- ✅ **Roles de Usuario**: Paciente, Médico, Administrador

## 🏗️ Arquitectura

Este proyecto sigue los principios de **Clean Architecture** (Arquitectura Limpia), organizando el código en capas con responsabilidades bien definidas:

```
┌─────────────────────────────────────┐
│         Adapter Layer               │
│  (Controllers, Routes, Middleware)  │
├─────────────────────────────────────┤
│         Use Case Layer              │
│     (Business Logic)                │
├─────────────────────────────────────┤
│         Domain Layer                │
│  (Entities, DTOs, Interfaces)       │
├─────────────────────────────────────┤
│      Infrastructure Layer           │
│  (Database, JWT, HTTP adapters)     │
└─────────────────────────────────────┘
```

### Capas del Proyecto

- **Domain**: Entidades de negocio, DTOs e interfaces (ports)
- **Use Cases**: Lógica de negocio y reglas de la aplicación
- **Infrastructure**: Implementación de adapters (MongoDB, JWT, HTTP)
- **Adapter**: Controladores, rutas y middleware de Express

## 🛠️ Tecnologías

- **Runtime**: Node.js 18.x
- **Lenguaje**: TypeScript 5.x
- **Framework Web**: Express.js
- **Base de Datos**: MongoDB + Mongoose
- **Autenticación**: JWT (jsonwebtoken) + bcrypt
- **Testing**: Jest + ts-jest
- **Logging**: Winston
- **Validación**: express-validator
- **Monitoring**: express-actuator
- **Contenedores**: Docker + Docker Compose

## 📦 Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB >= 6.0 (o usar Docker)
- Git

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone git@github.com:detrujil1/Citas-mngr.git
cd Citas-mngr
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/citas-mngr
MONGO_USER=admin
MONGO_PASSWORD=admin123

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Logging
LOG_LEVEL=info
```

### 4. Iniciar MongoDB (usando Docker)

```bash
docker-compose up -d
```

O instala MongoDB localmente siguiendo la [documentación oficial](https://www.mongodb.com/docs/manual/installation/).

## 🔧 Configuración

### Construir el proyecto

```bash
npm run build
```

### Modo desarrollo

```bash
npm run dev
```

### Modo producción

```bash
npm start
```

## 📖 Uso

El servidor estará disponible en `http://localhost:3000`

### Endpoints principales

#### Autenticación
- `POST /api/auth/signup/patient` - Registro de paciente
- `POST /api/auth/signup/doctor` - Registro de doctor
- `POST /api/auth/login` - Inicio de sesión

#### Citas
- `POST /api/appointments` - Crear cita
- `GET /api/appointments/:id` - Obtener cita por ID
- `GET /api/appointments` - Listar citas (con filtros)
- `PUT /api/appointments/:id` - Actualizar cita
- `DELETE /api/appointments/:id` - Cancelar cita
- `GET /api/appointments/doctor/:doctorId/available-slots` - Consultar horarios disponibles

#### Doctores
- `POST /api/doctors` - Crear doctor
- `GET /api/doctors/:id` - Obtener doctor por ID
- `GET /api/doctors` - Listar doctores
- `PUT /api/doctors/:id` - Actualizar doctor
- `DELETE /api/doctors/:id` - Eliminar doctor

#### Especialidades
- `POST /api/specialties` - Crear especialidad
- `GET /api/specialties/:id` - Obtener especialidad
- `GET /api/specialties` - Listar especialidades
- `PUT /api/specialties/:id` - Actualizar especialidad
- `DELETE /api/specialties/:id` - Eliminar especialidad

Ver [API-SPECIFICATION.md](./API-SPECIFICATION.md) para documentación detallada.

## 🧪 Testing

### Ejecutar todos los tests

```bash
npm test
```

### Ejecutar tests con cobertura

```bash
npm run test:coverage
```

### Ejecutar tests en modo watch

```bash
npm run test:watch
```

### Cobertura Actual

```
All files: 29.67% statements | 39.69% branches | 41.81% functions | 29.85% lines
```

**Áreas con alta cobertura:**
- ✅ Entities (Patient, Appointment): 100%
- ✅ JWT Authentication: 100%
- ✅ Doctor Service: 100%
- ✅ User Login: 100%
- ✅ User Sign Up: 100%
- ✅ Appointment Service: 81.81%
- ✅ Specialty Service: 92%

## 📁 Estructura del Proyecto

```
Citas-mngr/
├── src/
│   ├── adapter/              # Capa de adaptadores
│   │   ├── controller/       # Controladores HTTP
│   │   ├── middleware/       # Middleware de Express
│   │   └── route/           # Configuración de rutas
│   ├── config/              # Configuración (env, logger, server)
│   ├── domain/              # Capa de dominio
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entity/         # Entidades de negocio
│   │   └── port/           # Interfaces (puertos)
│   ├── infrastructure/      # Capa de infraestructura
│   │   ├── adapter/        # Implementación de adapters
│   │   ├── bootstrap/      # Inicialización del servidor
│   │   └── persistence/    # MongoDB repositories y schemas
│   ├── usecase/            # Casos de uso (lógica de negocio)
│   │   ├── appointment/
│   │   ├── auth/
│   │   ├── doctor/
│   │   ├── specialty/
│   │   └── user/
│   ├── util/               # Utilidades
│   └── main.ts             # Punto de entrada
├── test/                   # Tests unitarios y de integración
├── build/                  # Código compilado (generado)
├── logs/                   # Archivos de log
├── docker-compose.yml      # Configuración de Docker
├── Dockerfile             # Imagen Docker del proyecto
├── jest.config.js         # Configuración de Jest
├── tsconfig.json          # Configuración de TypeScript
└── package.json           # Dependencias y scripts
```

## 📚 Documentación API

Para ver la documentación completa de la API, consulta:

- [API-SPECIFICATION.md](./API-SPECIFICATION.md) - Especificación detallada de endpoints
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Guía de uso con ejemplos

## 🎯 Principios SOLID y DRY

Este proyecto implementa los principios SOLID de diseño orientado a objetos:

- **S**ingle Responsibility: Cada clase tiene una única responsabilidad
- **O**pen/Closed: Abierto para extensión, cerrado para modificación
- **L**iskov Substitution: Las interfaces definen contratos claros
- **I**nterface Segregation: Interfaces específicas en lugar de grandes interfaces
- **D**ependency Inversion: Dependencia de abstracciones, no implementaciones

Ver [SOLID_DRY_PRINCIPLES.md](./SOLID_DRY_PRINCIPLES.md) para ejemplos detallados.

## 🐳 Docker

### Construir imagen

```bash
docker build -t citas-mngr .
```

### Ejecutar con Docker Compose

```bash
docker-compose up
```

Esto iniciará:
- Aplicación Node.js en puerto 3000
- MongoDB en puerto 27017

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ Autenticación JWT con expiración configurable
- ✅ Validación de entrada en todos los endpoints
- ✅ Variables sensibles en archivos .env (no versionados)
- ✅ CORS configurado
- ✅ Rate limiting recomendado para producción

## 📈 Mejoras Futuras

- [ ] Aumentar cobertura de tests al 80%+
- [ ] Implementar rate limiting
- [ ] Agregar paginación en listados
- [ ] Notificaciones por email/SMS
- [ ] Historial de citas
- [ ] Sistema de calificaciones
- [ ] Dashboard de métricas
- [ ] CI/CD con GitHub Actions
- [ ] Documentación con Swagger/OpenAPI

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de código

- Use TypeScript estricto
- Siga los principios SOLID
- Escriba tests para nuevas funcionalidades
- Mantenga la cobertura de tests > 80%
- Use conventional commits

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

**Daniel Trujillo** - [detrujil1](https://github.com/detrujil1)

## 🙏 Agradecimientos

- Clean Architecture por Robert C. Martin
- Comunidad de TypeScript
- Contributors y reviewers

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!
