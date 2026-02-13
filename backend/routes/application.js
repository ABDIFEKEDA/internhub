const express = require("express");

const ApplicationRouter = express.Router();
const controller = require("../controller/application");
const { protect, restrictTo } = require("../middleware/authmidlleware");


ApplicationRouter.post(
  "/",
  protect,
  restrictTo("university"),
  controller.applyInternship   
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