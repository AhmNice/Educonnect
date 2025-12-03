# EduConnect Database Schema Documentation

---

## **Schemas**

1. `core`
2. `learning`
3. `communication`
4. `analytics`

---

## **1. core Schema**

### **core.universities**

| Field           | Type         | Notes                       |
| --------------- | ------------ | --------------------------- |
| `university_id` | UUID PK      | Default `gen_random_uuid()` |
| `name`          | VARCHAR(150) | Unique, required            |
| `location`      | VARCHAR(100) | Optional                    |
| `contact_email` | VARCHAR(120) | Optional                    |
| `created_at`    | TIMESTAMP    | Default `CURRENT_TIMESTAMP` |

---

### **core.users**

| Field                | Type         | Notes                                   |
| -------------------- | ------------ | --------------------------------------- |
| `user_id`            | UUID PK      | Default `gen_random_uuid()`             |
| `full_name`          | VARCHAR(100) | Required                                |
| `email`              | VARCHAR(120) | Unique, required                        |
| `password_hash`      | TEXT         | Required                                |
| `university_id`      | UUID         | FK → `core.universities(university_id)` |
| `department`         | VARCHAR(100) | Optional                                |
| `role`               | VARCHAR(20)  | Default `"student"`                     |
| `status`             | VARCHAR(20)  | Default `"active"`                      |
| `is_verified`        | BOOLEAN      | Default `false`                         |
| `reset_token`        | VARCHAR(100) | Nullable                                |
| `reset_token_expiry` | TIMESTAMP    | Optional                                |
| `otp_code`           | VARCHAR(100) | Optional                                |
| `otp_expiry`         | TIMESTAMP    | Optional                                |
| `created_at`         | TIMESTAMP    | Default `CURRENT_TIMESTAMP`             |
| `updated_at`         | TIMESTAMP    | Default `CURRENT_TIMESTAMP`             |

---

## **2. learning Schema**

### **learning.courses**

| Field          | Type         | Notes                       |
| -------------- | ------------ | --------------------------- |
| `course_id`    | UUID PK      | Default `gen_random_uuid()` |
| `course_code`  | VARCHAR(20)  | Unique, required            |
| `course_title` | VARCHAR(120) | Required                    |
| `department`   | VARCHAR(100) | Optional                    |
| `semester`     | VARCHAR(20)  | Optional                    |
| `created_at`   | TIMESTAMP    | Default `CURRENT_TIMESTAMP` |
| `updated_at`   | TIMESTAMP    | Default `CURRENT_TIMESTAMP` |

---

### **learning.study_groups**

| Field              | Type         | Notes                                                 |
| ------------------ | ------------ | ----------------------------------------------------- |
| `group_id`         | UUID PK      | Default `gen_random_uuid()`                           |
| `group_name`       | VARCHAR(100) | Required                                              |
| `created_by`       | UUID         | FK → `core.users(user_id)`                            |
| `description`      | TEXT         | Optional                                              |
| `course_id`        | UUID         | FK → `learning.courses(course_id)`                    |
| `max_members`      | INT          | Default `0`, must be ≥ 0                              |
| `current_members`  | INT          | Default `1`, must be ≥ 1                              |
| `meeting_schedule` | VARCHAR(200) | Optional                                              |
| `status`           | VARCHAR(20)  | Default `'active'` (`active`, `inactive`, `archived`) |
| `visibility`       | VARCHAR(20)  | Default `'public'` (`public`, `private`)              |
| `tags`             | TEXT[]       | Optional                                              |
| `created_at`       | TIMESTAMP    | Default `CURRENT_TIMESTAMP`                           |
| `updated_at`       | TIMESTAMP    | Default `CURRENT_TIMESTAMP`                           |

---

### **learning.study_group_members**

| Field             | Type                 | Notes                                            |
| ----------------- | -------------------- | ------------------------------------------------ |
| `group_member_id` | UUID PK              | Default `gen_random_uuid()`                      |
| `group_id`        | UUID                 | FK → `learning.study_groups(group_id)`           |
| `user_id`         | UUID                 | FK → `core.users(user_id)`                       |
| `role`            | VARCHAR(20)          | Default `'member'` (`owner`, `admin`, `member`)  |
| `joined_at`       | TIMESTAMP            | Default `CURRENT_TIMESTAMP`                      |
| `status`          | VARCHAR(20)          | Default `'active'` (`active`, `left`, `removed`) |
| UNIQUE            | `group_id + user_id` | Prevent duplicate memberships                    |

---

### **learning.study_group_invitations**

| Field             | Type         | Notes                                                              |
| ----------------- | ------------ | ------------------------------------------------------------------ |
| `invitation_id`   | UUID PK      | Default `gen_random_uuid()`                                        |
| `group_id`        | UUID         | FK → `learning.study_groups(group_id)`                             |
| `invited_by`      | UUID         | FK → `core.users(user_id)`                                         |
| `invited_user_id` | UUID         | FK → `core.users(user_id)`                                         |
| `invited_email`   | VARCHAR(255) | Optional                                                           |
| `token`           | VARCHAR(100) | Unique, required                                                   |
| `status`          | VARCHAR(20)  | Default `'pending'` (`pending`, `accepted`, `declined`, `expired`) |
| `expires_at`      | TIMESTAMP    | Required                                                           |
| `created_at`      | TIMESTAMP    | Default `CURRENT_TIMESTAMP`                                        |

**Indexes:**

- Unique pending invitation per email: `(group_id, invited_email)` where status = `'pending'`
- Unique pending invitation per user: `(group_id, invited_user_id)` where status = `'pending'`

---

### **learning.course_resources**

| Field         | Type         | Notes                              |
| ------------- | ------------ | ---------------------------------- |
| `resource_id` | UUID PK      | Default `gen_random_uuid()`        |
| `uploader_id` | UUID         | FK → `core.users(user_id)`         |
| `course_id`   | UUID         | FK → `learning.courses(course_id)` |
| `file_url`    | TEXT         | File path / URL                    |
| `file_type`   | VARCHAR(20)  | Example: 'pdf', 'video', 'image'   |
| `title`       | VARCHAR(100) | Resource title                     |
| `uploaded_at` | TIMESTAMP    | Default `CURRENT_TIMESTAMP`        |

---

## **3. communication Schema**

### **communication.conversations**

| Field               | Type        | Notes                                  |
| ------------------- | ----------- | -------------------------------------- |
| `conversation_id`   | UUID PK     | Default `gen_random_uuid()`            |
| `conversation_type` | VARCHAR(20) | Optional                               |
| `group_id`          | UUID        | FK → `learning.study_groups(group_id)` |
| `created_at`        | TIMESTAMP   | Default `CURRENT_TIMESTAMP`            |

---

### **communication.messages**

| Field             | Type        | Notes                                               |
| ----------------- | ----------- | --------------------------------------------------- |
| `message_id`      | UUID PK     | Default `gen_random_uuid()`                         |
| `conversation_id` | UUID        | FK → `communication.conversations(conversation_id)` |
| `sender_id`       | UUID        | FK → `core.users(user_id)`                          |
| `message_text`    | TEXT        | Optional                                            |
| `message_type`    | VARCHAR(20) | Default `'text'`                                    |
| `status`          | VARCHAR(20) | Default `'sent'`                                    |
| `sent_at`         | TIMESTAMP   | Default `CURRENT_TIMESTAMP`                         |

---

### **communication.notifications**

| Field             | Type         | Notes                       |
| ----------------- | ------------ | --------------------------- |
| `notification_id` | UUID PK      | Default `gen_random_uuid()` |
| `user_id`         | UUID         | FK → `core.users(user_id)`  |
| `title`           | VARCHAR(100) | Notification title          |
| `body`            | TEXT         | Notification body           |
| `is_read`         | BOOLEAN      | Default `false`             |
| `created_at`      | TIMESTAMP    | Default `CURRENT_TIMESTAMP` |

---

## **4. analytics Schema**

### **analytics.analytics**

| Field           | Type         | Notes                       |
| --------------- | ------------ | --------------------------- |
| `metric_id`     | UUID PK      | Default `gen_random_uuid()` |
| `metric_name`   | VARCHAR(100) | Metric label                |
| `today_value`   | INT          | Default `0`                 |
| `weekly_value`  | INT          | Default `0`                 |
| `monthly_value` | INT          | Default `0`                 |
| `growth_rate`   | NUMERIC(5,2) | Default `0`                 |
| `last_updated`  | TIMESTAMP    | Default `CURRENT_TIMESTAMP` |

---

### **analytics.user_activity**

| Field           | Type        | Notes                            |
| --------------- | ----------- | -------------------------------- |
| `activity_id`   | UUID PK     | Default `gen_random_uuid()`      |
| `user_id`       | UUID        | FK → `core.users(user_id)`       |
| `activity_type` | VARCHAR(50) | Example: "login", "post_message" |
| `description`   | TEXT        | Optional details                 |
| `timestamp`     | TIMESTAMP   | Default `CURRENT_TIMESTAMP`      |

---

### **analytics.reports**

| Field              | Type        | Notes                       |
| ------------------ | ----------- | --------------------------- |
| `report_id`        | UUID PK     | Default `gen_random_uuid()` |
| `reporter_id`      | UUID        | FK → `core.users(user_id)`  |
| `reported_user_id` | UUID        | FK → `core.users(user_id)`  |
| `reason`           | TEXT        | Optional                    |
| `status`           | VARCHAR(20) | Default `'pending'`         |
| `created_at`       | TIMESTAMP   | Default `CURRENT_TIMESTAMP` |

---

### **Performance Indexes (Summary)**

- `core.users`: `university_id`
- `learning.study_groups`: `course_id`, `created_by`, `created_at DESC`, `tags GIN`
- `learning.study_group_members`: `group_id`, `user_id`
- `learning.courses`: `department`
- `analytics.user_activity`: `user_id`
- `analytics.reports`: `reporter_id`, `reported_user_id`
