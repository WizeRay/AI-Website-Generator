-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================
-- ENUMS
-- =========================

CREATE TYPE role AS ENUM (
    'user',
    'assistant'
);

-- =========================
-- USER
-- =========================

CREATE TABLE "user" (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    total_creation INTEGER NOT NULL DEFAULT 0,
    credits INTEGER NOT NULL DEFAULT 20,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    email_verified BOOLEAN NOT NULL DEFAULT FALSE
);

-- =========================
-- WEBSITE PROJECT
-- =========================

CREATE TABLE website_project (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    initial_prompt TEXT NOT NULL,
    current_code TEXT,
    current_version_index TEXT NOT NULL DEFAULT '',
    user_id TEXT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_project_user
        FOREIGN KEY (user_id)
        REFERENCES "user"(id)
);

-- =========================
-- CONVERSATION
-- =========================

CREATE TABLE conversation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role role NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    project_id UUID NOT NULL,

    CONSTRAINT fk_conversation_project
        FOREIGN KEY (project_id)
        REFERENCES website_project(id)
        ON DELETE CASCADE
);

-- =========================
-- VERSION
-- =========================

CREATE TABLE version (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL,
    description TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    project_id UUID NOT NULL,

    CONSTRAINT fk_version_project
        FOREIGN KEY (project_id)
        REFERENCES website_project(id)
        ON DELETE CASCADE
);

-- =========================
-- TRANSACTION
-- =========================

CREATE TABLE transaction (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    is_paid BOOLEAN NOT NULL DEFAULT FALSE,
    plan_id TEXT NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    credits INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_transaction_user
        FOREIGN KEY (user_id)
        REFERENCES "user"(id)
        ON DELETE CASCADE
);

-- =========================
-- SESSION
-- =========================

CREATE TABLE session (
    id TEXT PRIMARY KEY,
    expires_at TIMESTAMP NOT NULL,
    token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    user_id TEXT NOT NULL,

    CONSTRAINT fk_session_user
        FOREIGN KEY (user_id)
        REFERENCES "user"(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_session_user_id
ON session(user_id);

-- =========================
-- ACCOUNT
-- =========================

CREATE TABLE account (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    id_token TEXT,
    access_token_expires_at TIMESTAMP,
    refresh_token_expires_at TIMESTAMP,
    scope TEXT,
    password TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_account_user
        FOREIGN KEY (user_id)
        REFERENCES "user"(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_account_user_id
ON account(user_id);

-- =========================
-- VERIFICATION
-- =========================

CREATE TABLE verification (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_verification_identifier
ON verification(identifier);