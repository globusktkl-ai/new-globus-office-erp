-- ============================================================
-- NEW GLOBUS OFFICE ERP v3.0
-- Seed Data
-- ============================================================

-- Institute Settings
INSERT INTO institute_settings (
institute_name,
tagline,
address,
phone,
email,
website,
financial_year
) VALUES (
'New Globus Technical Academy',
'Professional Office ERP',
'',
'',
'',
'',
'2026-27'
);

-- Default Super Admin User
-- Password: admin123 (temporary)
INSERT INTO users (
full_name,
email,
password_hash,
role_id,
is_active
)
SELECT
'Super Admin',
'[admin@newglobus.com](mailto:admin@newglobus.com)',
'admin123',
r.id,
true
FROM roles r
WHERE r.role_name = 'super_admin';

-- Sample Courses
INSERT INTO courses (
course_name,
course_code,
duration_months,
total_fee,
description
) VALUES
(
'Office Administration',
'OA001',
6,
25000,
'Professional office administration course'
),
(
'Computer Accounting',
'CA001',
4,
18000,
'Tally, GST and accounting'
),
(
'Diploma in Logistics',
'DL001',
8,
35000,
'Logistics and supply chain management'
);

-- Sample Batch
INSERT INTO batches (
batch_name,
course_id,
start_date,
status
)
SELECT
'July 2026 Morning',
c.id,
'2026-07-01',
'Active'
FROM courses c
WHERE c.course_code = 'OA001';
