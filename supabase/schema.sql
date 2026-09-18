-- ==============================================================================
-- Washington School - IB CAS Digital Portfolio Portal
-- Supabase PostgreSQL Schema & Row Level Security (RLS)
-- ==============================================================================

-- 1. Create Custom ENUM Types
CREATE TYPE user_role AS ENUM ('student', 'coordinator');
CREATE TYPE experience_status AS ENUM ('pending', 'approved', 'completed', 'rejected');

-- 2. Create profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create cas_experiences Table
CREATE TABLE cas_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  strands TEXT[] NOT NULL DEFAULT '{}',
  status experience_status NOT NULL DEFAULT 'pending',
  learning_outcomes TEXT[] NOT NULL DEFAULT '{}',
  supervisor_name TEXT,
  supervisor_email TEXT,
  supervisor_token UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create reflections Table
CREATE TABLE reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID NOT NULL REFERENCES cas_experiences(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  evidence_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS) on all three tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cas_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is coordinator
CREATE OR REPLACE FUNCTION is_coordinator()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'coordinator'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 6. Row Level Security Policies

-- -----------------------------------------------------------------------------
-- Profiles Policies
-- -----------------------------------------------------------------------------
-- Anyone authenticated can read profiles
CREATE POLICY "Anyone authenticated can read profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can only update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- CAS Experiences Policies
-- -----------------------------------------------------------------------------
-- Students can view their own experiences; Coordinators can view all experiences
CREATE POLICY "Students can view own experiences, coordinators view all"
  ON cas_experiences
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = student_id OR is_coordinator()
  );

-- Students can insert their own experiences
CREATE POLICY "Students can insert own experiences"
  ON cas_experiences
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = student_id
  );

-- Students can update their own experiences; Coordinators can update all experiences
CREATE POLICY "Students can update own experiences, coordinators update all"
  ON cas_experiences
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = student_id OR is_coordinator()
  )
  WITH CHECK (
    auth.uid() = student_id OR is_coordinator()
  );

-- Students can delete their own experiences
CREATE POLICY "Students can delete own experiences"
  ON cas_experiences
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = student_id
  );

-- -----------------------------------------------------------------------------
-- Reflections Policies
-- -----------------------------------------------------------------------------
-- Students can view reflections for their own experiences; Coordinators can view all reflections
CREATE POLICY "Students can view own reflections, coordinators view all"
  ON reflections
  FOR SELECT
  TO authenticated
  USING (
    is_coordinator() OR
    EXISTS (
      SELECT 1 FROM cas_experiences
      WHERE cas_experiences.id = reflections.experience_id
        AND cas_experiences.student_id = auth.uid()
    )
  );

-- Students can insert reflections for their own experiences
CREATE POLICY "Students can insert reflections for own experiences"
  ON reflections
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cas_experiences
      WHERE cas_experiences.id = reflections.experience_id
        AND cas_experiences.student_id = auth.uid()
    )
  );

-- Students can update reflections for their own experiences
CREATE POLICY "Students can update reflections for own experiences"
  ON reflections
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cas_experiences
      WHERE cas_experiences.id = reflections.experience_id
        AND cas_experiences.student_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cas_experiences
      WHERE cas_experiences.id = reflections.experience_id
        AND cas_experiences.student_id = auth.uid()
    )
  );

-- Students can delete reflections for their own experiences
CREATE POLICY "Students can delete reflections for own experiences"
  ON reflections
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cas_experiences
      WHERE cas_experiences.id = reflections.experience_id
        AND cas_experiences.student_id = auth.uid()
    )
  );
-- Trigger to automatically create a profile record when a new user signs up via auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student User'),
    'student'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- -----------------------------------------------------------------------------
-- Supervisor Magic Link Policies (Allow unauthenticated supervisors with token)
-- -----------------------------------------------------------------------------
-- Allow anyone with a supervisor_token to view the experience
CREATE POLICY "Allow public read by supervisor_token"
  ON cas_experiences
  FOR SELECT
  TO anon, authenticated
  USING (supervisor_token IS NOT NULL);

-- Allow anyone with a supervisor_token to mark experience as completed
CREATE POLICY "Allow public update status by supervisor_token"
  ON cas_experiences
  FOR UPDATE
  TO anon, authenticated
  USING (supervisor_token IS NOT NULL)
  WITH CHECK (supervisor_token IS NOT NULL);

-- Allow public to read profile names for supervisor review
CREATE POLICY "Allow public read profile names"
  ON profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);
