const { v4: uuidv4 } = require("uuid");
const Application = require("../models/application");

// University submits application
exports.applyInternship = async (req, res) => {
  try {
    const application = await Application.createApplication({
      id: uuidv4(),
      ...req.body,
      university_id: req.user.id
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// University views applications
exports.getUniversityApplications = async (req, res) => {
  const data = await Application.getApplicationsByUniversity(req.user.id);
  res.json(data);
};

// Company views applications
exports.getCompanyApplications = async (req, res) => {
  const data = await Application.getApplicationsByCompany(req.user.id);
  res.json(data);
};

// Company accepts or rejects
exports.reviewApplication = async (req, res) => {
  const { status } = req.body;

  if (!["ACCEPTED", "REJECTED"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  await Application.updateStatus(req.params.id, status);
  res.json({ message: `Application ${status}` });
};
