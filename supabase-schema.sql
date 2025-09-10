-- SQL script per PostgreSQL/Supabase
-- Le tabelle per better-auth vengono create automaticamente dalla migrazione

-- Crea la tabella note
CREATE TABLE IF NOT EXISTS note (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title TEXT,
    content TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);

-- Crea un indice per migliorare le performance
CREATE INDEX IF NOT EXISTS idx_note_user_id ON note(user_id);

-- Trigger per aggiornare automaticamente updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_note_updated_at BEFORE UPDATE ON note
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
