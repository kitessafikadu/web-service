// src/routes/studentRoutes.ts
import { Router } from "express";
import * as controller from "../controllers/studentController.ts";
const router = Router();

router.get("/", controller.getAllStudents);
router.get("/:id", controller.getStudentById);
router.post("/", controller.createStudent);
router.put("/:id", controller.updateStudent);
router.delete("/:id", controller.deleteStudent);

export default router;
