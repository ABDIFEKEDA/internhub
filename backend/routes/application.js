const express = require("express");
// ❌ REMOVE multer - DELETE THESE LINES:
// const multer = require("multer");
// const path = require("path");

const ApplicationRouter = express.Router();
const controller = require("../controller/application");
const { protect, restrictTo } = require("../middleware/authmidlleware");

// ❌ REMOVE ALL MULTER CONFIGURATION:
// const storage = multer.diskStorage({...});
// const upload = multer({...});

// ==========================
// Routes - NO MULTER MIDDLEWARE
// ==========================

// ✅ Just use protect and restrictTo - NO upload.single()
ApplicationRouter.post(
  "/",
  protect,
  restrictTo("university"),
  controller.applyInternship   // 👈 NO multer middleware
);

ApplicationRouter.get(
  "/university",
  protect,
  restrictTo("university"),
  controller.getUniversityApplications
);

ApplicationRouter.get(
  "/company",
  protect,
  restrictTo("company"),
  controller.getCompanyApplications
);

ApplicationRouter.patch(
  "/:id/status",
  protect,
  restrictTo("company"),
  controller.reviewApplication
);

// ✅ Add this for file downloads
ApplicationRouter.get(
  "/download/:filename",
  protect,
  controller.downloadFile
);

module.exports = ApplicationRouter;