-- ============================================================
-- NEW GLOBUS OFFICE ERP v3.0
-- Seed Data
-- ============================================================

INSERT INTO institute_settings (
institute_name,
tagline,
financial_year
) VALUES (
'New Globus Office ERP',
'Professional Office Management System',
'2026-27'
);

INSERT INTO users (
full_name,
email,
password_hash,
is_active
) VALUES (
'Super Admin',
'[admin@newglobus.com](mailto:admin@newglobus.com)',
'admin123',
true
);

INSERT INTO courses (
course_name,
course_code,
duration_months,
total_fee,
is_active
) VALUES
('Office Administration', 'OA001', 6, 25000, true),
('Computer Accounting', 'CA001', 4, 18000, true),
('Diploma in Logistics', 'DL001', 8, 35000, true);
