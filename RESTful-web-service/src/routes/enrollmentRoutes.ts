// src/routes/enrollmentRoutes.ts
import { Router } from "express";
import * as controller from "../controllers/enrollmentController.ts";

const router = Router();

router.get("/", controller.getAllEnrollments);
router.get("/:id", controller.getEnrollmentById);
router.post("/", controller.createEnrollment);
router.put("/:id", controller.updateEnrollment); // usually for updating grade
router.delete("/:id", controller.deleteEnrollment);

export default router;
