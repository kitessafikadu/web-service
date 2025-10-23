import express from "express";
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import studentRoutes from "./routes/studentRoutes.ts";
import teacherRoutes from "./routes/teacherRoutes.ts";
import courseRoutes from "./routes/courseRoutes.ts";
import enrollmentRoutes from "./routes/enrollmentRoutes.ts";
dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST: string = process.env.HOST || "localhost";

app.use("/students", studentRoutes);
app.use("/teachers", teacherRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript Node.js server with .env!");
});

app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});

