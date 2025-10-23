// src/controllers/studentController.ts

import type { Request, Response } from "express";
import prisma from "../prisma/client.ts";

// Get all students
export const getAllStudents = async (req: Request, res: Response) => {
  const students = await prisma.student.findMany({
    include: { enrollments: true },
  });
  res.json(students);
};

// Get student by id
export const getStudentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const student = await prisma.student.findUnique({
    where: { id: Number(id) },
    include: { enrollments: true },
  });
  res.json(student);
};

// Create student
export const createStudent = async (req: Request, res: Response) => {
  const { firstName, lastName, email, dob } = req.body;
  const student = await prisma.student.create({
    data: { firstName, lastName, email, dob: new Date(dob) },
  });
  res.json(student);
};

// Update student
export const updateStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, email, dob } = req.body;
  const student = await prisma.student.update({
    where: { id: Number(id) },
    data: { firstName, lastName, email, dob: new Date(dob) },
  });
  res.json(student);
};

// Delete student
export const deleteStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.student.delete({ where: { id: Number(id) } });
  res.json({ message: "Student deleted" });
};
