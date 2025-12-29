# 📘 EduConnect Database Schema

This document describes the **PostgreSQL database structure** used by **EduConnect**.
The database is organized into **logical schemas** to separate concerns and improve maintainability.

---

## 🗄️ Database Overview

* **Database name:** `educonnect` (configurable via `DB_NAME`)
* **Database engine:** PostgreSQL
* **UUID generation:** `pgcrypto` (`gen_random_uuid()`)
* **Schemas used:**

  * `core`
  * `learning`
  * `communication`
  * `analytics`

---

## 🧩 Schema Breakdown

### 1️⃣ Core Schema (`core`)

Handles users, universities, and user preferences.

---

### `core.universities`

Stores university-level information.

| Column          | Type         | Description                  |
| --------------- | ------------ | ---------------------------- |
| `university_id` | UUID (PK)    | Unique university identifier |
| `name`          | VARCHAR(150) | University name (unique)     |
| `location`      | VARCHAR(100) | Location                     |
| `contact_email` | VARCHAR(120) | Contact email                |
| `created_at`    | TIMESTAMP    | Record creation time         |

---

### `core.users`

Stores user accounts and authentication data.

| Column               | Type         | Description               |
| -------------------- | ------------ | ------------------------- |
| `user_id`            | UUID (PK)    | User identifier           |
| `full_name`          | VARCHAR(100) | Full name                 |
| `email`              | VARCHAR(120) | Email (unique)            |
| `password_hash`      | TEXT         | Hashed password           |
| `phone_number`       | VARCHAR(20)  | Optional phone            |
| `university_id`      | UUID (FK)    | Linked university         |
| `department`         | VARCHAR(100) | Academic department       |
| `role`               | VARCHAR(20)  | `student`, `admin`, etc.  |
| `status`             | VARCHAR(20)  | `active`, `inactive`      |
| `is_verified`        | BOOLEAN      | Email verification status |
| `reset_token`        | VARCHAR(100) | Password reset token      |
| `reset_token_expiry` | TIMESTAMP    | Token expiration          |
| `otp_code`           | VARCHAR(100) | OTP code                  |
| `otp_expiry`         | TIMESTAMP    | OTP expiration            |
| `created_at`         | TIMESTAMP    | Creation timestamp        |
| `updated_at`         | TIMESTAMP    | Last update timestamp     |

---

### `core.user_preferences`

Stores per-user privacy and notification preferences.

| Column               | Type              | Description                    |
| -------------------- | ----------------- | ------------------------------ |
| `preference_id`      | UUID (PK)         | Preference record              |
| `user_id`            | UUID (FK, unique) | User                           |
| `profile_visibility` | VARCHAR(20)       | `public`, `private`, `friends` |
| `show_email`         | BOOLEAN           | Email visibility               |
| `show_phone`         | BOOLEAN           | Phone visibility               |
| `show_activity`      | BOOLEAN           | Activity visibility            |
| `allow_messages`     | BOOLEAN           | Messaging permission           |
| `data_sharing`       | BOOLEAN           | Analytics consent              |
| `created_at`         | TIMESTAMP         | Created time                   |
| `updated_at`         | TIMESTAMP         | Updated time                   |

---

## 2️⃣ Learning Schema (`learning`)

Manages courses, study groups, memberships, and learning resources.

---

### `learning.courses`

| Column         | Type         | Description        |
| -------------- | ------------ | ------------------ |
| `course_id`    | UUID (PK)    | Course identifier  |
| `course_code`  | VARCHAR(20)  | Unique course code |
| `course_title` | VARCHAR(120) | Course name        |
| `department`   | VARCHAR(100) | Department         |
| `semester`     | VARCHAR(20)  | Semester           |
| `created_at`   | TIMESTAMP    | Created            |
| `updated_at`   | TIMESTAMP    | Updated            |

---

### `learning.study_groups`

Represents collaborative study groups.

| Column             | Type         | Description                      |
| ------------------ | ------------ | -------------------------------- |
| `group_id`         | UUID (PK)    | Group ID                         |
| `group_name`       | VARCHAR(100) | Group name                       |
| `created_by`       | UUID (FK)    | Creator                          |
| `description`      | TEXT         | Description                      |
| `course_id`        | UUID (FK)    | Related course                   |
| `max_members`      | INTEGER      | Max members (0 = unlimited)      |
| `current_members`  | INTEGER      | Active members                   |
| `meeting_schedule` | VARCHAR(200) | Meeting time                     |
| `status`           | VARCHAR(20)  | `active`, `inactive`, `archived` |
| `visibility`       | VARCHAR(20)  | `public`, `private`              |
| `tags`             | TEXT[]       | Search tags                      |
| `created_at`       | TIMESTAMP    | Created                          |
| `updated_at`       | TIMESTAMP    | Updated                          |

---

### `learning.study_group_members`

Maps users to groups.

| Column            | Type        | Description                 |
| ----------------- | ----------- | --------------------------- |
| `group_member_id` | UUID (PK)   | Membership ID               |
| `group_id`        | UUID (FK)   | Group                       |
| `user_id`         | UUID (FK)   | User                        |
| `role`            | VARCHAR(20) | `owner`, `admin`, `member`  |
| `status`          | VARCHAR(20) | `active`, `left`, `removed` |
| `joined_at`       | TIMESTAMP   | Join time                   |

---

### `learning.study_group_invitations`

Handles invitations.

| Column            | Type         | Description                                  |
| ----------------- | ------------ | -------------------------------------------- |
| `invitation_id`   | UUID (PK)    | Invitation ID                                |
| `group_id`        | UUID (FK)    | Group                                        |
| `invited_by`      | UUID (FK)    | Sender                                       |
| `invited_user_id` | UUID (FK)    | Receiver                                     |
| `invited_email`   | VARCHAR(255) | Email invite                                 |
| `token`           | VARCHAR(100) | Invite token                                 |
| `status`          | VARCHAR(20)  | `pending`, `accepted`, `declined`, `expired` |
| `expires_at`      | TIMESTAMP    | Expiry                                       |
| `created_at`      | TIMESTAMP    | Created                                      |

---

### `learning.group_request`

Handles join requests.

| Column         | Type         | Description                       |
| -------------- | ------------ | --------------------------------- |
| `request_id`   | UUID (PK)    | Request ID                        |
| `user_id`      | UUID (FK)    | Requester                         |
| `group_id`     | UUID (FK)    | Group                             |
| `status`       | VARCHAR(20)  | `pending`, `approved`, `declined` |
| `message`      | VARCHAR(225) | Optional message                  |
| `requested_at` | TIMESTAMP    | Requested                         |
| `processed_by` | UUID (FK)    | Admin                             |
| `processed_at` | TIMESTAMP    | Processed                         |

---

### `learning.course_resources`

Stores uploaded course materials.

| Column        | Type         | Description         |
| ------------- | ------------ | ------------------- |
| `resource_id` | UUID (PK)    | Resource ID         |
| `uploader_id` | UUID (FK)    | Uploaded by         |
| `course_id`   | UUID (FK)    | Course              |
| `file_url`    | TEXT         | File location       |
| `file_type`   | VARCHAR(20)  | File type           |
| `title`       | VARCHAR(100) | Title               |
| `description` | VARCHAR(225) | Description         |
| `access`      | TEXT         | `public`, `private` |
| `tags`        | JSONB        | Metadata tags       |
| `uploaded_at` | TIMESTAMP    | Upload time         |

---

## 3️⃣ Communication Schema (`communication`)

Manages messaging and notifications.

---

### `communication.conversations`

| Column              | Type        | Description        |
| ------------------- | ----------- | ------------------ |
| `conversation_id`   | UUID (PK)   | Conversation       |
| `conversation_type` | VARCHAR(20) | `private`, `group` |
| `created_by`        | UUID (FK)   | Creator            |
| `group_id`          | UUID (FK)   | Group chat         |
| `created_at`        | TIMESTAMP   | Created            |

---

### `communication.messages`

| Column            | Type        | Description    |
| ----------------- | ----------- | -------------- |
| `message_id`      | UUID (PK)   | Message        |
| `conversation_id` | UUID (FK)   | Conversation   |
| `sender_id`       | UUID (FK)   | Sender         |
| `message_text`    | TEXT        | Content        |
| `message_type`    | VARCHAR(20) | `text`, `file` |
| `status`          | VARCHAR(20) | `sent`, `read` |
| `sent_at`         | TIMESTAMP   | Sent time      |
| `updated_at`      | TIMESTAMP   | Edited         |

---

### `communication.notifications`

| Column            | Type         | Description  |
| ----------------- | ------------ | ------------ |
| `notification_id` | UUID (PK)    | Notification |
| `user_id`         | UUID (FK)    | Receiver     |
| `title`           | VARCHAR(100) | Title        |
| `body`            | TEXT         | Content      |
| `is_read`         | BOOLEAN      | Read status  |
| `created_at`      | TIMESTAMP    | Created      |

---

## 4️⃣ Analytics Schema (`analytics`)

Tracks platform metrics and moderation.

---

### `analytics.analytics`

| Column          | Type         | Description |
| --------------- | ------------ | ----------- |
| `metric_id`     | UUID (PK)    | Metric      |
| `metric_name`   | VARCHAR(100) | Name        |
| `today_value`   | INT          | Daily       |
| `weekly_value`  | INT          | Weekly      |
| `monthly_value` | INT          | Monthly     |
| `growth_rate`   | NUMERIC(5,2) | Growth %    |
| `last_updated`  | TIMESTAMP    | Updated     |

---

### `analytics.user_activity`

Tracks user actions.

| Column          | Type        | Description |
| --------------- | ----------- | ----------- |
| `activity_id`   | UUID (PK)   | Activity    |
| `user_id`       | UUID (FK)   | User        |
| `activity_type` | VARCHAR(50) | Action      |
| `description`   | TEXT        | Details     |
| `timestamp`     | TIMESTAMP   | Time        |

---

### `analytics.reports`

Handles moderation reports.

| Column             | Type        | Description           |
| ------------------ | ----------- | --------------------- |
| `report_id`        | UUID (PK)   | Report                |
| `reporter_id`      | UUID (FK)   | Reporter              |
| `reported_user_id` | UUID (FK)   | Reported              |
| `reason`           | TEXT        | Reason                |
| `status`           | VARCHAR(20) | `pending`, `resolved` |
| `created_at`       | TIMESTAMP   | Created               |

---

## ⚡ Indexes & Performance

* Indexed foreign keys for fast joins
* GIN index on `study_groups.tags`
* Partial unique indexes for **pending invitations**
* Optimized for analytics and group queries

---

## ✅ Notes

* All UUIDs use `gen_random_uuid()`
* Cascading deletes ensure data integrity
* Designed for scalability and modular growth

