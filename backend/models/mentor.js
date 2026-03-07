const db = require("../config/dbConnection");

// Get all mentors for a company
const getMentorsByCompany = async (companyId) => {
  const query = `
    SELECT * FROM public.mentors
    WHERE company_id = $1
    ORDER BY created_at DESC
  `;
  const result = await db.query(query, [companyId]);
  return result.rows;
};

// Get mentor by ID
const getMentorById = async (mentorId) => {
  const query = `
    SELECT * FROM public.mentors
    WHERE id = $1
  `;
  const result = await db.query(query, [mentorId]);
  return result.rows[0];
};

// Create new mentor
const createMentor = async (mentorData) => {
  const { company_id, user_id, first_name, last_name, email, department, position, phone, expertise } = mentorData;
  
  const query = `
    INSERT INTO public.mentors (company_id, user_id, first_name, last_name, email, department, position, phone, expertise)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;
  
  const result = await db.query(query, [company_id, user_id, first_name, last_name, email, department, position, phone, expertise]);
  return result.rows[0];
};

// Update mentor
const updateMentor = async (mentorId, mentorData) => {
  const { first_name, last_name, email, department, position, phone, expertise } = mentorData;
  
  const query = `
    UPDATE public.mentors
    SET first_name = $1, last_name = $2, email = $3, department = $4, 
        position = $5, phone = $6, expertise = $7, updated_at = CURRENT_TIMESTAMP
    WHERE id = $8
    RETURNING *
  `;
  
  const result = await db.query(query, [first_name, last_name, email, department, position, phone, expertise, mentorId]);
  return result.rows[0];
};

// Delete mentor
const deleteMentor = async (mentorId) => {
  const query = `DELETE FROM public.mentors WHERE id = $1 RETURNING *`;
  const result = await db.query(query, [mentorId]);
  return result.rows[0];
};

// Assign intern to mentor
const assignIntern = async (assignmentData) => {
  const { mentor_id, application_id, student_name, student_email } = assignmentData;
  
  const query = `
    INSERT INTO public.mentor_assignments (mentor_id, application_id, student_name, student_email)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  
  const result = await db.query(query, [mentor_id, application_id, student_name, student_email]);
  return result.rows[0];
};

// Get assigned interns for a mentor
const getAssignedInterns = async (mentorId) => {
  const query = `
    SELECT * FROM public.mentor_assignments
    WHERE mentor_id = $1
    ORDER BY assigned_date DESC
  `;
  const result = await db.query(query, [mentorId]);
  return result.rows;
};

module.exports = {
  getMentorsByCompany,
  getMentorById,
  createMentor,
  updateMentor,
  deleteMentor,
  assignIntern,
  getAssignedInterns
};
