const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);

router.post("/createTask", taskController.createTask);
router.get("/getTasks", taskController.getTasks);
router.get("/getTaskById/:id", taskController.getTaskById);
router.put("/updateTask/:id", taskController.updateTask);
router.delete("/deleteTask/:id", taskController.deleteTask);

module.exports = router;
