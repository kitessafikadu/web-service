// src/controllers/teacherController.ts

import type { Request, Response } from "express";

import prisma from "../prisma/client.ts";

export const getAllTeachers = async (req: Request, res: Response) => {
  const teachers = await prisma.teacher.findMany({ include: { courses: true } });
  res.json(teachers);
};

export const getTeacherById = async (req: Request, res: Response) => {
  const teacher = await prisma.teacher.findUnique({
    where: { id: Number(req.params.id) },
    include: { courses: true },
  });
  res.json(teacher);
};

export const createTeacher = async (req: Request, res: Response) => {
  const { firstName, lastName, email } = req.body;
  const teacher = await prisma.teacher.create({ data: { firstName, lastName, email } });
  res.json(teacher);
};

export const updateTeacher = async (req: Request, res: Response) => {
  const { firstName, lastName, email } = req.body;
  const teacher = await prisma.teacher.update({
    where: { id: Number(req.params.id) },
    data: { firstName, lastName, email },
  });
  res.json(teacher);
};

export const deleteTeacher = async (req: Request, res: Response) => {
  await prisma.teacher.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "Teacher deleted" });
};
