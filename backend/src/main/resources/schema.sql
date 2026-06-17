-- =====================================================================
-- Esquema de base de datos PA-CO Comercial e Industrial
-- Se ejecuta automaticamente al iniciar la aplicacion
-- (spring.sql.init.mode=always). Usa IF NOT EXISTS para ser idempotente.
-- =====================================================================

-- Tabla de usuarios para autenticacion
CREATE TABLE IF NOT EXISTS app_user (
    id            BIGSERIAL PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(120),
    enabled       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Tabla principal del CRUD: clientes empresariales (B4B / JDE)
CREATE TABLE IF NOT EXISTS b4b_customer (
    id              BIGSERIAL PRIMARY KEY,
    jde_code        VARCHAR(20)  NOT NULL UNIQUE,
    tax_id          VARCHAR(13)  NOT NULL UNIQUE,
    business_name   VARCHAR(150) NOT NULL,
    commercial_name VARCHAR(150),
    email           VARCHAR(120),
    phone           VARCHAR(30),
    status          VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    credit_limit    NUMERIC(12,2),
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Tabla de auditoria: registra cada operacion sobre los clientes
CREATE TABLE IF NOT EXISTS integration_event_log (
    id            BIGSERIAL PRIMARY KEY,
    customer_id   BIGINT      NOT NULL REFERENCES b4b_customer(id),
    source_system VARCHAR(30) NOT NULL,
    event_type    VARCHAR(30) NOT NULL,
    event_status  VARCHAR(20) NOT NULL,
    message       TEXT,
    created_at    TIMESTAMP   NOT NULL DEFAULT NOW()
);
