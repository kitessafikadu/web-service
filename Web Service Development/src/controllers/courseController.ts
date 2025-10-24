import type { Request, Response } from "express";
import prisma from "../prisma/client.ts";

// 📚 Get all courses
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const { name, code, sortBy = "name" } = req.query;

   
    const filters: any = {};
    if (name) {
      filters.name = { contains: String(name), mode: "insensitive" };
    }
    if (code) {
      filters.code = { contains: String(code), mode: "insensitive" };
    }

    // Fetch courses 
    const courses = await prisma.course.findMany({
      where: filters,
      include: { teacher: true, enrollments: true },
      orderBy: { [sortBy as string]: "asc" }, 
    });

    res.json({
      message: " All courses fetched successfully",
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

//  Get course by ID
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

    res.json({
      message: "Course fetched successfully",
      data: course,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch course" });
  }
};

//  Create new course
export const createCourse = async (req: Request, res: Response) => {
  try {
    const { name, code, teacherId } = req.body;

    if (!name || !code || !teacherId) {
      return res
        .status(400)
        .json({ error: "Name, code, and teacherId are required" });
    }

    const teacherIdNumber = Number(teacherId);
    if (isNaN(teacherIdNumber)) {
      return res.status(400).json({ error: "Invalid teacherId" });
    }

    const course = await prisma.course.create({
      data: { name, code, teacherId: teacherIdNumber },
    });

    res.status(201).json({
      message: " Course created successfully",
      data: course,
    });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      res.status(409).json({ error: "Course code already exists" });
    } else {
      res.status(500).json({ error: "Failed to create course" });
    }
  }
};

//  Update course
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, code, teacherId } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid course ID" });
    }
    if (!name && !code && !teacherId) {
      return res
        .status(400)
        .json({
          error: "At least one field (name, code, teacherId) is required",
        });
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

    res.json({
      message: "✅ Course updated successfully",
      data: course,
    });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      res.status(404).json({ error: "Course not found" });
    }  else {
      res.status(500).json({ error: "Failed to update course" });
    }
  }
};

//  Delete course
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    await prisma.course.delete({ where: { id } });
    res.json({ message: "✅ Course deleted successfully" });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Course not found" });
    } else {
      res.status(500).json({ error: "Failed to delete course" });
    }
  }
};
