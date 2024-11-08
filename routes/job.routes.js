import express from 'express';
import { creatPost } from '../controller/jobController.js';


const jobRouter = express.Router();

jobRouter.post('/create',creatPost)

export default jobRouter;