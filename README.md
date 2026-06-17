<div align="center">

# 🏢 Administración de Clientes Empresariales

### Reto Técnico — PA-CO Comercial e Industrial

Solución full-stack para gestión de clientes B2B con API REST, autenticación JWT y frontend React.

---

| 👤 Autor | Victor Rodriguez |
|---|---|
| 📧 Email | victtor.rodriguez01@gmail.com |

</div>

---

## Credenciales de prueba

| Campo | Valor |
|---|---|
| Usuario | `admin` |
| Contraseña | `admin123` |

---

## Levantar la aplicación

### Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado y en ejecución

### Con Docker Compose (recomendado)

```bash
docker compose up --build
```

Esto levanta los tres servicios automáticamente:

| Servicio | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

Para detener:

```bash
docker compose down
```

> **Nota:** los datos persisten entre reinicios gracias al volumen `paco_postgres_data`. Para eliminar también los datos usa `docker compose down -v`.

### Si aparece error de certificados (PKIX / certificate_unknown)

En algunos equipos corporativos, el build del backend puede fallar al descargar dependencias Maven por inspeccion SSL.

1. Copia el certificado corporativo en `backend/certs/` (por ejemplo `backend/certs/corporate-ca.crt`).
2. Vuelve a levantar:

```bash
docker compose up --build
```

Fallback temporal (solo desarrollo):

```bash
BACKEND_MAVEN_ARGS="-DskipTests package -Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true" docker compose up --build
```

---

### Sin Docker (desarrollo local)

Requisitos: Java 25, Maven, Node.js 20+, PostgreSQL 16 corriendo en `localhost:5432` con base de datos `paco_db`.

**Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Frontend** (en otra terminal):
```bash
cd frontend
npm install
npm run dev
```

---

## Swagger / OpenAPI

Con el backend corriendo, accede a la documentación interactiva en:

**http://localhost:8080/swagger-ui.html**

Esquema JSON disponible en: http://localhost:8080/v3/api-docs

---

## Endpoints principales

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/login` | No | Obtiene token JWT |
| GET | `/api/clients` | Bearer | Lista todos los clientes |
| GET | `/api/clients/{id}` | Bearer | Obtiene un cliente |
| POST | `/api/clients` | Bearer | Crea un cliente |
| PUT | `/api/clients/{id}` | Bearer | Actualiza un cliente |
| DELETE | `/api/clients/{id}` | Bearer | Desactiva un cliente |

---

## Decisiones técnicas

### Backend y base de datos

- **Java 25 + Spring Boot 4.0.7** — Framework principal para la API REST. Se eligió por su ecosistema maduro y facilidad de integración con seguridad y persistencia.
- **PostgreSQL 16** — Motor relacional requerido. Las tablas `app_user`, `b4b_customer` e `integration_event_log` se crean automáticamente al arrancar vía `schema.sql`.
- **Spring Security + JWT (jjwt 0.12.6)** — Autenticación stateless con Bearer Token. El filtro `JwtAuthenticationFilter` valida el token en cada request protegido.
- **Spring Data JPA + Hibernate 7** — ORM para la capa de persistencia. Se usa `ddl-auto=validate` para que Hibernate verifique el esquema sin modificarlo.
- **Springdoc OpenAPI 3.0.2** — Genera y expone Swagger UI automáticamente sin configuración adicional.
- **Soft delete** — El endpoint DELETE no elimina físicamente el registro; cambia el `status` a `INACTIVE` y registra el evento en `integration_event_log`.
- **Variables de entorno** — Toda configuración sensible (`DB_HOST`, `DB_PASSWORD`, `JWT_SECRET`, etc.) se lee desde variables de entorno con valores por defecto para desarrollo local.

### Frontend

- **React 19 + TypeScript + Vite 8** — SPA con tipado estático. Vite permite HMR rápido en desarrollo y bundles optimizados para producción.
- **React Router v7** — Enrutamiento en cliente con rutas protegidas que validan la presencia del token JWT antes de renderizar.
- **Axios** — Cliente HTTP con interceptor de request que adjunta automáticamente el Bearer Token almacenado en `localStorage`.
- **Nginx** — En el contenedor Docker, el build estático de Vite es servido por Nginx con regla `try_files` para soportar el enrutamiento SPA.
