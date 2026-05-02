CREATE TABLE identities (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_key        TEXT NOT NULL UNIQUE,
    handle            VARCHAR(18) NOT NULL UNIQUE,
    signed_identity   JSONB NOT NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE credentials (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identity_id UUID NOT NULL REFERENCES identities(id) ON DELETE CASCADE,
    auth_data   JSONB NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE submissions (
    id              TEXT PRIMARY KEY,
    identity_id     UUID NOT NULL REFERENCES identities(id),
    problem_id      TEXT NOT NULL,
    format          TEXT NOT NULL,
    verdict         TEXT,
    time_ms         INTEGER,
    memory_kb       INTEGER,
    submitted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    certificate     JSONB
);
