-- ============================================================
-- NEW GLOBUS OFFICE ERP v3.0
-- SEED DATA (Sample Data for Testing)
-- ============================================================

-- ============================================================
-- 1. INSTITUTE SETTINGS
-- ============================================================
INSERT INTO institute_settings (institute_name, tagline, financial_year)
VALUES ('New Globus Office ERP', 'Professional Office Management System', '2026-27')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 2. COURSES (3 Courses)
-- ============================================================
INSERT INTO courses (course_name, course_code, duration_months, total_fee)
VALUES 
    ('Office Administration', 'OA001', 6, 25000),
    ('Computer Accounting', 'CA001', 4, 18000),
    ('Diploma in Logistics', 'DL001', 8, 35000)
ON CONFLICT (course_code) DO NOTHING;

-- ============================================================
-- 3. BATCHES (2 Batches per Course = Total 6 Batches)
-- ============================================================
INSERT INTO batches (batch_name, batch_code, course_id, start_date, end_date)
SELECT 
    'Batch A - ' || c.course_name,
    c.course_code || '-A',
    c.id,
    '2026-08-01'::DATE,
    '2026-12-31'::DATE
FROM courses c
WHERE NOT EXISTS (SELECT 1 FROM batches WHERE batch_code = c.course_code || '-A')
UNION ALL
SELECT 
    'Batch B - ' || c.course_name,
    c.course_code || '-B',
    c.id,
    '2026-09-01'::DATE,
    '2027-01-31'::DATE
FROM courses c
WHERE NOT EXISTS (SELECT 1 FROM batches WHERE batch_code = c.course_code || '-B');

-- ============================================================
-- 4. STUDENTS (2 Test Students)
--    student_code auto-generate ചെയ്യപ്പെടും (Trigger വഴി)
-- ============================================================
INSERT INTO students (
    full_name, email, phone, date_of_birth, gender,
    course_id, batch_id, guardian_name, guardian_phone
)
SELECT 
    'Test Student 1',
    'student1@example.com',
    '9876543210',
    '2000-01-01'::DATE,
    'Male',
    (SELECT id FROM courses WHERE course_code = 'OA001' LIMIT 1),
    (SELECT id FROM batches WHERE batch_code = 'OA001-A' LIMIT 1),
    'Guardian 1',
    '9876543211'
WHERE NOT EXISTS (SELECT 1 FROM students WHERE email = 'student1@example.com')
UNION ALL
SELECT 
    'Test Student 2',
    'student2@example.com',
    '9876543212',
    '2001-05-15'::DATE,
    'Female',
    (SELECT id FROM courses WHERE course_code = 'CA001' LIMIT 1),
    (SELECT id FROM batches WHERE batch_code = 'CA001-A' LIMIT 1),
    'Guardian 2',
    '9876543213'
WHERE NOT EXISTS (SELECT 1 FROM students WHERE email = 'student2@example.com');

-- ============================================================
-- 5. USERS (Super Admin - Auth-ൽ ഇതിനകം ഉണ്ടെങ്കിൽ മാത്രം)
--    ശ്രദ്ധ: admin@newglobus.com എന്ന ഇമെയിൽ Auth.users-ൽ ഉണ്ടായിരിക്കണം.
-- ============================================================
INSERT INTO users (id, full_name, email, role, is_active)
SELECT 
    au.id,
    'Super Admin',
    'admin@newglobus.com',
    'super_admin',
    true
FROM auth.users au
WHERE au.email = 'admin@newglobus.com'
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- VERIFICATION: എത്ര Data വന്നു എന്ന് നോക്കാൻ (Optional)
-- ============================================================
-- SELECT 'Institute Settings' AS Table_Name, COUNT(*) AS Rows FROM institute_settings
-- UNION ALL
-- SELECT 'Courses', COUNT(*) FROM courses
-- UNION ALL
-- SELECT 'Batches', COUNT(*) FROM batches
-- UNION ALL
-- SELECT 'Students', COUNT(*) FROM students
-- UNION ALL
-- SELECT 'Users', COUNT(*) FROM users;
