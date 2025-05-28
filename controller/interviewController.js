import Interview from '../model/Interview.js';
import Applicant from '../model/applicant.model.js';

// Business Logic for Interview Scheduling
export const scheduleInterview = async (req, res) => {
        
  try {
    const { 
      applicationId,
      jobId,
      applicantId,
      dateTime,
      duration,
      interviewType,
      meetingLink,
      location,
      notes
    } = req.body;

    // Validate required fields
    if (!applicationId || !jobId || !applicantId || !dateTime || !interviewType) {
          
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check for existing interview
    const existingInterview = await Interview.findOne({ applicationId });
    if (existingInterview) {
      return res.status(400).json({ error: 'Interview already scheduled for this application' });
    }

    const interview = new Interview({
      applicationId,
      jobId,
      applicantId,
      recruiterId: req.user.id,
      dateTime,
      duration: duration || 30,
      interviewType,
      meetingLink: interviewType === 'video' ? meetingLink : undefined,
      location: interviewType === 'in-person' ? location : undefined,
      notes,
      status:'scheduled'
    });
       
    await interview.save();

    // Update application status
    await Applicant.findByIdAndUpdate(applicationId, { 
      status: 'interview-scheduled' 
    });

   return res.status(201).json(interview);
  } catch (err) {
    console.log(err);
    
    return res.status(500).json({ error: err.message });
  }
};

// Business Logic for Getting Recruiter Interviews
export const getRecruiterInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ recruiterId: req.user.id })
      .populate('applicantId', 'name email')
      .populate('jobId', 'title')
      .sort({ dateTime: 1 });

    res.json(interviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Business Logic for Getting Applicant Interviews
export const getApplicantInterviews = async (req, res) => {
  console.log('Getting applicant interviews...');
  
  try {
    const interviews = await Interview.find({ applicantId: req.user.id })
      .populate('recruiterId', 'name email company')
      .populate('jobId', 'title')
      .sort({ dateTime: 1 });

    console.log('Interviews:', interviews);
    return res.json(interviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Business Logic for Getting Single Interview
export const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('applicantId', 'name email')
      .populate('recruiterId', 'name email')
      .populate('jobId', 'title');

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    // Verify ownership
    if (interview.recruiterId._id.toString() !== req.user.id && 
        interview.applicantId._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(interview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Business Logic for Updating Interview
export const updateInterview = async (req, res) => {
  try {
    const { dateTime, duration, interviewType, meetingLink, location, notes } = req.body;
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    // Only recruiter can update
    if (interview.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    interview.dateTime = dateTime || interview.dateTime;
    interview.duration = duration || interview.duration;
    interview.interviewType = interviewType || interview.interviewType;
    interview.meetingLink = meetingLink || interview.meetingLink;
    interview.location = location || interview.location;
    interview.notes = notes || interview.notes;

    await interview.save();
    res.json(interview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Business Logic for Confirming Interview
export const confirmInterview = async (req, res) => {
  console.log('Confirming interview...'); 
  console.log(req.body);
  const { status } = req.body; // Assuming status is passed in the request body
  console.log(req.params.id);
  
  try {
    const interview = await Interview.findById(req.params.id);
    // console.log(interview);
    
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    // Only applicant can confirm
    if (status === "confirmed") {
      if (interview.applicantId.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }  
    }
    

    interview.status = status || interview.status; // Update status based on request body
    await interview.save();
    console.log('interview:', interview);
    
    return res.json({success:true,interview});
    
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Business Logic for Cancelling Interview
export const cancelInterview = async (req, res) => {
  // console.log('Cancelling interview...');
  
  try {
    const interview = await Interview.findById(req.params.id);
    // console.log('interview:', interview);
    
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    // Only recruiter can cancel
    if (interview.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Update application status back to approved
    await Applicant.findByIdAndUpdate(interview.applicationId, {
      status: 'approved'
    });

    // await interview.remove();
    // Use deleteOne() instead of remove()
    await Interview.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Interview cancelled successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};