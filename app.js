import express from "express";
import { configDotenv } from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/auth.route.js";
import Userrouter from "./routes/user.routes.js";
import cors from "cors";
import jobRouter from "./routes/job.routes.js";
import fileRoutes from "./routes/file.routes.js";
import application from "./routes/applicant.routes.js";
import filerouter from "./routes/importFormat.routes.js";
import savePostRouter from "./routes/savePost.routes.js";
import interviewRoutes from './routes/interview.routes.js';

import path from "path";
import { fileURLToPath } from "url";

// Import HTTP server and Socket.io
import { createServer } from "http";
import { Server } from "socket.io";

configDotenv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Create an HTTP server from Express app
const server = createServer(app);

// Initialize Socket.io with the HTTP server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST" , "DELETE", "PUT" , "PATCH"],
        credentials: true,
    },
});

connectDB();

const options = {
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "DELETE", "PUT","PATCH"],
    credentials: true,
};

// Serve static files from the "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form data
app.use(cors(options));

// API Routes
app.use("/api/users", router);
app.use("/api/v1/users", Userrouter);
app.use("/api/jobs/", jobRouter);
app.use("/api/files/", fileRoutes);
app.use("/api/applicants", application);
app.use("/api/employer/", filerouter);
app.use("/api/post", savePostRouter);
app.use('/api/interviews', interviewRoutes);
console.log("Intervention Routes Loaded");



// Server listens on the specified port
const PORT = process.env.PORT || 7002;
server.listen(PORT, () => {
    console.log("Server is running on PORT No", PORT);
});