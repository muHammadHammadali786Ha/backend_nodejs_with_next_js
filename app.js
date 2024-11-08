import express from "express"; // todo improting the express packege
import { configDotenv } from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/auth.route.js";
import Userrouter from "./routes/user.routes.js";
import cors from 'cors'
import jobRouter from "./routes/job.routes.js";


configDotenv()
const app = express();
connectDB();

const options = {
    origin:"http://localhost:3000",
    credentials:true
}

app.use(express.json());
app.use(cors(options));

app.get('/', (req, res) => {
    res.send('<h1>WelCome to the MERN Stack World</h1>')
})


app.use('/api/users',router);
app.use('/api/users',Userrouter);
app.use('/api/jobs/',jobRouter);

const PORT = process.env.PORT || 7002;
app.listen(PORT, (req, res) => {
    console.log("Server is running on the PORT No ", PORT);
})
