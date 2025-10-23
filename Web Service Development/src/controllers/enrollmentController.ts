// src/controllers/enrollmentController.ts
import type { Request, Response } from "express";
import prisma from "../prisma/client.ts";

export const getAllEnrollments = async (req: Request, res: Response) => {
  const enrollments = await prisma.enrollment.findMany({ include: { student: true, course: true } });
  res.json(enrollments);
};

export const getEnrollmentById = async (req: Request, res: Response) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: Number(req.params.id) },
    include: { student: true, course: true },
  });
  res.json(enrollment);
};

export const createEnrollment = async (req: Request, res: Response) => {
  const { studentId, courseId, grade } = req.body;
  const enrollment = await prisma.enrollment.create({
    data: {
      studentId: Number(studentId),
      courseId: Number(courseId),
      grade: grade ? Number(grade) : null,
    },
  });
  res.json(enrollment);
};

export const updateEnrollment = async (req: Request, res: Response) => {
  const { grade } = req.body;
  const enrollment = await prisma.enrollment.update({
    where: { id: Number(req.params.id) },
    data: { grade: grade ? Number(grade) : null },
  });
  res.json(enrollment);
};

export const deleteEnrollment = async (req: Request, res: Response) => {
  await prisma.enrollment.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "Enrollment deleted" });
};
