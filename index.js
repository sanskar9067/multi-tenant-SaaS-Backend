import express from "express";
import http from "http";
import { Server } from "socket.io"
import dotenv from "dotenv";
import connectDB from "./utils/connectDB.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import companyRouter from "./routes/company.routes.js";
import boardRouter from "./routes/board.routes.js";
import taskRouter from "./routes/task.routes.js";
import Task from "./models/task.model.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

connectDB();

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true
  },
  transports: ['websocket', 'polling']
})

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

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`)

  socket.on("join-board", (boardId) => {
    socket.join(boardId);
    console.log(`User ${socket.id} joined board ${boardId}`);
  });

  socket.on("update-task-status", async ({ taskId, boardId }) => {
    const response = await Task.findById(taskId).populate("assignedTo").populate("boardId");
    if (response.status === "To Do") {
      response.status = "In Progress";
      await response.save();
    }
    else if (response.status === "In Progress") {
      response.status = "Done";
      await response.save();
    }
    console.log(response);
    socket.to(boardId).emit("task-updated", response);
  })

  socket.on("delete-task", async ({ taskId, boardId }) => {
    try {
      const deletedTask = await Task.findOneAndDelete({
        _id: taskId,
        boardId
      });

      if (!deletedTask) return;

      socket.to(boardId).emit("task-deleted", {
        taskId
      });

    } catch (err) {
      console.error(err);
      socket.emit("error", "Failed to delete task");
    }
  });

  socket.on("create-task", async ({ boardId, taskData }) => {
    try {
      const newTask = await Task.create({
        ...taskData,
        boardId
      });

      // populate assigned user
      const populatedTask = await Task.findById(newTask._id)
        .populate("assignedTo", "name email");

      // Emit to everyone in the board
      socket.to(boardId).emit("task-created", populatedTask);

    } catch (err) {
      console.error(err);
      socket.emit("error", "Failed to create task");
    }
  });



  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`)
  })
})

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});