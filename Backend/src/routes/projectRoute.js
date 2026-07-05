const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);

router.post("/createProject", projectController.createProject);
router.get("/getProjects", projectController.getProjects);
router.get("/getProjectById/:id", projectController.getProjectById);
router.put("/updateProject/:id", projectController.updateProject);
router.delete("/deleteProject/:id", projectController.deleteProject);

module.exports = router;
