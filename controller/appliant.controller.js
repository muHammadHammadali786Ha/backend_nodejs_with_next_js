import Applicant from "../model/applicant.model.js"

// Apply for an internship
export const applyForInternship = async (req, res) => {
  const { internShipID, candidateID,employeeID, JobTitle, resume, coverLetter,testScore } = req.body;
  // console.log("Request Body Data = ",req.body);
 
  try {
    const newApplication = await new Applicant({
      internShipID,
      candidateID,
      employeeID,
      JobTitle,
      resume,
      coverLetter,
      testScore,
    });
    


   newApplication.save();
   return res.status(201).json({ message: "Application submitted successfully", application: newApplication });
  } catch (error) {
   return res.status(500).json({ message: "Error applying for internship", error: error.message });
  }
};

// Fetch all applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Applicant.find().sort({ test: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications", error: error.message });
  }
};

// Fetch applications by user ID
export const getApplicationsByUser = async (req, res) => {
  const { userId } = req.params;
 
  try {
    const userApplications = await Applicant.find({ candidateID: userId })
      // .populate("internShipID", "title")
      // .populate("candidateId", "name email");
     
    res.status(200).json({ applications: userApplications });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user applications", error: error.message });
  }
};

// Fetch applications for a specific internship
export const getApplicationsByInternship = async (req, res) => {
  const { internShipID } = req.params;

  try {
    const internshipApplications = await Applicant.find({ internShipID })
      .populate("candidateId", "name email");

    res.status(200).json({ applications: internshipApplications });
  } catch (error) {
    res.status(500).json({ message: "Error fetching internship applications", error: error.message });
  }
};

// Delete an application
export const deleteApplication = async (req, res) => {
  const { applicationId } = req.params;

  try {
    const deletedApplication = await Applicant.findByIdAndDelete(applicationId);

    if (!deletedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting application", error: error.message });
  }
};

export const UpdateApplicationDoc = async (req, res) => {
  const { app_id } = req.params;
  const {status} = req.body;
  
  try {
    const UpdateApplication = await Applicant.findById({_id:app_id});
    
    UpdateApplication.status = status; 

    UpdateApplication.save();

    res.status(200).json({ message: "Application Updated successfully",UpdateApplication });
  } catch (error) {
    res.status(500).json({ message: "Error ing Updating application", error: error.message });
  }
};


export const getApplicantionByEmployeeID = async(req,res) =>{
  const {employeeID} = req.params

  try {
    const internshipApplications = await Applicant.find({employeeID:employeeID })
    res.status(200).json({ applications: internshipApplications });
  } catch (error) {
    res.status(500).json({ message: "Error fetching internship applications", error: error.message });
  }

}

export const getApplicationsByID = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const userApplications = await Applicant.find({ candidateID: req.user.id })
      // .populate("internShipID", "title")
      // .populate("candidateId", "name email");
     
    res.status(200).json({ applications: userApplications });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user applications", error: error.message });
  }
};
