import type { Request, Response } from "express";
import prisma from "../prisma/client.ts";

// ✅ Get all students
export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany({
      include: { enrollments: true },
    });
    res.json({
      message: "✅ All students fetched successfully",
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

// 🔍 Get student by ID
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid student ID" });

    const student = await prisma.student.findUnique({
      where: { id },
      include: { enrollments: true },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({
      message: "✅ Student fetched successfully",
      data: student,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch student" });
  }
};

// ✏️ Create new student
export const createStudent = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, dob } = req.body;

    if (!firstName || !lastName || !email || !dob) {
      return res
        .status(400)
        .json({ error: "firstName, lastName, email, and dob are required" });
    }

    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) {
      return res.status(400).json({ error: "Invalid date of birth" });
    }

    const student = await prisma.student.create({
      data: { firstName, lastName, email, dob: dobDate },
    });

    res.status(201).json({
      message: "✅ Student created successfully",
      data: student,
    });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      res.status(409).json({ error: " Email already exists" });
    } else {
      res.status(500).json({ error: "Failed to create student" });
    }
  }
};

// 🔄 Update student
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid student ID" });

    const { firstName, lastName, email, dob } = req.body;
    if (!firstName && !lastName && !email && !dob) {
      return res
        .status(400)
        .json({
          error: "At least one field (firstName, lastName, email, dob) is required",
        });
    }

    const data: any = {};
    if (firstName) data.firstName = firstName;
    if (lastName) data.lastName = lastName;
    if (email) data.email = email;
    if (dob) {
      const dobDate = new Date(dob);
      if (isNaN(dobDate.getTime()))
        return res.status(400).json({ error: "Invalid date of birth" });
      data.dob = dobDate;
    }

    const student = await prisma.student.update({
      where: { id },
      data,
    });

    res.json({
      message: "✅ Student updated successfully",
      data: student,
    });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      res.status(404).json({ error: "Student not found" });
    }  else {
      res.status(500).json({ error: "Failed to update student" });
    }
  }
};

// 🗑️ Delete student
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid student ID" });

    await prisma.student.delete({ where: { id } });
    res.json({ message: "✅ Student deleted successfully" });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Student not found" });
    } else {
      res.status(500).json({ error: "Failed to delete student" });
    }
  }
};
