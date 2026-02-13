const { v4: uuidv4 } = require("uuid");
const Application = require("../models/application");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ==========================
// University submits internship application
// ==========================
exports.applyInternship = async (req, res) => {
  try {
    // Check authentication
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const universityId = req.user.id;
    
    const {
      first_name,
      last_name,
      department,
      academic_year,
      email,
      github_link,
      linkedin_link,
      company_id
    } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email || !company_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!department || !academic_year) {
      return res.status(400).json({ message: "Department and academic year are required" });
    }

    if (!github_link || !linkedin_link) {
      return res.status(400).json({ message: "GitHub and LinkedIn links are required" });
    }

    // Handle file uploads
    let cvUrl = null;
    let resumeUrl = null;

    // Process CV file
    if (req.files && req.files.cv) {
      const cvFile = req.files.cv;
      const cvExtension = path.extname(cvFile.name);
      const cvFileName = `cv_${uuidv4()}${cvExtension}`;
      const cvPath = path.join(uploadDir, cvFileName);
      
      if (cvFile.mimetype !== 'application/pdf') {
        return res.status(400).json({ message: "CV must be a PDF file" });
      }
      
      if (cvFile.size > 2 * 1024 * 1024) {
        return res.status(400).json({ message: "CV must be less than 2MB" });
      }
      
      await cvFile.mv(cvPath);
      cvUrl = `/uploads/${cvFileName}`;
    } else {
      return res.status(400).json({ message: "CV file is required" });
    }

    // Process Resume file
    if (req.files && req.files.resume) {
      const resumeFile = req.files.resume;
      const resumeExtension = path.extname(resumeFile.name);
      const resumeFileName = `resume_${uuidv4()}${resumeExtension}`;
      const resumePath = path.join(uploadDir, resumeFileName);
      
      if (resumeFile.mimetype !== 'application/pdf') {
        return res.status(400).json({ message: "Resume must be a PDF file" });
      }
      
      if (resumeFile.size > 2 * 1024 * 1024) {
        return res.status(400).json({ message: "Resume must be less than 2MB" });
      }
      
      await resumeFile.mv(resumePath);
      resumeUrl = `/uploads/${resumeFileName}`;
    } else {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const applicationId = uuidv4();
    const timestamp = new Date().toISOString();

    // ✅ Insert into universityapplications
    const universityAppId = uuidv4();
    await Application.createUniversityApplication({
      id: universityAppId,
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
      cv_url: cvUrl,
      resume_url: resumeUrl,
      status: "PENDING",
      created_at: timestamp
    });

    // ✅ Try to insert into companyapplications (don't fail if it doesn't work)
    try {
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
        cv_url: cvUrl,
        resume_url: resumeUrl,
        status: "PENDING",
        created_at: timestamp
      });
      console.log("Company application created successfully");
    } catch (companyErr) {
      console.error("⚠️ Company application insert failed (non-critical):", companyErr.message);
    }

    res.status(201).json({
      message: "Application submitted successfully",
      application_id: applicationId,
      cv_url: cvUrl,
      resume_url: resumeUrl
    });

  } catch (err) {
    console.error(" APPLICATION SUBMISSION ERROR:", err);
    res.status(500).json({ 
      message: "Server error during application submission", 
      error: err.message 
    });
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

    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const applications = await Application.getApplicationsByUniversity(
      req.user.id,
      { limit, offset, status }
    );
    
    const total = await Application.getApplicationsCountByUniversity(req.user.id, status);

    res.json({
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("UNIVERSITY APPLICATIONS ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.getCompanyApplications = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const applications = await Application.getApplicationsByCompany(
      req.user.id,
      { limit, offset, status }
    );
    
    const total = await Application.getApplicationsCountByCompany(req.user.id, status);

    res.json({
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("COMPANY APPLICATIONS ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.reviewApplication = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { status, feedback } = req.body;
    const applicationId = req.params.id;

    if (!status || !["ACCEPTED", "REJECTED", "UNDER_REVIEW"].includes(status.toUpperCase())) {
      return res.status(400).json({ message: "Invalid status. Must be ACCEPTED, REJECTED, or UNDER_REVIEW" });
    }

    // ✅ FIX: Use getApplicationById instead of getUniversityApplicationById
    const application = await Application.getApplicationById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // // Verify that this company has permission to review this application
    // if (application.company_id !== req.user.id) {
    //   return res.status(403).json({ message: "You don't have permission to review this application" });
    // }

    // Update status in BOTH tables
    await Application.updateStatus(
      applicationId, 
      status.toUpperCase(),
      feedback,
      req.user.id
    );

    res.json({ 
      message: `Application ${status.toUpperCase()}`,
      application_id: applicationId,
      status: status.toUpperCase(),
      updated_at: new Date().toISOString()
    });

  } catch (err) {
    console.error("REVIEW APPLICATION ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==========================
// Get single application by ID
// ==========================
exports.getApplicationById = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const applicationId = req.params.id;
    
    // ✅ FIX: Use getApplicationById from model
    const application = await Application.getApplicationById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if user has permission to view this application
    if (application.university_id !== req.user.id && application.company_id !== req.user.id) {
      return res.status(403).json({ message: "You don't have permission to view this application" });
    }

    res.json(application);

  } catch (err) {
    console.error("GET APPLICATION ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==========================
// Download CV/Resume file
// ==========================
exports.downloadFile = async (req, res) => {
  try {
    const fileName = req.params.filename;
    const filePath = path.join(uploadDir, fileName);

    const normalizedPath = path.normalize(filePath);
    if (!normalizedPath.startsWith(uploadDir)) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    res.download(filePath);

  } catch (err) {
    console.error("FILE DOWNLOAD ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};