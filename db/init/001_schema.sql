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

CREATE TABLE solve_certificates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identity_id     UUID NOT NULL REFERENCES identities(id) ON DELETE CASCADE,
    server_domain   VARCHAR(255) NOT NULL,
    server_key      TEXT NOT NULL,
    problem_id      VARCHAR(32) NOT NULL,
    score           DOUBLE PRECISION NOT NULL CHECK (score >= 0 AND score <= 1),
    signed_at       TIMESTAMPTZ NOT NULL,
    raw_certificate JSONB NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (identity_id, server_domain, problem_id)
);