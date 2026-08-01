-- ============================================================
-- NEW GLOBUS OFFICE ERP v3.0
-- FUNCTIONS & TRIGGERS
-- Auto-generate student_code, Auto-update timestamps
-- ============================================================

-- ============================================================
-- 1. FUNCTION: Generate Student Code (e.g., NG260001)
--    Format: NG + Current Year (YY) + 4-digit Sequence
-- ============================================================
CREATE OR REPLACE FUNCTION generate_student_code()
RETURNS TEXT AS $$
DECLARE
    next_num INTEGER;
    year_part TEXT;
BEGIN
    -- Get last two digits of current year (e.g., 2026 -> '26')
    year_part := to_char(CURRENT_DATE, 'YY');
    
    -- Find the highest sequence number for this year
    SELECT COALESCE(MAX(CAST(RIGHT(student_code, 4) AS INTEGER)), 0) + 1
    INTO next_num
    FROM students
    WHERE student_code LIKE 'NG' || year_part || '%';
    
    -- Return: NG + Year + 4-digit padded number (e.g., NG260001)
    RETURN 'NG' || year_part || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 2. FUNCTION: Update updated_at timestamp on row change
--    Used by all tables
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 3. FUNCTION: Set student_code on INSERT (if empty)
--    Trigger function that calls generate_student_code()
-- ============================================================
CREATE OR REPLACE FUNCTION set_student_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.student_code IS NULL OR NEW.student_code = '' THEN
        NEW.student_code := generate_student_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 4. TRIGGERS
-- ============================================================

-- Trigger for Students: Auto-generate code before INSERT
DROP TRIGGER IF EXISTS trg_student_code ON students;
CREATE TRIGGER trg_student_code
BEFORE INSERT ON students
FOR EACH ROW
EXECUTE FUNCTION set_student_code();

-- Trigger for Students: Update updated_at on UPDATE
DROP TRIGGER IF EXISTS trg_students_updated ON students;
CREATE TRIGGER trg_students_updated
BEFORE UPDATE ON students
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Trigger for Courses: Update updated_at on UPDATE
DROP TRIGGER IF EXISTS trg_courses_updated ON courses;
CREATE TRIGGER trg_courses_updated
BEFORE UPDATE ON courses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Trigger for Batches: Update updated_at on UPDATE
DROP TRIGGER IF EXISTS trg_batches_updated ON batches;
CREATE TRIGGER trg_batches_updated
BEFORE UPDATE ON batches
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Trigger for Users: Update updated_at on UPDATE
DROP TRIGGER IF EXISTS trg_users_updated ON users;
CREATE TRIGGER trg_users_updated
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Trigger for Institute Settings: Update updated_at on UPDATE
DROP TRIGGER IF EXISTS trg_institute_settings_updated ON institute_settings;
CREATE TRIGGER trg_institute_settings_updated
BEFORE UPDATE ON institute_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 5. VERIFICATION QUERY (Copy this separately to test)
--    SELECT proname FROM pg_proc WHERE proname LIKE 'generate%' OR proname LIKE 'update_%' OR proname LIKE 'set_%';
-- ============================================================
