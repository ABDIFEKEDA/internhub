const db = require("../config/dbConnection");

// ==========================
// Create MAIN application
// ==========================
exports.createApplication = async (data) => {
  const {
    id,
    university_id,
    company_id,
    first_name,
    last_name,
    department,
    academic_year,
    email,
    github_link,
    linkedin_link,
    cv_url,
    resume_url,
    status
  } = data;

  await db.query(
    `INSERT INTO universityapplications (
      id,
      university_id,
      first_name,
      last_name,
      department,
      academic_year,
      email,
      github_link,
      linkedin_link,
      cv_url,
      resume_url,
      status
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
    )`,
    [
      id,
      university_id,
      first_name,
      last_name,
      department,
      academic_year,
      email,
      github_link,
      linkedin_link,
      cv_url,
      resume_url,
      status
    ]
  );
};

// ==========================
// Create UNIVERSITY application
// ==========================
exports.createUniversityApplication = async (data) => {
  const {
    id,
    application_id,
    university_id,
    first_name,
    last_name,
    department,
    academic_year,
    email,
    github_link,
    linkedin_link,
    cv_url,
    resume_url,
    status
  } = data;

  await db.query(
    `INSERT INTO universityapplications (
      id,
      application_id,
      university_id,
      first_name,
      last_name,
      department,
      academic_year,
      email,
      github_link,
      linkedin_link,
      cv_url,
      resume_url,
      status
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
    )`,
    [
      id,
      application_id,
      university_id,
      first_name,
      last_name,
      department,
      academic_year,
      email,
      github_link,
      linkedin_link,
      cv_url,
      resume_url,
      status
    ]
  );
};

// ==========================
// Create COMPANY application 🔥
// ==========================
exports.createCompanyApplication = async (data) => {
  const {
    id,
    application_id,
    university_id,
    first_name,
    last_name,
    department,
    academic_year,
    email,
    github_link,
    linkedin_link,
    cv_url,
    resume_url,
    status
  } = data;

  await db.query(
    `INSERT INTO companyapplications (
      id,
      application_id,
      university_id,
      first_name,
      last_name,
      department,
      academic_year,
      email,
      github_link,
      linkedin_link,
      cv_url,
      resume_url,
      status
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
    )`,
    [
      id,
      application_id,
      university_id,
      first_name,
      last_name,
      department,
      academic_year,
      email,
      github_link,
      linkedin_link,
      cv_url,
      resume_url,
      status
    ]
  );
};

// ==========================
// University views applications
// ==========================
exports.getApplicationsByUniversity = async (universityId) => {
  const result = await db.query(
    `SELECT * FROM universityapplications
     WHERE university_id = $1
     ORDER BY created_at DESC`,
    [universityId]
  );
  return result.rows;
};

// ==========================
// Company views applications
// ==========================
exports.getApplicationsByCompany = async (companyId) => {
  const result = await db.query(
    `SELECT * FROM companyapplications
     WHERE company_id = $1
     ORDER BY created_at DESC`,
    [companyId]
  );
  return result.rows;
};

// ==========================
// Update application status (SYNC ALL TABLES)
// ==========================
exports.updateStatus = async (applicationId, status) => {
  await db.query(
    `UPDATE applications
     SET status = $1
     WHERE id = $2`,
    [status, applicationId]
  );

  await db.query(
    `UPDATE universityapplications
     SET status = $1
     WHERE application_id = $2`,
    [status, applicationId]
  );

  await db.query(
    `UPDATE companyapplications
     SET status = $1
     WHERE application_id = $2`,
    [status, applicationId]
  );
};
