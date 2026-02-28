import express from "express";
import cors from "cors";
import dotenv from "dotenv";
//import path from "path";

import tasksRoutes from "./routes/tasksRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();
console.log("Loaded .env test:", process.env.EMAIL_USER);

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5002;
//const __dirname = path.resolve();

// middleware

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//   })
// );

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://task-manager-project-lake.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(express.json()); // this middleware will parse JSON bodies: req.body
app.use(rateLimiter);

// our simple custom middleware
// app.use((req, res, next) => {
//   console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
//   next();
// });

app.use("/api/tasks", tasksRoutes);
app.use("/api/auth", authRoutes);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//   });
// }

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});
