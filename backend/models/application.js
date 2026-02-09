const db = require("../config/dbConnection");

exports.createApplication = async (data) => {
  const result = await db.query(
    `INSERT INTO applications (
      id, first_name, last_name, department,
      academic_year, email, github_link,
      linkedin_link, cv_url, resume_url,
      university_id, company_id, status
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'PENDING'
    )
    RETURNING *`,
    [
      data.id,
      data.first_name,
      data.last_name,
      data.department,
      data.academic_year,
      data.email,
      data.github_link,
      data.linkedin_link,
      data.cv_url,
      data.resume_url,
      data.university_id,
      data.company_id
    ]
  );

  return result.rows[0];
};

exports.getApplicationsByUniversity = async (universityId) => {
  const result = await db.query(
    "SELECT * FROM applications WHERE university_id=$1",
    [universityId]
  );
  return result.rows;
};

exports.getApplicationsByCompany = async (companyId) => {
  const result = await db.query(
    "SELECT * FROM applications WHERE company_id=$1",
    [companyId]
  );
  return result.rows;
};

exports.updateStatus = async (id, status) => {
  await db.query(
    "UPDATE applications SET status=$1 WHERE id=$2",
    [status, id]
  );
};
