import express from "express";
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import studentRoutes from "./routes/studentRoutes.ts";
import teacherRoutes from "./routes/teacherRoutes.ts";
import courseRoutes from "./routes/courseRoutes.ts";
import enrollmentRoutes from "./routes/enrollmentRoutes.ts";
import { setupSwagger } from "./config/swagger.ts";
dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3002;
const HOST: string = process.env.HOST || "localhost";

// Setup Swagger documentation
setupSwagger(app);

app.use("/students", studentRoutes);
app.use("/teachers", teacherRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript Node.js server with .env!");
});

// Health check endpoint
app.get("/health", async (req: Request, res: Response) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: "connected",
      version: "1.0.0"
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: "Database connection failed"
    });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});

