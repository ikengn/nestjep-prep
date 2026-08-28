-- ---------------------------------------------------------------------------
-- Schema for the NestJS prep demo.
--
-- This file is the source of truth for the database. It is run automatically
-- by the MySQL container the first time its data volume is created
-- (see docker-compose.yml -> /docker-entrypoint-initdb.d). To re-run it from
-- scratch: `docker compose down -v && docker compose up -d`.
--
-- The TypeORM entities in src/**/entities map onto these tables. `synchronize`
-- is OFF by default so this SQL, not the app, owns the schema.
-- ---------------------------------------------------------------------------

CREATE DATABASE IF NOT EXISTS nestjs_prep
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nestjs_prep;

-- Users ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username    VARCHAR(50)     NOT NULL,
  email       VARCHAR(255)    NOT NULL,
  -- Stores a password HASH (bcrypt/argon2), never the plaintext password.
  password    VARCHAR(255)    NOT NULL,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username),
  UNIQUE KEY uq_users_email (email)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- Tasks ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name              VARCHAR(255)    NOT NULL,
  description       TEXT            NULL,
  completion_status ENUM('pending', 'in_progress', 'completed')
                      NOT NULL DEFAULT 'pending',
  user_id           BIGINT UNSIGNED NOT NULL,
  create_time       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_update_time  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_tasks_user_id (user_id),
  KEY idx_tasks_completion_status (completion_status),
  CONSTRAINT fk_tasks_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
