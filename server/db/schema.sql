
-- PostgreSQL schema
-- Barebones climbing tracker database

CREATE TYPE session_type AS ENUM ('indoor', 'outdoor');

CREATE TYPE climb_style AS ENUM ('Rope', 'Boulder');

CREATE TYPE climb_attempt AS ENUM (
    'Flash',
    'Onsight',
    'Redpoint',
    'Fell/Hung',
    'Project'
);

CREATE TYPE indoor_color AS ENUM (
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'Orange',
    'Purple',
    'Pink',
    'White',
    'Black'
);

-- Maps to: User
CREATE TABLE users (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username    TEXT        NOT NULL UNIQUE,
    email       TEXT        UNIQUE,
    image_link  TEXT,
    is_admin    BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Maps to: Friendship
-- One row represents one friendship between two users.
CREATE TABLE friendships (
    id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id    INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    friend_id  INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, friend_id),
    CHECK (user_id <> friend_id)
);

-- Maps to: Session / SessionSummary
CREATE TABLE sessions (
    id         INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title      TEXT         NOT NULL,
    date       DATE         NOT NULL,
    location   TEXT,
    type       session_type NOT NULL,
    duration   INTEGER      NOT NULL,
    feeling    SMALLINT     NOT NULL CHECK (feeling BETWEEN 1 AND 5),
    notes      TEXT,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Maps to: Climb / IndoorClimb / OutdoorClimb
CREATE TABLE climbs (
    id         INTEGER       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    session_id INTEGER       NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    grade      TEXT          NOT NULL,
    style      climb_style   NOT NULL,
    attempt    climb_attempt NOT NULL,
    quality    SMALLINT      NOT NULL CHECK (quality BETWEEN 1 AND 10),
    comment    TEXT,
    color      indoor_color,
    name       TEXT,
    created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

