import { application } from "express";
import User from "../model/user.model.js";
import Applicant from "../model/applicant.model.js";
export const user = (req, res) => {
    return res.json({
        message: "Hello Users"
    })
}
export const manager = (req, res) => {
    return res.json({
        message: "Hello Managers"
    })
}
export const admin = (req, res) => {
    return res.json({
        message: "Hello Admin"
    })
}



// Fetch all users except the logged-in user
export const getWhatsappNumber = async (id, role) => {
    console.log("Fetching WhatsApp number for user ID:", id, "with role:", role);
    
    try {
      if (role === "student") {
        const user = await User.findById(id).select("profile.studentData.whatsappNumber");
        return user?.profile?.studentData?.whatsappNumber || null;
      } else if (role === "employee") {
        const user = await User.findById(id).select("profile.employeeData.whatsappNumber");
        return user?.profile?.employeeData?.whatsappNumber || null;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error("Error fetching WhatsApp number: " + err.message);
    }
  };
  


export const updateProfile = async (req, res) => {
    try {
        console.log("UpdateProfile Function Called() ");
        
        const id = req.user.id; // Get user ID from authenticated request

        const userData = await User.findById(id);
        // console.log(userData);
        

        if (userData.role === "student") {
            var { degree, institution, yearOfStudy, GPA, skills , whatsappNumber } = req.body;
        }else{
            var { position, company, yearsOfExperience, industry, skills, certifications, linkedinProfile , whatsappNumber} = req.body;
        }

        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update profile based on user role
        if (user.role === "student") {
            user.profile.studentData = {
                degree: degree || user.profile.studentData.degree,
                institution: institution || user.profile.studentData.institution,
                yearOfStudy: parseInt(yearOfStudy) || user.profile.studentData.yearOfStudy,
                GPA: GPA ==" " ? user.profile.studentData.GPA:parseFloat(GPA),
                skills: skills === " "? user.profile.studentData.skills:skills,
                whatsappNumber: whatsappNumber || user.profile.studentData.whatsappNumber,
            };
        } else if (user.role === "employee") {
            user.profile.employeeData = {
                poistion: position || user.profile.employeeData.degree,
                company: company || user.profile.employeeData.institution,
                yearsOfExperience: yearsOfExperience || user.profile.employeeData.year_of_Study,
                industry: industry || user.profile.employeeData.gpa,
                skills: skills || user.profile.employeeData.skills,
                certifications: certifications || user.profile.employeeData.certifications,
                linkedinProfile: linkedinProfile || user.profile.employeeData.linkedinProfile,
                whatsappNumber: whatsappNumber || user.profile.employeeData.whatsappNumber,
            };
        }

        // Save the updated user data to the database
        await user.save();

        return res.status(200).json({ success: true, message: "Profile updated successfully", profile: user.profile });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Update user's test score
export const updateTestScore =async (req, res) => {
    try {
      const {score } = req.body;
  
      console.log("Updating test score for user ID:", req.user.id, "with score:", score);
      

      // Validate input
      // if (!userId || !scoreData?.score || !scoreData?.skillCategory) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "Missing required fields: userId, score, and skillCategory"
      //   });
      // }
  
      if (!score) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: userId and score,"
        });
      }

      // Prepare update data
      const newTestResult = {
        score: score,
        // skillCategory: scoreData.skillCategory,
        // difficultyBreakdown: scoreData.difficultyBreakdown || {
        //   basic: 0,
        //   intermediate: 0,
        //   advanced: 0
        // }
      };
  
      // Update user document
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          $push: { 'scores.skillTests': newTestResult },
          // $set: { 
          //   'scores.overallScore': calculateOverallScore(scoreData.score) 
          // }
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
  
      res.status(200).json({
        success: true,
        data: {
          updatedScore: updatedUser.scores
        }
      });
  
    } catch (error) {
      console.error("Score update error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  };
  
  // Helper function to calculate overall score (customize as needed)
  function calculateOverallScore(newScore) {
    // Example: Simple average calculation
    // In practice, you might want to fetch existing scores first
    return newScore; 
  }


  export const getApplicationDetails = async (req, res) => {  
    try {
        console.log("Fetch Called");
        
        const data = await Applicant.countDocuments({ candidateID: req.user.id });
        console.log("Application count for user ID:", req.user.id, "is:", data);   
        
        return res.status(200).json({
            success: true,
            message: "Application count fetched successfully",
            applications: data
        });
    } catch (error) {
        console.error("Error fetching application count:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


export const getUserData = async (req,res) => {
  
  const user = User.findById(req.user.id);

  return res.status(201).json({
    user
  });

}