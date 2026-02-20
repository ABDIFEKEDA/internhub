const db = require("../config/dbConnection");

// USERS TABLE
const initUsersTable = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.users (
      id UUID PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role VARCHAR(30) NOT NULL,
      first_login BOOLEAN DEFAULT true,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  console.log("✅ Users table ready");
};

// APPLICATION TABLES
const initApplicationsTables = async (client) => {
  console.log("Creating application tables...");

  await client.query(`
    CREATE TABLE IF NOT EXISTS public.universityapplications (
      id UUID PRIMARY KEY,
      application_id UUID,
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
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS public.companyapplications (
      id UUID PRIMARY KEY,
      application_id UUID,
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
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  console.log("✅ Application tables ready");
};

// RUN ALL TABLES
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

    console.log("🎉 All tables created successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error creating tables:", err);
  } finally {
    client.release();
  }
};

if (require.main === module) {
  initAllTables()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = {
  initUsersTable,
  initApplicationsTables,
  initAllTables,
};