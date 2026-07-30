-- ============================================================
-- NEW GLOBUS OFFICE ERP v3.0
-- Professional Office ERP Database Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- INSTITUTE SETTINGS
-- ============================================================

CREATE TABLE institute_settings (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

```
institute_name TEXT NOT NULL,
tagline TEXT,
address TEXT,
city TEXT,
district TEXT,
state TEXT,
pincode TEXT,

phone TEXT,
whatsapp TEXT,
email TEXT,
website TEXT,

logo_url TEXT,

primary_color TEXT DEFAULT '#1A3A5C',
secondary_color TEXT DEFAULT '#4A90D9',

currency_symbol TEXT DEFAULT '₹',
financial_year TEXT DEFAULT '2026-27',

created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now()
```

);

-- ============================================================
-- USER ROLES
-- ============================================================

CREATE TABLE roles (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

```
role_name TEXT UNIQUE NOT NULL,
description TEXT,

created_at TIMESTAMPTZ DEFAULT now()
```

);

INSERT INTO roles (role_name, description) VALUES
('super_admin','Full system access'),
('office_admin','Office management'),
('accounts','Fee and accounts'),
('reception','Admissions only');

-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE users (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

```
full_name TEXT NOT NULL,
email TEXT UNIQUE NOT NULL,

password_hash TEXT NOT NULL,

role_id UUID REFERENCES roles(id),

phone TEXT,

is_active BOOLEAN DEFAULT true,

created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now()
```

);

CREATE INDEX idx_users_email ON users(email);

-- ============================================================
-- COURSES
-- ============================================================

CREATE TABLE courses (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

```
course_name TEXT NOT NULL,
course_code TEXT UNIQUE NOT NULL,

duration_months INTEGER DEFAULT 0,

total_fee NUMERIC(12,2) DEFAULT 0,

description TEXT,

is_active BOOLEAN DEFAULT true,

created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now()
```

);

CREATE INDEX idx_courses_name ON courses(course_name);

-- ============================================================
-- BATCHES
-- ============================================================

CREATE TABLE batches (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

```
batch_name TEXT NOT NULL,

course_id UUID REFERENCES courses(id) ON DELETE CASCADE,

start_date DATE,
end_date DATE,

status TEXT DEFAULT 'Active',

created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now()
```

);

CREATE INDEX idx_batches_course ON batches(course_id);

-- ============================================================
-- STUDENTS
-- ============================================================

CREATE TABLE students (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

```
student_code TEXT UNIQUE NOT NULL,

full_name TEXT NOT NULL,

gender TEXT,

date_of_birth DATE,

phone TEXT NOT NULL,
whatsapp TEXT,
email TEXT,

address TEXT,
city TEXT,
district TEXT,
state TEXT,
pincode TEXT,

qualification TEXT,

admission_date DATE DEFAULT CURRENT_DATE,

course_id UUID REFERENCES courses(id),

batch_id UUID REFERENCES batches(id),

total_fee NUMERIC(12,2) DEFAULT 0,
discount NUMERIC(12,2) DEFAULT 0,
paid_amount NUMERIC(12,2) DEFAULT 0,
balance_amount NUMERIC(12,2) DEFAULT 0,

photo_url TEXT,

status TEXT DEFAULT 'Active',

remarks TEXT,

is_deleted BOOLEAN DEFAULT false,

created_by UUID REFERENCES users(id),

created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now()
```

);

CREATE INDEX idx_students_code ON students(student_code);
CREATE INDEX idx_students_name ON students(full_name);
CREATE INDEX idx_students_phone ON students(phone);
CREATE INDEX idx_students_course ON students(course_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_institute_settings
BEFORE UPDATE ON institute_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_courses
BEFORE UPDATE ON courses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_batches
BEFORE UPDATE ON batches
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_students
BEFORE UPDATE ON students
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
