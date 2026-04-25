CREATE TABLE identities (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_key  TEXT NOT NULL UNIQUE,
    private_key TEXT NOT NULL,
    handle      VARCHAR(18) NOT NULL UNIQUE,
    bio         TEXT,
    avatar_url  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE auth_methods (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identity_id UUID NOT NULL REFERENCES identities(id) ON DELETE CASCADE,
    provider    VARCHAR(32) NOT NULL,
    credential  JSONB NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (identity_id, provider)
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
