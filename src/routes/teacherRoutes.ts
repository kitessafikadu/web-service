// src/routes/teacherRoutes.ts
import { Router } from "express";
import * as controller from "../controllers/teacherController.ts";

const router = Router();

router.get("/", controller.getAllTeachers);
router.get("/:id", controller.getTeacherById);
router.post("/", controller.createTeacher);
router.put("/:id", controller.updateTeacher);
router.delete("/:id", controller.deleteTeacher);

export default router;
