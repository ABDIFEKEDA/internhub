const db = require("../config/dbConnection");


const initAllTables = async () => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const res = await client.query(
      "SELECT current_database(), current_user, current_schema()"
    );
    console.log("Connected to:", res.rows[0]);

    await initUsersTable(client);
    await initApplicationsTables(client);

    await client.query("COMMIT");

    console.log(" All tables created successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(" Error creating tables:", err);
    throw err;
  } finally {
    client.release();
  }
};


const initUsersTable = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role VARCHAR(30) NOT NULL,
      first_login BOOLEAN DEFAULT true,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);

 
  await client.query(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `);

  // Trigger
  await client.query(`
    DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
    CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON public.users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `);

  console.log(" Users table ready");
};


const initApplicationsTables = async (client) => {
  console.log("Creating application tables...");

  // University applications table
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.universityapplications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      application_id UUID DEFAULT gen_random_uuid(),
      university_id UUID NOT NULL,
      company_id UUID NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      department VARCHAR(150),
      academic_year VARCHAR(50),
      email VARCHAR(255) NOT NULL,
      github_link TEXT,
      linkedin_link TEXT,
      cv_url TEXT,
      resume_url TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT valid_status_uni CHECK (
        status IN ('pending', 'under_review', 'shortlisted', 'accepted', 'rejected', 'withdrawn')
      )
    )
  `);

  // Company applications table
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.companyapplications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      application_id UUID NOT NULL,
      university_id UUID NOT NULL,
      company_id UUID NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      department VARCHAR(150),
      academic_year VARCHAR(50),
      email VARCHAR(255) NOT NULL,
      github_link TEXT,
      linkedin_link TEXT,
      cv_url TEXT,
      resume_url TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT valid_status_comp CHECK (
        status IN ('pending', 'under_review', 'shortlisted', 'accepted', 'rejected')
      )
    )
  `);

  // Triggers for universityapplications
  await client.query(`
    DROP TRIGGER IF EXISTS update_uni_applications_updated_at ON public.universityapplications;
    CREATE TRIGGER update_uni_applications_updated_at
      BEFORE UPDATE ON public.universityapplications
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `);

  // Triggers for companyapplications
  await client.query(`
    DROP TRIGGER IF EXISTS update_comp_applications_updated_at ON public.companyapplications;
    CREATE TRIGGER update_comp_applications_updated_at
      BEFORE UPDATE ON public.companyapplications
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `);

  // Indexes for universityapplications
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_uni_applications_status 
      ON public.universityapplications(status);
    CREATE INDEX IF NOT EXISTS idx_uni_applications_created_at 
      ON public.universityapplications(created_at);
    CREATE INDEX IF NOT EXISTS idx_uni_applications_university_id 
      ON public.universityapplications(university_id);
  `);

  // Indexes for companyapplications
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_comp_applications_status 
      ON public.companyapplications(status);
    CREATE INDEX IF NOT EXISTS idx_comp_applications_created_at 
      ON public.companyapplications(created_at);
    CREATE INDEX IF NOT EXISTS idx_comp_applications_company_id 
      ON public.companyapplications(company_id);
  `);

  console.log(" Application tables ready");
};


module.exports = { initAllTables };