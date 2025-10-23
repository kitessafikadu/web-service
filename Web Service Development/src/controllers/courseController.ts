// src/controllers/courseController.ts
import type { Request, Response } from "express";
import prisma from "../prisma/client.ts";

export const getAllCourses = async (req: Request, res: Response) => {
  const courses = await prisma.course.findMany({ include: { teacher: true, enrollments: true } });
  res.json(courses);
};

export const getCourseById = async (req: Request, res: Response) => {
  const course = await prisma.course.findUnique({
    where: { id: Number(req.params.id) },
    include: { teacher: true, enrollments: true },
  });
  res.json(course);
};

export const createCourse = async (req: Request, res: Response) => {
  const { name, code, teacherId } = req.body;
  const course = await prisma.course.create({ data: { name, code, teacherId: Number(teacherId) } });
  res.json(course);
};

export const updateCourse = async (req: Request, res: Response) => {
  const { name, code, teacherId } = req.body;
  const course = await prisma.course.update({
    where: { id: Number(req.params.id) },
    data: { name, code, teacherId: Number(teacherId) },
  });
  res.json(course);
};

export const deleteCourse = async (req: Request, res: Response) => {
  await prisma.course.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "Course deleted" });
};
