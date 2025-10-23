// src/routes/courseRoutes.ts
import { Router } from "express";
import * as controller from "../controllers/courseController.ts";

const router = Router();

router.get("/", controller.getAllCourses);
router.get("/:id", controller.getCourseById);
router.post("/", controller.createCourse);
router.put("/:id", controller.updateCourse);
router.delete("/:id", controller.deleteCourse);

export default router;
