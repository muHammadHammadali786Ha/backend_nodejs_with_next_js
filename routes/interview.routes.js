import express from 'express';
import {
  scheduleInterview,
  getRecruiterInterviews,
  getApplicantInterviews,
  getInterview,
  updateInterview,
  confirmInterview,
  cancelInterview
} from '../controller/interviewController.js';
import authVerification from '../middleware/authMIddleware.js';

const router = express.Router();

// Interview Routes
router.post('/', authVerification, scheduleInterview);
router.get('/recruiter', authVerification, getRecruiterInterviews);
router.get('/applicant', authVerification, getApplicantInterviews);
router.get('/:id', authVerification, getInterview);
router.put('/:id', authVerification, updateInterview);
router.post('/:id/confirm', authVerification, confirmInterview);
router.delete('/:id', authVerification, cancelInterview);

export default router;