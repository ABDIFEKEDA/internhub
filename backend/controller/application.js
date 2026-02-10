const { v4: uuidv4 } = require("uuid");
const Application = require("../models/application");

// ==========================
// University submits internship application
// ==========================
exports.applyInternship = async (req, res) => {
  try {
    // 1️⃣ Auth check
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const universityId = req.user.id;

    // 2️⃣ Extract body
    const {
      first_name,
      last_name,
      department,
      academic_year,
      email,
      github_link,
      linkedin_link,
      cv_url,
      resume_url,
      company_id
    } = req.body;

    // 3️⃣ Validate required fields
    if (!first_name || !last_name || !email || !company_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 4️⃣ Shared application ID
    const applicationId = uuidv4();

    // 5️⃣ Insert into MAIN applications table
    await Application.createApplication({
      id: applicationId,
      university_id: universityId,
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
      status: "PENDING"
    });

    // 6️⃣ Insert into universityapplications table
    await Application.createUniversityApplication({
      id: uuidv4(),
      application_id: applicationId,
      university_id: universityId,
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
      status: "PENDING"
    });

    // 7️⃣ Insert into companyapplications table (AUTO)
    await Application.createCompanyApplication({
      id: uuidv4(),
      application_id: applicationId,
      university_id: universityId,
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
      status: "PENDING"
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application_id: applicationId
    });
  } catch (err) {
    console.error("APPLICATION ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==========================
// University views own applications
// ==========================
exports.getUniversityApplications = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const data = await Application.getApplicationsByUniversity(req.user.id);
    res.json(data);
  } catch (err) {
    console.error("UNIVERSITY APPLICATIONS ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==========================
// Company views applications
// ==========================
exports.getCompanyApplications = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const data = await Application.getApplicationsByCompany(req.user.id);
    res.json(data);
  } catch (err) {
    console.error("COMPANY APPLICATIONS ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==========================
// Company reviews application
// ==========================
exports.reviewApplication = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status || !["ACCEPTED", "REJECTED"].includes(status.toUpperCase())) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await Application.updateStatus(applicationId, status.toUpperCase());

    res.json({ message: `Application ${status.toUpperCase()}` });
  } catch (err) {
    console.error("REVIEW APPLICATION ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
