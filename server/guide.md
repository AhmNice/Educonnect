

---

# 🧩 **EduConnect Database Schema (PostgreSQL)**

A modular schema design for **EduConnect**, grouped into logical domains.

---

## 🧱 **Schema Overview**

| Schema Name     | Description                                     |
| --------------- | ----------------------------------------------- |
| `core`          | Handles universities, users, and authentication |
| `learning`      | Manages courses, study groups, and resources    |
| `communication` | Handles chat, messages, and notifications       |
| `analytics`     | Tracks metrics, activities, and reports         |

---

## 🏛️ **Schema: `core`**

### **Table: universities**

Stores details of all supported universities.

| Column          | Type         | Description            |
| --------------- | ------------ | ---------------------- |
| `id`            | SERIAL (PK)  | Unique university ID   |
| `name`          | VARCHAR(150) | Name of the university |
| `location`      | VARCHAR(100) | City or region         |
| `contact_email` | VARCHAR(120) | Official contact email |
| `created_at`    | TIMESTAMP    | Date added             |

---

### **Table: users**

Holds user profiles and account information.

| Column          | Type                            | Description                    |
| --------------- | ------------------------------- | ------------------------------ |
| `id`            | SERIAL (PK)                     | User ID                        |
| `full_name`     | VARCHAR(100)                    | User’s full name               |
| `email`         | VARCHAR(120)                    | Unique email                   |
| `password_hash` | TEXT                            | Hashed password                |
| `university_id` | INT (FK → core.universities.id) | Linked university              |
| `department`    | VARCHAR(100)                    | User’s department              |
| `role`          | VARCHAR(20)                     | `student`, `tutor`, or `admin` |
| `status`        | VARCHAR(20)                     | `active`, `inactive`           |
| `created_at`    | TIMESTAMP                       | Account creation date          |

---

## 📘 **Schema: `learning`**

### **Table: courses**

Represents supported university courses.

| Column         | Type         | Description            |
| -------------- | ------------ | ---------------------- |
| `id`           | SERIAL (PK)  | Course ID              |
| `course_code`  | VARCHAR(20)  | Unique code            |
| `course_title` | VARCHAR(120) | Title of the course    |
| `department`   | VARCHAR(100) | Department offering it |
| `semester`     | VARCHAR(20)  | Semester               |
| `created_at`   | TIMESTAMP    | Created at             |

---

### **Table: study_groups**

User-created study circles per course.

| Column        | Type                           | Description          |
| ------------- | ------------------------------ | -------------------- |
| `id`          | SERIAL (PK)                    | Group ID             |
| `group_name`  | VARCHAR(100)                   | Name of the group    |
| `course_id`   | INT (FK → learning.courses.id) | Related course       |
| `created_by`  | INT (FK → core.users.id)       | Creator user         |
| `description` | TEXT                           | Group purpose        |
| `status`      | VARCHAR(20)                    | `active`, `archived` |
| `created_at`  | TIMESTAMP                      | Creation date        |

---

### **Table: group_members**

Links users to study groups (many-to-many).

| Column      | Type                                | Description       |
| ----------- | ----------------------------------- | ----------------- |
| `id`        | SERIAL (PK)                         | Membership ID     |
| `group_id`  | INT (FK → learning.study_groups.id) | Group             |
| `user_id`   | INT (FK → core.users.id)            | Member            |
| `role`      | VARCHAR(20)                         | `member`, `admin` |
| `joined_at` | TIMESTAMP                           | Joined date       |

---

### **Table: course_resources**

Holds files and materials shared in groups/courses.

| Column        | Type                           | Description                 |
| ------------- | ------------------------------ | --------------------------- |
| `id`          | SERIAL (PK)                    | Resource ID                 |
| `uploader_id` | INT (FK → core.users.id)       | Uploader                    |
| `course_id`   | INT (FK → learning.courses.id) | Related course              |
| `file_url`    | TEXT                           | File path or link           |
| `file_type`   | VARCHAR(20)                    | File type (PDF, DOCX, etc.) |
| `title`       | VARCHAR(100)                   | Resource title              |
| `uploaded_at` | TIMESTAMP                      | Upload date                 |

---

## 💬 **Schema: `communication`**

### **Table: conversations**

Represents private or group chats.

| Column              | Type                                | Description          |
| ------------------- | ----------------------------------- | -------------------- |
| `id`                | SERIAL (PK)                         | Conversation ID      |
| `conversation_type` | VARCHAR(20)                         | `private` or `group` |
| `group_id`          | INT (FK → learning.study_groups.id) | Linked group         |
| `created_at`        | TIMESTAMP                           | Creation date        |

---

### **Table: messages**

Stores chat messages.

| Column            | Type                                      | Description                |
| ----------------- | ----------------------------------------- | -------------------------- |
| `id`              | SERIAL (PK)                               | Message ID                 |
| `conversation_id` | INT (FK → communication.conversations.id) | Conversation               |
| `sender_id`       | INT (FK → core.users.id)                  | Sender                     |
| `message_text`    | TEXT                                      | Message body               |
| `message_type`    | VARCHAR(20)                               | `text`, `image`, or `file` |
| `sent_at`         | TIMESTAMP                                 | Timestamp                  |

---

### **Table: notifications**

In-app alerts for users.

| Column       | Type                     | Description        |
| ------------ | ------------------------ | ------------------ |
| `id`         | SERIAL (PK)              | Notification ID    |
| `user_id`    | INT (FK → core.users.id) | Receiver           |
| `title`      | VARCHAR(100)             | Notification title |
| `body`       | TEXT                     | Message body       |
| `is_read`    | BOOLEAN                  | Read status        |
| `created_at` | TIMESTAMP                | Created date       |

---

## 📊 **Schema: `analytics`**

### **Table: analytics**

Tracks overall platform metrics.

| Column          | Type         | Description       |
| --------------- | ------------ | ----------------- |
| `id`            | SERIAL (PK)  | Metric ID         |
| `metric_name`   | VARCHAR(100) | Metric label      |
| `today_value`   | INT          | Today’s count     |
| `weekly_value`  | INT          | Weekly total      |
| `monthly_value` | INT          | Monthly total     |
| `growth_rate`   | FLOAT        | Growth percentage |
| `last_updated`  | TIMESTAMP    | Updated at        |

---

### **Table: user_activity**

Logs user actions for insights.

| Column          | Type                     | Description    |
| --------------- | ------------------------ | -------------- |
| `id`            | SERIAL (PK)              | Activity ID    |
| `user_id`       | INT (FK → core.users.id) | User           |
| `activity_type` | VARCHAR(50)              | Type of action |
| `description`   | TEXT                     | Details        |
| `timestamp`     | TIMESTAMP                | Date and time  |

---

### **Table: reports**

For user or content moderation.

| Column             | Type                     | Description           |
| ------------------ | ------------------------ | --------------------- |
| `id`               | SERIAL (PK)              | Report ID             |
| `reporter_id`      | INT (FK → core.users.id) | Who reported          |
| `reported_user_id` | INT (FK → core.users.id) | Who was reported      |
| `reason`           | TEXT                     | Report reason         |
| `status`           | VARCHAR(20)              | `pending`, `resolved` |
| `created_at`       | TIMESTAMP                | Created at            |

---

## 🔗 **Cross-Schema Relationships**

```text
core.universities 1 — * core.users
core.users 1 — * learning.study_groups (creator)
core.users * — * learning.study_groups (via learning.group_members)
learning.courses 1 — * learning.study_groups
learning.courses 1 — * learning.course_resources
learning.study_groups 1 — * communication.conversations
communication.conversations 1 — * communication.messages
core.users 1 — * communication.messages
core.users 1 — * communication.notifications
core.users 1 — * analytics.user_activity
core.users 1 — * analytics.reports
```


