import type { Request, Response } from "express";
import prisma from "../prisma/client.ts";

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      include: { teacher: true, enrollments: true },
    });
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    const course = await prisma.course.findUnique({
      where: { id },
      include: { teacher: true, enrollments: true },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch course" });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { name, code, teacherId } = req.body;

    if (!name || !code || !teacherId) {
      return res.status(400).json({ error: "Name, code, and teacherId are required" });
    }

    const teacherIdNumber = Number(teacherId);
    if (isNaN(teacherIdNumber)) {
      return res.status(400).json({ error: "Invalid teacherId" });
    }

    const course = await prisma.course.create({
      data: { name, code, teacherId: teacherIdNumber },
    });

    res.status(201).json(course);
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      // Unique constraint failed
      res.status(409).json({ error: "Course code already exists" });
    } else {
      res.status(500).json({ error: "Failed to create course" });
    }
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, code, teacherId } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid course ID" });
    }
    if (!name && !code && !teacherId) {
      return res.status(400).json({ error: "At least one field (name, code, teacherId) is required" });
    }

    const data: any = {};
    if (name) data.name = name;
    if (code) data.code = code;
    if (teacherId) {
      const teacherIdNumber = Number(teacherId);
      if (isNaN(teacherIdNumber)) {
        return res.status(400).json({ error: "Invalid teacherId" });
      }
      data.teacherId = teacherIdNumber;
    }

    const course = await prisma.course.update({
      where: { id },
      data,
    });

    res.json(course);
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2025") {
      // Record not found
      res.status(404).json({ error: "Course not found" });
    } else if (error.code === "P2002") {
      res.status(409).json({ error: "Course code already exists" });
    } else {
      res.status(500).json({ error: "Failed to update course" });
    }
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    await prisma.course.delete({ where: { id } });
    res.json({ message: "Course deleted successfully" });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Course not found" });
    } else {
      res.status(500).json({ error: "Failed to delete course" });
    }
  }
};
