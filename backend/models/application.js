const db = require("../config/dbConnection");

// ==========================
// Create application in universityapplications table
// ==========================
exports.createApplication = async (data) => {
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


exports.getApplicationsByUniversity = async (universityId, options = {}) => {
  try {
    const { limit = 10, offset = 0, status = null } = options;

    // Get ALL applications, not filtered by university_id
    let query = `
      SELECT *
      FROM universityapplications
    `;

    const params = [];
    let paramIndex = 1;

    // Add WHERE clause only if status filter is provided
    if (status) {
      query += ` WHERE status = $${paramIndex}`;
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
    // Count ALL applications, not filtered by university_id
    let query = `SELECT COUNT(*) as total FROM universityapplications`;
    const params = [];

    if (status) {
      query += ` WHERE status = $1`;
      params.push(status);
    }

    const result = await db.query(query, params);
    return parseInt(result.rows[0].total);
  } catch (error) {
    console.error("Error in getApplicationsCountByUniversity:", error);
    throw error;
  }
};


exports.getApplicationsByCompany = async (companyId, options = {}) => {
  try {
    const { limit = 10, offset = 0, status = null } = options;

    // Get ALL applications, not filtered by company_id
    let query = `
      SELECT *
      FROM companyapplications
    `;

    const params = [];
    let paramIndex = 1;

    // Add WHERE clause only if status filter is provided
    if (status) {
      query += ` WHERE status = $${paramIndex}`;
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


exports.getApplicationsCountByCompany = async (companyId, status = null) => {
  try {
    // Count ALL applications, not filtered by company_id
    let query = `SELECT COUNT(*) as total FROM companyapplications`;
    const params = [];

    if (status) {
      query += ` WHERE status = $1`;
      params.push(status);
    }

    const result = await db.query(query, params);
    return parseInt(result.rows[0].total);
  } catch (error) {
    console.error("Error in getApplicationsCountByCompany:", error);
    throw error;
  }
};

exports.getApplicationById = async (applicationId) => {
  try {
    // Try to find by id first
    let result = await db.query(
      `SELECT * FROM universityapplications WHERE id = $1`,
      [applicationId]
    );
    
    // If not found, try by application_id
    if (result.rows.length === 0) {
      result = await db.query(
        `SELECT * FROM universityapplications WHERE application_id = $1`,
        [applicationId]
      );
    }
    
    return result.rows[0];
  } catch (error) {
    console.error("Error in getApplicationById:", error);
    throw error;
  }
};


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

exports.getCompanyStats = async (companyId) => {
  try {
    const result = await db.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'under_review') as under_review,
        COUNT(*) FILTER (WHERE status = 'shortlisted') as shortlisted,
        COUNT(*) FILTER (WHERE status = 'accepted') as accepted,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected
       FROM companyapplications`,
      []
    );
    
    const stats = result.rows[0];
    return {
      total: parseInt(stats.total) || 0,
      pending: parseInt(stats.pending) || 0,
      under_review: parseInt(stats.under_review) || 0,
      shortlisted: parseInt(stats.shortlisted) || 0,
      accepted: parseInt(stats.accepted) || 0,
      rejected: parseInt(stats.rejected) || 0
    };
  } catch (error) {
    console.error("Error in getCompanyStats:", error);
    throw error;
  }
};
