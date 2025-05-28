import express from 'express';
import { creatPost, delJobList, jobList, updateJobList } from '../controller/jobController.js';
import authVerification from '../middleware/authMIddleware.js';


const jobRouter = express.Router();

jobRouter.post('/create',authVerification,creatPost);
jobRouter.get('/view/:id?',authVerification,jobList);
jobRouter.put('/update/:id',authVerification,updateJobList);
jobRouter.delete('/delete/:id',authVerification,delJobList);

export default jobRouter;