import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/connectDB.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import companyRouter from "./routes/company.routes.js";
import boardRouter from "./routes/board.routes.js";
import taskRouter from "./routes/task.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/board", boardRouter);
app.use("/api/v1/task", taskRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the SaaS Backend!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});