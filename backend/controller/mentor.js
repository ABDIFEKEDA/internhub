const mentorModel = require("../models/mentor");

// Get all mentors for a company
const getMentorsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const mentors = await mentorModel.getMentorsByCompany(companyId);
    
    res.status(200).json({
      success: true,
      mentors
    });
  } catch (error) {
    console.error("Error fetching mentors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch mentors",
      error: error.message
    });
  }
};

// Get mentor by ID
const getMentorById = async (req, res) => {
  try {
    const { id } = req.params;
    const mentor = await mentorModel.getMentorById(id);
    
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found"
      });
    }
    
    res.status(200).json({
      success: true,
      mentor
    });
  } catch (error) {
    console.error("Error fetching mentor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch mentor",
      error: error.message
    });
  }
};

// Create new mentor
const createMentor = async (req, res) => {
  try {
    const mentorData = req.body;
    const mentor = await mentorModel.createMentor(mentorData);
    
    res.status(201).json({
      success: true,
      message: "Mentor created successfully",
      mentor
    });
  } catch (error) {
    console.error("Error creating mentor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create mentor",
      error: error.message
    });
  }
};

// Update mentor
const updateMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const mentorData = req.body;
    const mentor = await mentorModel.updateMentor(id, mentorData);
    
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Mentor updated successfully",
      mentor
    });
  } catch (error) {
    console.error("Error updating mentor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update mentor",
      error: error.message
    });
  }
};

// Delete mentor
const deleteMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const mentor = await mentorModel.deleteMentor(id);
    
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Mentor deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting mentor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete mentor",
      error: error.message
    });
  }
};

// Assign intern to mentor
const assignIntern = async (req, res) => {
  try {
    const assignmentData = req.body;
    const assignment = await mentorModel.assignIntern(assignmentData);
    
    res.status(201).json({
      success: true,
      message: "Intern assigned successfully",
      assignment
    });
  } catch (error) {
    console.error("Error assigning intern:", error);
    res.status(500).json({
      success: false,
      message: "Failed to assign intern",
      error: error.message
    });
  }
};

// Get assigned interns for a mentor
const getAssignedInterns = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const interns = await mentorModel.getAssignedInterns(mentorId);
    
    res.status(200).json({
      success: true,
      interns
    });
  } catch (error) {
    console.error("Error fetching assigned interns:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch assigned interns",
      error: error.message
    });
  }
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
