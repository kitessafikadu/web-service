import type { Request, Response } from "express";
import prisma from "../prisma/client.ts";

// 🧾 Get all enrollments
export const getAllEnrollments = async (req: Request, res: Response) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: { student: true, course: true },
    });
    res.json({
      message: "✅ All enrollments fetched successfully",
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch enrollments" });
  }
};

// 🔍 Get enrollment by ID
export const getEnrollmentById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ error: "Invalid enrollment ID" });

    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      include: { student: true, course: true },
    });

    if (!enrollment)
      return res.status(404).json({ error: "Enrollment not found" });

    res.json({
      message: "✅ Enrollment fetched successfully",
      data: enrollment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch enrollment" });
  }
};

// ✏️ Create new enrollment
export const createEnrollment = async (req: Request, res: Response) => {
  try {
    const { studentId, courseId, grade } = req.body;

    if (!studentId || !courseId) {
      return res
        .status(400)
        .json({ error: "studentId and courseId are required" });
    }

    const studentIdNum = Number(studentId);
    const courseIdNum = Number(courseId);
    const gradeNum = grade ;

    if (
      isNaN(studentIdNum) ||
      isNaN(courseIdNum) ||
      (grade !== undefined && isNaN(gradeNum))
    ) {
      return res.status(400).json({
        error: "Invalid numeric values for studentId, courseId, or grade",
      });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: studentIdNum,
        courseId: courseIdNum,
        grade: gradeNum,
      },
    });

    res.status(201).json({
      message: "✅ Enrollment created successfully",
      data: enrollment,
    });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      res.status(409).json({
        error: "Enrollment already exists for this student and course",
      });
    } else {
      res.status(500).json({ error: "Failed to create enrollment" });
    }
  }
};

// 🔄 Update enrollment (grade)
export const updateEnrollment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ error: "Invalid enrollment ID" });

    const { grade } = req.body;
    if (grade === undefined)
      return res.status(400).json({ error: "Grade is required for update" });

    const gradeNum = Number(grade);
    if (isNaN(gradeNum))
      return res.status(400).json({ error: "Invalid grade value" });

    const enrollment = await prisma.enrollment.update({
      where: { id },
      data: { grade: gradeNum },
    });

    res.json({
      message: "✅ Enrollment updated successfully",
      data: enrollment,
    });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      res.status(404).json({ error: "Enrollment not found" });
    } else {
      res.status(500).json({ error: "Failed to update enrollment" });
    }
  }
};

// 🗑️ Delete enrollment
export const deleteEnrollment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ error: "Invalid enrollment ID" });

    await prisma.enrollment.delete({ where: { id } });
    res.json({ message: "✅ Enrollment deleted successfully" });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Enrollment not found" });
    } else {
      res.status(500).json({ error: "Failed to delete enrollment" });
    }
  }
};
