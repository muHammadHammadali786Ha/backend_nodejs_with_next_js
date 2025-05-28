import express from 'express';
import { creatPost, delJobList, jobList, jobListWithID, listForUpdate, updateJobList } from '../controller/jobController.js';
import authVerification from '../middleware/authMIddleware.js';


const jobRouter = express.Router();

jobRouter.post('/create',authVerification,creatPost);
jobRouter.get('/views/:id?/',jobList);
jobRouter.get('/view/',authVerification,jobListWithID);
jobRouter.get('/get/view/:id',authVerification,listForUpdate);
jobRouter.put('/update/:id',authVerification,updateJobList);
jobRouter.delete('/delete/:id',authVerification,delJobList);

export default jobRouter;