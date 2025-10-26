

import type { Request, Response } from "express";
import prisma from "../prisma/client.ts";

//  Get all teachers
export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, sortBy = "firstName", order = "asc" } = req.query;

   
    const filters: any = {};
    if (firstName) {
      filters.firstName = { contains: String(firstName), mode: "insensitive" };
    }
    if (lastName) {
      filters.lastName = { contains: String(lastName), mode: "insensitive" };
    }

   
    const teachers = await prisma.teacher.findMany({
      where: filters,
      include: { courses: true },
      orderBy: { [String(sortBy)]: order === "desc" ? "desc" : "asc" },
    });

    res.json({
      message: " Teachers fetched successfully",
      count: teachers.length,
      data: teachers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
};

//  Get teacher by ID
export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid teacher ID" });

    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: { courses: true },
    });

    if (!teacher)
      return res.status(404).json({ error: "Teacher not found" });

    res.json({
      message: " Teacher fetched successfully",
      data: teacher,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch teacher" });
  }
};

//  Create new teacher
export const createTeacher = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
      return res
        .status(400)
        .json({ error: "firstName, lastName, and email are required" });
    }

    const teacher = await prisma.teacher.create({
      data: { firstName, lastName, email },
    });

    res.status(201).json({
      message: "Teacher created successfully",
      data: teacher,
    });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      res.status(409).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Failed to create teacher" });
    }
  }
};

//  Update teacher
export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid teacher ID" });

    const { firstName, lastName, email } = req.body;
    if (!firstName && !lastName && !email) {
      return res
        .status(400)
        .json({
          error: "At least one field (firstName, lastName, email) is required",
        });
    }

    const data: any = {};
    if (firstName) data.firstName = firstName;
    if (lastName) data.lastName = lastName;
    if (email) data.email = email;

    const teacher = await prisma.teacher.update({
      where: { id },
      data,
    });

    res.json({
      message: "Teacher updated successfully",
      data: teacher,
    });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      res.status(404).json({ error: "Teacher not found" });
    }  else {
      res.status(500).json({ error: "Failed to update teacher" });
    }
  }
};

//  Delete teacher
export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid teacher ID" });

    await prisma.teacher.delete({ where: { id } });

    res.json({ message: "Teacher deleted successfully" });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Teacher not found" });
    } else {
      res.status(500).json({ error: "Failed to delete teacher" });
    }
  }
};
