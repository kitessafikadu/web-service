import type { Request, Response } from "express";
import prisma from "../prisma/client.ts";

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     description: Retrieve a list of all students with their enrollments
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of students retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, sortBy = "firstName", order = "asc" } = req.query;

    
    const filters: any = {};
    if (firstName) {
      filters.firstName = { contains: String(firstName), mode: "insensitive" };
    }
    if (lastName) {
      filters.lastName = { contains: String(lastName), mode: "insensitive" };
    }

    // Fetch students 
    const students = await prisma.student.findMany({
      where: filters,
      include: { enrollments: true },
      orderBy: { [String(sortBy)]: order === "desc" ? "desc" : "asc" },
    });

    res.json({
      message: "✅ Students fetched successfully",
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};
/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Get student by ID
 *     description: Retrieve a specific student by their ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Invalid student ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new student
 *     description: Add a new student to the system
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - dob
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Student's first name
 *               lastName:
 *                 type: string
 *                 description: Student's last name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Student's email address
 *               dob:
 *                 type: string
 *                 format: date
 *                 description: Student's date of birth
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Update a student
 *     description: Update an existing student's information
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Student's first name
 *               lastName:
 *                 type: string
 *                 description: Student's last name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Student's email address
 *               dob:
 *                 type: string
 *                 format: date
 *                 description: Student's date of birth
 *     responses:
 *       200:
 *         description: Student updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Invalid input data or student ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
    if (error.code === "P2025") {
      res.status(404).json({ error: "Student not found" });
    } else {
      res.status(500).json({ error: "Failed to update student" });
    }
  }
};

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Delete a student
 *     description: Remove a student from the system
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student deleted successfully"
 *       400:
 *         description: Invalid student ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
