import { defaultPool, pool } from "../config/db.config.js";
import dotenv from "dotenv";
dotenv.config();

const db_name = process.env.DB_NAME || "educonnect";

export const createDatabase = async () => {
  try {
    const checkQuery = `SELECT 1 FROM pg_database WHERE datname= $1`;
    const res = await defaultPool.query(checkQuery, [db_name]);
    if (res.rowCount === 0) {
      await defaultPool.query(`CREATE DATABASE ${db_name}`);
      console.log("✅ Database created successfully!");
    } else {
      console.log(`ℹ️ Database ${db_name} already exists!`);
    }
  } catch (error) {
    console.error("❌ Error creating database:", error.message);
  } finally {
    await defaultPool.end();
  }
};

export const createTables = async () => {
  try {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
    await pool.query("BEGIN");

    // ------------------
    // Schemas
    // ------------------
    await pool.query(`CREATE SCHEMA IF NOT EXISTS core`);
    await pool.query(`CREATE SCHEMA IF NOT EXISTS learning`);
    await pool.query(`CREATE SCHEMA IF NOT EXISTS communication`);
    await pool.query(`CREATE SCHEMA IF NOT EXISTS analytics`);

    // ------------------
    // Core Tables
    // ------------------
    await pool.query(`
      CREATE TABLE IF NOT EXISTS core.universities (
        university_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(150) NOT NULL UNIQUE,
        location VARCHAR(100),
        contact_email VARCHAR(120),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS core.users (
        user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(120) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        phone_number VARCHAR(20),
        university_id UUID REFERENCES core.universities(university_id),
        department VARCHAR(100),
        role VARCHAR(20) DEFAULT 'student',
        status VARCHAR(20) DEFAULT 'active',
        is_verified BOOLEAN DEFAULT false,
        reset_token VARCHAR(100),
        reset_token_expiry TIMESTAMP,
        otp_code VARCHAR(100),
        otp_expiry TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ------------------
    // Learning Tables
    // ------------------
    await pool.query(`
      CREATE TABLE IF NOT EXISTS learning.courses (
        course_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        course_code VARCHAR(20) UNIQUE NOT NULL,
        course_title VARCHAR(120) NOT NULL,
        department VARCHAR(100),
        semester VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS learning.study_groups (
        group_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        group_name VARCHAR(100) NOT NULL,
        created_by UUID REFERENCES core.users(user_id) ON DELETE CASCADE,
        description TEXT,
        course_id UUID REFERENCES learning.courses(course_id) ON DELETE SET NULL,
        max_members INTEGER DEFAULT 0 CHECK (max_members >= 0),
        current_members INTEGER DEFAULT 1 CHECK (current_members >= 1),
        meeting_schedule VARCHAR(200),
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','inactive','archived')),
        visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public','private')),
        tags TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CHECK (max_members = 0 OR current_members <= max_members)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS learning.study_group_members (
        group_member_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        group_id UUID REFERENCES learning.study_groups(group_id) ON DELETE CASCADE,
        user_id UUID REFERENCES core.users(user_id) ON DELETE CASCADE,
        role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner','admin','member')),
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','left','removed')),
        UNIQUE(group_id, user_id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS learning.study_group_invitations (
        invitation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        group_id UUID REFERENCES learning.study_groups(group_id) ON DELETE CASCADE,
        invited_by UUID REFERENCES core.users(user_id) ON DELETE CASCADE,
        invited_user_id UUID REFERENCES core.users(user_id) ON DELETE CASCADE,
        invited_email VARCHAR(255),
        token VARCHAR(100) UNIQUE,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined','expired')),
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
await pool.query(`
  CREATE TABLE IF NOT EXISTS learning.group_request (
    request_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES core.users(user_id) ON DELETE CASCADE,
    group_id UUID REFERENCES learning.study_groups(group_id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'declined', 'approved')),
    message VARCHAR(225),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_by UUID REFERENCES core.users(user_id) ON DELETE CASCADE,
    processed_at TIMESTAMP
  )
`);

    // Partial unique indexes for invitations
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_pending_invite_email
      ON learning.study_group_invitations(group_id, invited_email)
      WHERE status='pending'
    `);
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_pending_invite_user
      ON learning.study_group_invitations(group_id, invited_user_id)
      WHERE status='pending'
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS learning.course_resources (
        resource_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        uploader_id UUID REFERENCES core.users(user_id) ON DELETE CASCADE,
        course_id UUID REFERENCES learning.courses(course_id),
        file_url TEXT,
        description VARCHAR(225),
        access TEXT DEFAULT 'public' CHECK (access IN ('public','private')),
        file_type VARCHAR(20),
        title VARCHAR(100),
        tags JSONB DEFAULT '[]',
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);


    // ------------------
    // Communication Tables
    // ------------------
    await pool.query(`
      CREATE TABLE IF NOT EXISTS communication.conversations (
        conversation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_type VARCHAR(20),
        created_by UUID REFERENCES core.users(user_id),
        group_id UUID REFERENCES learning.study_groups(group_id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS communication.messages (
        message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID REFERENCES communication.conversations(conversation_id) ON DELETE CASCADE,
        sender_id UUID REFERENCES core.users(user_id) ON DELETE CASCADE,
        message_text TEXT,
        message_type VARCHAR(20) DEFAULT 'text',
        status VARCHAR(20) DEFAULT 'sent',
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS communication.conversation_participants (
        participant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID REFERENCES communication.conversations(conversation_id) ON DELETE CASCADE,
        user_id UUID REFERENCES core.users(user_id) ON DELETE CASCADE,
        last_read_at TIMESTAMP DEFAULT NULL,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(conversation_id, user_id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS communication.notifications (
        notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES core.users(user_id) ON DELETE CASCADE,
        title VARCHAR(100),
        body TEXT,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ------------------
    // Analytics Tables
    // ------------------
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics.analytics (
        metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        metric_name VARCHAR(100),
        today_value INT DEFAULT 0,
        weekly_value INT DEFAULT 0,
        monthly_value INT DEFAULT 0,
        growth_rate NUMERIC(5,2) DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics.user_activity (
        activity_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES core.users(user_id) ON DELETE CASCADE,
        activity_type VARCHAR(50),
        description TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics.reports (
        report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        reporter_id UUID REFERENCES core.users(user_id) ON DELETE CASCADE,
        reported_user_id UUID REFERENCES core.users(user_id) ON DELETE CASCADE,
        reason TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS core.user_preferences (
        preference_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE REFERENCES core.users(user_id) ON DELETE CASCADE,
        profile_visibility VARCHAR(20) DEFAULT 'public'
          CHECK (profile_visibility IN ('public', 'private', 'friends')),
        show_email BOOLEAN DEFAULT false,
        show_phone BOOLEAN DEFAULT false,
        show_activity BOOLEAN DEFAULT true,
        allow_messages BOOLEAN DEFAULT true,
        data_sharing BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ------------------
    // PERFORMANCE INDEXES
    // ------------------
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_university_id ON core.users(university_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_study_groups_course_id ON learning.study_groups(course_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_study_groups_created_by ON learning.study_groups(created_by)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_study_groups_created_at ON learning.study_groups(created_at DESC)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_study_groups_tags_gin ON learning.study_groups USING GIN (tags)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON learning.study_group_members(group_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON learning.study_group_members(user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_courses_department ON learning.courses(department)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON analytics.user_activity(user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON analytics.reports(reporter_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_reports_reported_user_id ON analytics.reports(reported_user_id)`);

    console.log("🚀 Performance indexes added successfully!");
    await pool.query("COMMIT");
    console.log("✅ All tables created successfully!");
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("❌ Error creating tables:", error.message);
  }
};
