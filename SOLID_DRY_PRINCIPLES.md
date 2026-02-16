# SOLID y DRY - Implementación en el Proyecto

Este documento explica cómo se aplicaron los principios SOLID y DRY en el sistema de gestión de citas médicas.

---

## Principios SOLID

### 1. Single Responsibility Principle (SRP)
**"Una clase debe tener una única razón para cambiar"**

#### Ejemplos en el proyecto:

**✅ Casos de Uso Separados:**
- `UserSignUp`: Solo se encarga del registro de usuarios
- `UserLogin`: Solo maneja la autenticación
- `SpecialtyService`: Solo gestiona especialidades médicas
- `AppointmentService`: Solo maneja la lógica de citas

Cada caso de uso tiene una responsabilidad única y bien definida.

**✅ Repositorios Especializados:**
```typescript
// Cada repositorio maneja solo una entidad
MongoUserCreator      // Solo crea usuarios
MongoUserFetcher      // Solo busca usuarios
MongoSpecialtyRepository  // Solo gestiona especialidades
```

**✅ Controladores Focalizados:**
```typescript
// Cada controlador maneja solo las peticiones HTTP de su dominio
SignUpUserController       // Solo registro
AuthenticationController   // Solo login
SpecialtyController       // Solo especialidades
```

---

### 2. Open/Closed Principle (OCP)
**"Abierto para extensión, cerrado para modificación"**

#### Ejemplos en el proyecto:

**✅ Uso de Interfaces (Ports):**
```typescript
// src/domain/port/user/authentication/out/authenticator.ts
export interface IAuthenticator {
    generateToken(userId: string, email: string, role: string): Promise<string>;
    verifyToken(token: string): Promise<IAuthClaim>;
    comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
```

Podemos agregar nuevas implementaciones (OAuth, SAML, etc.) sin modificar el código existente:
```typescript
// Implementación actual
class JWTAuthenticatorAdapter implements IAuthenticator { ... }

// Nuevas implementaciones (extensión sin modificación)
class OAuth2Authenticator implements IAuthenticator { ... }
class SAMLAuthenticator implements IAuthenticator { ... }
```

**✅ Repositorios Intercambiables:**
```typescript
// Actualmente usamos MongoDB
class MongoUserCreator implements IUserCreator { ... }

// Podemos agregar PostgreSQL sin cambiar la lógica de negocio
class PostgresUserCreator implements IUserCreator { ... }

// O cualquier otra base de datos
class DynamoDBUserCreator implements IUserCreator { ... }
```

---

### 3. Liskov Substitution Principle (LSP)
**"Los objetos de una clase derivada deben poder reemplazar a los de la clase base"**

#### Ejemplos en el proyecto:

**✅ Todas las implementaciones de repositorios son intercambiables:**
```typescript
// En cualquier lugar que se use ISpecialtyRepository
class SpecialtyService {
    constructor(private readonly repository: ISpecialtyRepository) {}
    // Funciona con MongoSpecialtyRepository
    // Funcionaría igual con MySQLSpecialtyRepository
    // O cualquier otra implementación de ISpecialtyRepository
}
```

**✅ Inyección de dependencias en casos de uso:**
```typescript
// UserLogin acepta cualquier implementación válida
new UserLogin(
    new MongoUserFetcher(),        // Podría ser PostgresUserFetcher
    new JWTAuthenticatorAdapter()  // Podría ser OAuth2Authenticator
);
```

---

### 4. Interface Segregation Principle (ISP)
**"Los clientes no deben depender de interfaces que no utilizan"**

#### Ejemplos en el proyecto:

**✅ Interfaces Específicas por Operación:**

En lugar de tener una interfaz gigante:
```typescript
// ❌ MAL - Interfaz demasiado grande
interface IUserRepository {
    create(user): Promise<void>;
    findById(id): Promise<User>;
    findByEmail(email): Promise<User>;
    update(id, data): Promise<User>;
    delete(id): Promise<boolean>;
    // ... muchos más métodos
}
```

Separamos en interfaces específicas:
```typescript
// ✅ BIEN - Interfaces pequeñas y específicas
interface IUserCreator {
    create(data: ISignUpUser): Promise<void>;
}

interface IUserFetcher {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}
```

**✅ Puertos de Entrada y Salida Separados:**
```typescript
// Puerto de entrada (lo que el caso de uso expone)
export interface ISignUpExecutor {
    execute(data: ISignUpUser): Promise<void>;
}

// Puerto de salida (lo que el caso de uso necesita)
export interface IUserCreator {
    create(data: ISignUpUser): Promise<void>;
}
```

---

### 5. Dependency Inversion Principle (DIP)
**"Depender de abstracciones, no de concreciones"**

#### Ejemplos en el proyecto:

**✅ Casos de Uso dependen de Interfaces, no de Implementaciones:**
```typescript
// src/usecase/appointment/appointment-service.ts
export class AppointmentService {
    constructor(
        private readonly appointmentRepository: IAppointmentRepository,  // ← Interfaz
        private readonly doctorRepository: IDoctorRepository,            // ← Interfaz
        private readonly specialtyRepository: ISpecialtyRepository       // ← Interfaz
    ) {}
}
```

**✅ Inyección de Dependencias en la Configuración de Rutas:**
```typescript
// src/adapter/route/appointment/appointment-route-configuration.ts
const appointmentService = new AppointmentService(
    new MongoAppointmentRepository(),  // Implementación concreta inyectada
    new MongoDoctorRepository(),
    new MongoSpecialtyRepository()
);
```

**Beneficio:** Si queremos cambiar la base de datos, solo modificamos la configuración:
```typescript
const appointmentService = new AppointmentService(
    new PostgresAppointmentRepository(),  // ← Solo cambiamos aquí
    new PostgresDoctorRepository(),
    new PostgresSpecialtyRepository()
);
// El resto del código sigue funcionando igual
```

---

## Principio DRY (Don't Repeat Yourself)

### Ejemplos de reutilización en el proyecto:

**✅ Factory de Respuestas HTTP:**
```typescript
// src/infrastructure/adapter/http/response-factory.ts
export class ResponseFactory {
    static success(uuid: string, message: string, data: any): IApiResponse { ... }
    static error(uuid: string, message: string, details?: any): IApiResponse { ... }
}

// Usado en todos los controladores para respuestas consistentes
const response = ResponseFactory.success(UUID, 'Success', data);
```

**✅ Validación de UUID Centralizada:**
```typescript
// src/util/validation/uuid.ts
export function validateUUID(req: ICustomRequest): string { ... }

// Reutilizado en todos los controladores
const UUID: string = validateUUID(req as ICustomRequest);
```

**✅ Middleware Reutilizado:**
```typescript
// src/adapter/middleware/validate-param.ts
export function validateRequestHeaders(...) { ... }
export function validateRequestBody(...) { ... }

// Aplicado a todas las rutas
router.use([validateRequestHeaders, validateRequestBody], ...);
```

**✅ Custom Error Centralizado:**
```typescript
// src/infrastructure/adapter/http/error-handler.ts
export class CustomError extends Error { ... }
export function sendErrorResponse(...) { ... }

// Manejo de errores consistente en toda la aplicación
```

**✅ Logger Centralizado:**
```typescript
// src/config/logger.ts
export const logger = winston.createLogger({ ... });

// Usado en toda la aplicación
logger.info(uuid, 'Message');
logger.error(uuid, 'Error', error);
```

**✅ Configuración de Entorno Centralizada:**
```typescript
// src/config/env.ts
const env: IEnvConfig = { ... };
export default env;

// Acceso consistente en toda la aplicación
env.database.MONGODB_URI
env.jwt.JWT_SECRET
```

---

## Patrones de Diseño Adicionales

### 1. **Hexagonal Architecture (Ports & Adapters)**
- **Dominio** independiente de infraestructura
- **Puertos** definen contratos
- **Adaptadores** implementan las interfaces

### 2. **Dependency Injection**
- Todas las dependencias se inyectan via constructor
- Facilita testing y cambios de implementación

### 3. **Repository Pattern**
- Abstracción de la persistencia de datos
- Separación entre lógica de negocio y acceso a datos

### 4. **Factory Pattern**
- `ResponseFactory` para crear respuestas HTTP consistentes
- `DatabaseConnection` usa Singleton

### 5. **Strategy Pattern**
- Diferentes estrategias de autenticación (JWT, OAuth, etc.)
- Implementadas mediante la interfaz `IAuthenticator`

---

## Beneficios de esta Arquitectura

### ✅ Testabilidad
- Cada componente puede testearse aisladamente
- Fácil crear mocks de las interfaces
- Ver ejemplos en `test/usecase/`

### ✅ Mantenibilidad
- Código organizado y predecible
- Fácil encontrar y modificar funcionalidad
- Cambios localizados

### ✅ Escalabilidad
- Fácil agregar nuevas funcionalidades
- Nuevos casos de uso sin afectar existentes
- Nuevos adaptadores sin cambiar lógica

### ✅ Flexibilidad
- Cambio de base de datos sin afectar casos de uso
- Cambio de framework HTTP sin afectar dominio
- Múltiples implementaciones conviviendo

---

## Ejemplo Práctico: Agregar Autenticación OAuth2

**Sin violar principios SOLID:**

1. Crear nueva implementación:
```typescript
// src/infrastructure/adapter/oauth2/authentication.ts
export class OAuth2Authenticator implements IAuthenticator {
    async generateToken(...) { ... }
    async verifyToken(...) { ... }
    async comparePasswords(...) { ... }
}
```

2. Cambiar en la configuración de rutas:
```typescript
// src/adapter/route/user/user-route-configuration.ts
const loginUserService = new UserLogin(
    new MongoUserFetcher(),
    new OAuth2Authenticator()  // ← Solo este cambio
);
```

3. **¡Nada más!** El resto del código sigue funcionando.

---

## Conclusión

Este proyecto demuestra:

1. ✅ **SRP**: Cada clase tiene una responsabilidad única
2. ✅ **OCP**: Fácil extensión sin modificación
3. ✅ **LSP**: Implementaciones intercambiables
4. ✅ **ISP**: Interfaces específicas y pequeñas
5. ✅ **DIP**: Dependencia de abstracciones
6. ✅ **DRY**: Código reutilizable y sin duplicación

Esta arquitectura facilita el mantenimiento, testing y escalabilidad del sistema.
