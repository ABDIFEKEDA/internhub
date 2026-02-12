const db = require("../config/dbConnection");

// ==========================
// Create MAIN application (universityapplications table)
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
    status,
    created_at,
    updated_at
  } = data;

  await db.query(
    `INSERT INTO universityapplications (
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
      status,
      created_at,
      updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
    )`,
    [
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
      status,
      created_at,
      updated_at
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
    status,
    created_at
  } = data;

  await db.query(
    `INSERT INTO universityapplications (
      id,
      application_id,
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
      status,
      created_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
    )`,
    [
      id,
      application_id,
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
      status,
      created_at
    ]
  );
};

// ==========================
// Create COMPANY application
// ==========================
exports.createCompanyApplication = async (data) => {
  const {
    id,
    application_id,
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
    status,
    created_at
  } = data;

  await db.query(
    `INSERT INTO companyapplications (
      id,
      application_id,
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
      status,
      created_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
    )`,
    [
      id,
      application_id,
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
      status,
      created_at
    ]
  );
};

// ==========================
// ✅ FIXED: University views applications - NO companies table join
// ==========================
exports.getApplicationsByUniversity = async (universityId, options = {}) => {
  try {
    const { limit = 10, offset = 0, status = null } = options;
    
    let query = `
      SELECT *
      FROM universityapplications
      WHERE university_id = $1
    `;
    
    const params = [universityId];
    let paramIndex = 2;
    
    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), parseInt(offset));
    
    const result = await db.query(query, params);
    return result.rows;
  } catch (error) {
    console.error("Error in getApplicationsByUniversity:", error);
    throw error;
  }
};

// ==========================
// ✅ FIXED: COUNT method for university applications
// ==========================
exports.getApplicationsCountByUniversity = async (universityId, status = null) => {
  try {
    let query = `SELECT COUNT(*) as total FROM universityapplications WHERE university_id = $1`;
    const params = [universityId];
    
    if (status) {
      query += ` AND status = $2`;
      params.push(status);
    }
    
    const result = await db.query(query, params);
    return parseInt(result.rows[0].total);
  } catch (error) {
    console.error("Error in getApplicationsCountByUniversity:", error);
    throw error;
  }
};

// ==========================
// ✅ FIXED: Company views applications - NO universities table join
// ==========================
exports.getApplicationsByCompany = async (companyId, options = {}) => {
  try {
    const { limit = 10, offset = 0, status = null } = options;
    
    let query = `
      SELECT *
      FROM companyapplications
      WHERE company_id = $1
    `;
    
    const params = [companyId];
    let paramIndex = 2;
    
    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), parseInt(offset));
    
    const result = await db.query(query, params);
    return result.rows;
  } catch (error) {
    console.error("Error in getApplicationsByCompany:", error);
    throw error;
  }
};

// ==========================
// ✅ FIXED: COUNT method for company applications
// ==========================
exports.getApplicationsCountByCompany = async (companyId, status = null) => {
  try {
    let query = `SELECT COUNT(*) as total FROM companyapplications WHERE company_id = $1`;
    const params = [companyId];
    
    if (status) {
      query += ` AND status = $2`;
      params.push(status);
    }
    
    const result = await db.query(query, params);
    return parseInt(result.rows[0].total);
  } catch (error) {
    console.error("Error in getApplicationsCountByCompany:", error);
    throw error;
  }
};

// ==========================
// Get single application by ID
// ==========================
exports.getApplicationById = async (applicationId) => {
  try {
    const result = await db.query(
      `SELECT * FROM universityapplications WHERE id = $1`,
      [applicationId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error in getApplicationById:", error);
    throw error;
  }
};

// ==========================
// Update application status (SYNC ALL TABLES)
// ==========================
exports.updateStatus = async (applicationId, status, feedback = null, reviewerId = null) => {
  try {
    // Update universityapplications table
    await db.query(
      `UPDATE universityapplications
       SET status = $1, updated_at = NOW()
       WHERE id = $2`,
      [status, applicationId]
    );

    // Update universityapplications by application_id if different
    await db.query(
      `UPDATE universityapplications
       SET status = $1, updated_at = NOW()
       WHERE application_id = $2`,
      [status, applicationId]
    );

    // Update companyapplications table
    await db.query(
      `UPDATE companyapplications
       SET status = $1, updated_at = NOW()
       WHERE application_id = $2`,
      [status, applicationId]
    );

    return { success: true };
  } catch (error) {
    console.error("Error in updateStatus:", error);
    throw error;
  }
};

// ==========================
// Search applications
// ==========================
exports.searchApplications = async (universityId, searchTerm) => {
  try {
    const result = await db.query(
      `SELECT *
       FROM universityapplications
       WHERE university_id = $1 
       AND (
         first_name ILIKE $2 OR 
         last_name ILIKE $2 OR 
         email ILIKE $2
       )
       ORDER BY created_at DESC`,
      [universityId, `%${searchTerm}%`]
    );
    return result.rows;
  } catch (error) {
    console.error("Error in searchApplications:", error);
    throw error;
  }
};