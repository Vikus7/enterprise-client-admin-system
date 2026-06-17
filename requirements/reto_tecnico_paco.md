# Reto Técnico – Programador PA-CO Comercial e Industrial

## Información general

| Campo | Detalle |
|---|---|
| Fecha de entrega | 17 de junio de 2026 hasta las 23:00 |
| Modalidad | Repositorio Git o archivo comprimido |
| Base de datos | PostgreSQL (obligatorio) |

---

## Objetivo

Construir una aplicación para administrar clientes empresariales, simulando un catálogo que pueda ser consumido por otros sistemas. Se evalúan conocimientos prácticos de backend, base de datos, seguridad básica, documentación de API, contenedores y consumo desde frontend.

---

## Alcance obligatorio

- Backend en **Java** con **API REST**
- Base de datos **PostgreSQL**
- **Swagger / OpenAPI** habilitado y accesible desde el navegador (local o desplegado)
- Autenticación con **JWT Bearer Token**
- **Docker o Docker Compose** para ejecutar la solución
- **Frontend en React o Angular** para login y CRUD básico
- **README** con instrucciones claras de ejecución

---

## Modelo de datos en PostgreSQL

### Tabla `app_user` — Usuarios para autenticación

| Campo | Tipo sugerido | Obligatorio | Descripción |
|---|---|---|---|
| id | BIGSERIAL / BIGINT | Sí | Identificador interno |
| username | VARCHAR(50) | Sí | Usuario para login. Debe ser único |
| password_hash | VARCHAR(255) | Sí | Contraseña encriptada o codificada |
| full_name | VARCHAR(120) | No | Nombre visible del usuario |
| enabled | BOOLEAN | Sí | Indica si el usuario está activo |
| created_at | TIMESTAMP | Sí | Fecha de creación del registro |

---

### Tabla `b4b_customer` — Clientes empresariales (tabla principal del CRUD)

| Campo | Tipo sugerido | Obligatorio | Descripción |
|---|---|---|---|
| id | BIGSERIAL / BIGINT | Sí | Identificador interno |
| jde_code | VARCHAR(20) | Sí | Código externo tipo JDE. Debe ser único |
| tax_id | VARCHAR(13) | Sí | RUC o identificación tributaria. Debe ser único |
| business_name | VARCHAR(150) | Sí | Razón social del cliente |
| commercial_name | VARCHAR(150) | No | Nombre comercial |
| email | VARCHAR(120) | No | Correo de contacto |
| phone | VARCHAR(30) | No | Teléfono de contacto |
| status | VARCHAR(20) | Sí | Estado: `ACTIVE`, `INACTIVE` o `BLOCKED` |
| credit_limit | NUMERIC(12,2) | No | Límite de crédito referencial |
| created_at | TIMESTAMP | Sí | Fecha de creación |
| updated_at | TIMESTAMP | Sí | Fecha de última actualización |

---

### Tabla `integration_event_log` — Auditoría (opcional)

Sirve para demostrar comprensión de escenarios de trazabilidad usados en integraciones.

| Campo | Tipo sugerido | Obligatorio | Descripción |
|---|---|---|---|
| id | BIGSERIAL / BIGINT | Sí | Identificador del evento |
| customer_id | BIGINT | Sí | Referencia al cliente (`b4b_customer.id`) |
| source_system | VARCHAR(30) | Sí | Sistema origen simulado. Ej: `B4B`, `JDE`, `MANUAL` |
| event_type | VARCHAR(30) | Sí | `CREATE`, `UPDATE`, `DELETE` o `STATUS_CHANGE` |
| event_status | VARCHAR(20) | Sí | `SUCCESS` o `ERROR` |
| message | TEXT | No | Detalle breve del evento |
| created_at | TIMESTAMP | Sí | Fecha del evento |

---

### DDL referencial

```sql
CREATE TABLE app_user (
    id            BIGSERIAL PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(120),
    enabled       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE b4b_customer (
    id              BIGSERIAL PRIMARY KEY,
    jde_code        VARCHAR(20)    NOT NULL UNIQUE,
    tax_id          VARCHAR(13)    NOT NULL UNIQUE,
    business_name   VARCHAR(150)   NOT NULL,
    commercial_name VARCHAR(150),
    email           VARCHAR(120),
    phone           VARCHAR(30),
    status          VARCHAR(20)    NOT NULL DEFAULT 'ACTIVE',
    credit_limit    NUMERIC(12,2),
    created_at      TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE TABLE integration_event_log (
    id            BIGSERIAL PRIMARY KEY,
    customer_id   BIGINT      NOT NULL REFERENCES b4b_customer(id),
    source_system VARCHAR(30) NOT NULL,
    event_type    VARCHAR(30) NOT NULL,
    event_status  VARCHAR(20) NOT NULL,
    message       TEXT,
    created_at    TIMESTAMP   NOT NULL DEFAULT NOW()
);
```

---

## API REST requerida

El token JWT debe enviarse en el encabezado:
```
Authorization: Bearer <token>
```

| Método | Endpoint | Protegido con JWT | Descripción |
|---|---|---|---|
| POST | `/api/auth/login` | No | Autentica usuario y devuelve token JWT |
| GET | `/api/clients` | Sí | Lista clientes |
| GET | `/api/clients/{id}` | Sí | Obtiene un cliente por id |
| POST | `/api/clients` | Sí | Crea un cliente |
| PUT | `/api/clients/{id}` | Sí | Actualiza un cliente |
| DELETE | `/api/clients/{id}` | Sí | Elimina o desactiva un cliente |

---

## Frontend requerido

- Pantalla de **login**
- **Listado** de clientes
- **Formulario para crear** cliente
- **Formulario o vista para editar** cliente
- **Acción para eliminar o desactivar** cliente
- Consumo del backend enviando el **token JWT**
- **Manejo básico de errores** visibles para el usuario

Se acepta React o Angular. No se evalúa diseño visual; se evalúa claridad, funcionamiento y separación mínima de responsabilidades.

---

## Docker y ejecución

El comando estándar esperado para levantar la solución es:

```bash
docker compose up --build
```

El `docker-compose` debe levantar al menos:
- PostgreSQL
- Backend

Se valorará que también levante el frontend.

Las variables sensibles o configurables deben manejarse mediante variables de entorno o archivo de ejemplo (`.env`).

---

## Entregables esperados

- Repositorio Git o archivo comprimido con el código fuente
- Backend Java completo
- Frontend React o Angular completo
- Script SQL, migraciones, backup o inicialización automática de base de datos
- `Dockerfile` y/o `docker-compose.yml`
- `README` con instrucciones de ejecución
- Usuario y contraseña de prueba
- URL de Swagger

### Estructura sugerida

```
/backend
/frontend
/docker-compose.yml
/README.md
```

Puede entregarse como mono-repo o en repositorios separados.

---

## Criterios de evaluación

| Área | Puntaje | Qué se evalúa |
|---|---|---|
| Backend Java | 25 | Estructura clara, controladores, servicios, repositorios, DTOs, validaciones básicas y manejo de errores |
| PostgreSQL | 15 | Modelo correcto, constraints, scripts y persistencia real |
| JWT | 15 | Login funcional, token emitido, endpoints protegidos y uso correcto de Bearer Token |
| Swagger / OpenAPI | 10 | Documentación accesible y endpoints probables desde el navegador |
| Docker | 15 | Ejecución simple, compose funcional, conexión backend-base y configuración clara |
| Frontend | 15 | Login, CRUD funcional, consumo correcto de API y manejo básico de estados/errores |
| README | 5 | Instrucciones suficientes para levantar y probar la solución |
| **Total** | **100** | |

---

## Condiciones mínimas de aceptación

- El proyecto debe poder ejecutarse siguiendo el README
- El login debe devolver un JWT
- Los endpoints de clientes deben estar protegidos con JWT
- Swagger debe abrir correctamente desde el navegador
- Debe existir persistencia real en PostgreSQL
- El frontend debe permitir probar el flujo principal sin usar herramientas externas

---

## Contenido mínimo del README

- Comando de ejecución
- Credenciales de prueba
- URL del frontend
- URL del backend
- URL de Swagger
- Breve explicación de decisiones técnicas relevantes
