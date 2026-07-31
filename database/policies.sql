-- ============================================================
-- NEW GLOBUS OFFICE ERP v3.0
-- Row Level Security Policies
-- ============================================================

ALTER TABLE institute_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY institute_settings_all
ON institute_settings
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY roles_all
ON roles
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY users_all
ON users
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY courses_all
ON courses
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY batches_all
ON batches
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY students_all
ON students
FOR ALL
USING (true)
WITH CHECK (true);
