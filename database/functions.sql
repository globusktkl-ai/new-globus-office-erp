-- ============================================================
-- NEW GLOBUS OFFICE ERP v3.0
-- Database Functions
-- ============================================================

-- Auto Student Code (NG260001)

CREATE OR REPLACE FUNCTION generate_student_code()
RETURNS TEXT AS $$
DECLARE
next_num INTEGER;
year_part TEXT;
BEGIN
year_part := to_char(current_date, 'YY');

```
SELECT COALESCE(MAX(CAST(RIGHT(student_code,4) AS INTEGER)),0)+1
INTO next_num
FROM students
WHERE student_code LIKE 'NG' || year_part || '%';

RETURN 'NG' || year_part || LPAD(next_num::TEXT,4,'0');
```

END;
$$ LANGUAGE plpgsql;

-- Updated At Trigger Function

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto Student Code Trigger

CREATE OR REPLACE FUNCTION set_student_code()
RETURNS TRIGGER AS $$
BEGIN
IF NEW.student_code IS NULL OR NEW.student_code = '' THEN
NEW.student_code := generate_student_code();
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_student_code
BEFORE INSERT ON students
FOR EACH ROW
EXECUTE FUNCTION set_student_code();

-- Updated At Triggers

CREATE TRIGGER trg_students_updated
BEFORE UPDATE ON students
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_courses_updated
BEFORE UPDATE ON courses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_batches_updated
BEFORE UPDATE ON batches
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_users_updated
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_institute_settings_updated
BEFORE UPDATE ON institute_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
