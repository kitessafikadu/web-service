import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST: string = process.env.HOST || "localhost";

app.use(express.json());


app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript Node.js server with .env!");
});

app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
