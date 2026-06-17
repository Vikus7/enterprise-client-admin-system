# Backend - PA-CO Comercial e Industrial

API REST en Java + Spring Boot para administrar clientes empresariales (B4B/JDE),
con autenticacion JWT, documentacion Swagger y auditoria de operaciones.

## Stack tecnologico

- Java 25
- Spring Boot 4.0.7 (Maven, JAR)
- Spring Web (MVC), Spring Security, Spring Data JPA + Hibernate
- PostgreSQL
- Lombok, Jakarta Validation
- jjwt (io.jsonwebtoken) para JWT
- springdoc-openapi (Swagger UI)

## Requisitos previos

- Java 25 instalado (`java -version`)
- Una instancia de PostgreSQL accesible (local o en contenedor)
- El proyecto incluye Maven Wrapper, no es necesario instalar Maven

## Variables de entorno

Todas tienen un valor por defecto para ejecucion local. Se pueden sobreescribir
con variables de entorno.

| Variable | Valor por defecto | Descripcion |
|---|---|---|
| `SERVER_PORT` | `8080` | Puerto del backend |
| `DB_HOST` | `localhost` | Host de PostgreSQL |
| `DB_PORT` | `5432` | Puerto de PostgreSQL |
| `DB_NAME` | `paco_db` | Nombre de la base de datos |
| `DB_USER` | `postgres` | Usuario de la base de datos |
| `DB_PASSWORD` | `postgres` | Contrasena de la base de datos |
| `JWT_SECRET` | (clave de desarrollo) | Clave de firma del token JWT |
| `JWT_EXPIRATION` | `86400000` | Vigencia del token en milisegundos (24 h) |

## Base de datos

La estructura se crea automaticamente al iniciar la aplicacion mediante
`src/main/resources/schema.sql`, y el usuario de prueba se inserta desde
`src/main/resources/data.sql` (`spring.sql.init.mode=always`).

Tablas: `app_user`, `b4b_customer`, `integration_event_log`.

## Ejecucion

Levantar previamente una base PostgreSQL. Ejemplo rapido con Docker:

```bash
docker run --name paco-postgres -e POSTGRES_DB=paco_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16-alpine
```

Arrancar el backend:

```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```

## URLs

- Backend: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

## Credenciales de prueba

- Usuario: `admin`
- Contrasena: `admin123`

## Endpoints

| Metodo | Endpoint | Protegido | Descripcion |
|---|---|---|---|
| POST | `/api/auth/login` | No | Autentica y devuelve un token JWT |
| GET | `/api/clients` | Si | Lista todos los clientes |
| GET | `/api/clients/{id}` | Si | Obtiene un cliente por id |
| POST | `/api/clients` | Si | Crea un cliente |
| PUT | `/api/clients/{id}` | Si | Actualiza un cliente |
| DELETE | `/api/clients/{id}` | Si | Desactiva un cliente (soft delete -> status INACTIVE) |

El token se envia en el encabezado: `Authorization: Bearer <token>`

## Ejemplos rapidos (curl)

```bash
# 1. Login: obtener token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 2. Crear cliente (reemplazar <TOKEN>)
curl -X POST http://localhost:8080/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"jdeCode":"JDE001","taxId":"1790012345001","businessName":"Comercial Andina S.A.","email":"contacto@andina.com","creditLimit":15000.50}'

# 3. Listar clientes
curl http://localhost:8080/api/clients -H "Authorization: Bearer <TOKEN>"
```

## Decisiones tecnicas relevantes

- **Spring Boot 4.0.7**: se eligio la ultima version estable compatible con Java 25
  (la 4.1.0 aun se encuentra en fase milestone).
- **Inicializacion con `schema.sql`**: la estructura la administra el script SQL y
  Hibernate solo la valida (`ddl-auto=validate`), lo que da control explicito sobre
  constraints y tipos.
- **Seguridad stateless con JWT**: no se mantiene sesion en el servidor; cada
  peticion lleva su token. El unico endpoint publico es el login (y Swagger).
- **Contrasenas con BCrypt**: nunca se almacena la contrasena en texto plano.
- **Soft delete**: el `DELETE` no elimina el registro fisicamente; cambia el estado
  a `INACTIVE` y devuelve el cliente actualizado. Esto preserva la integridad del
  historial de auditoria (la FK de `integration_event_log` depende del cliente).
- **Auditoria automatica**: cada operacion CREATE, UPDATE y STATUS_CHANGE se registra
  en `integration_event_log` desde la capa de servicio.
