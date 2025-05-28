import Job from "../model/job.model.js";
import User from "../model/user.model.js";
// import { getWhatsappNumber } from "./user.js";

// export const creatPost = async (req, res) => {
//     try {
//         // console.log(req.body);

//         const { employeeID,title, department, jobType, location, salary, descriptions, requirements, deadLine } = req.body;

//         const checkJob = await Job.find({
//             title: title,
//             department: department,
//             jobType: jobType,
//             location: location
//         }).limit(1);

//         if (checkJob.length > 0) {
//             return res.status(409).json({
//                 success: false,
//                 "message": "Job Post already Exits",
//                 checkJob
//             })
//         }

//         const newPost = await new Job({
//             employeeID,
//             title,
//             department,
//             jobType,
//             location,
//             salary,
//             descriptions,
//             requirements,
//             deadLine,
//         });

//         await newPost.save();

//         return res.status(201).json({
//             success: true,
//             message: "Job Post Created",
//             newPost
//         })
//     } catch (error) {
//         res.status(500).json({
//             message: error.message
//         })
//     }

// };
export const creatPost = async (req, res) => {
  try {
    const {
      employeeID,
      title,
      department,
      jobType,
      location,
      salary,
      descriptions,
      requirements,
      deadLine,
      startDate,
      duration,
      durationUnit,
      minStipend,
      maxStipend,
      currency,
      stipendDetails,
      applicationDeadline,
      openings,
      about,
      responsibilities,
      skills,
      perks,
      whoCanApply,
      additionalInfo,
      website,
      companyAbout,
      requireTestBeforeApply
    } = req.body;

    // Check if a similar job post already exists
    const checkJob = await Job.find({
      title: title,
      department: department,
      jobType: jobType,
      location: location,
    }).limit(1);

    if (checkJob.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Job Post already exists",
        checkJob,
      });
    }

    // Create a new job post
    const newPost = new Job({
      employeeID,
      title,
      department,
      jobType,
      location,
      salary,
      descriptions: descriptions || "No description provided",
      requirements: requirements
        ? requirements.split(",").map((req) => req.trim())
        : [],
      deadLine: deadLine ? new Date(deadLine) : undefined,
      startDate: new Date(startDate),
      duration: Number(duration),
      durationUnit,
      minStipend: Number(minStipend),
      maxStipend: Number(maxStipend),
      currency,
      stipendDetails,
      applicationDeadline: new Date(applicationDeadline),
      openings: Number(openings),
      about,
      responsibilities,
      skills: skills.split(",").map((skill) => skill.trim()),
      perks: perks.split(",").map((perk) => perk.trim()),
      whoCanApply,
      additionalInfo,
      website,
      companyAbout,
      requireTestBeforeApply
    });

    await newPost.save();

    return res.status(201).json({
      success: true,
      message: "Job Post Created",
      newPost,
    });
  } catch (error) {
    console.error("Error saving job post:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//! getting the joblists
// export const jobList = async (req, res) => {
//     // console.log(req);

//     let page = parseInt(req.query.page) || 1;
//     let perPage = 5; // Number of contacts per page

//     try {
//         const { id } = req.params
//         if (id) {
//             const jobListing = await Job.findOne({_id:id});
//             return res.status(200).json({
//                 success: true,
//                 jobListing
//             })
//         }
//         let totalContacts = await Job.countDocuments();
//         let totalPages = Math.ceil(totalContacts / perPage);

//         const jobListing = await Job.find().skip((page - 1) * perPage).limit(perPage);
//         return res.status(200).json({
//             success: true,
//             jobListing,
//             currentPage: page, totalPages,
//         })
//     } catch (error) {
//         return res.status(500).json({
//             message: error.message
//         })
//     }
// }

//! Getting the job lists with pagination and search
export const jobList = async (req, res) => {
    // console.log("Job List");
    
  let page = parseInt(req.query.page) || 1;
  let perPage = parseInt(req.query.perPage) || 5;
  let search = req.query.search || "";

  try {
    const { id, user_id } = req.params;
    
    if (id) {
      
      const jobListing = await Job.findById(id);
      if (!jobListing) {
        return res
        .status(404)
        .json({ success: false, message: "Job not found" })
      }
      const user = await User.findById({_id:jobListing.employeeID});
      // const whatsappNumber = getWhatsappNumber(req.user.id,req.user.role);
      const whatsappNumber = user.profile.employeeData.whatsappNumber || null;
      console.log(whatsappNumber);
      return res.status(200).json({ success: true, jobListing , whatsappNumber});
        
    }

    // Build search query
    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { company: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Count total jobs based on search filter
    let totalJobs = await Job.countDocuments(searchQuery);
    let totalPages = Math.ceil(totalJobs / perPage);

    // Fetch job listings with pagination and search
    const jobListing = await Job.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);  

    return res.status(200).json({
      success: true,
      jobListing,
      currentPage: page,
      totalPages,
      totalJobs,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ! Single get Jobs Data the job post api
export const jobListWithID = async (req, res) => {
    // console.log("Job with ID");
    
  try {
    var page = parseInt(req.query.page) || 1;
    var perPage = parseInt(req.query.perPage) || 5;
    var totalJobs = await Job.countDocuments();
    var totalPages = Math.ceil(totalJobs / perPage);
    if (req.user.id) {
      const jobListing = await Job.find({ employeeID: req.user.id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);
      return res.status(200).json({
        success: true,
        jobListing,
        currentPage: page,
        totalPages, 
        totalJobs,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ! For employee Update the job post api
export const listForUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("Job ID",id);
    if (id) {
      const jobListing = await Job.find({ employeeID: id });
      return res.status(200).json({
        success: true,
        jobListing,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// ! Update the job post api
export const updateJobList = async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;
    const findData = await Job.findByIdAndUpdate(id, newData, { new: true });

    return res.json({
      success: true,
      findData,
    });
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};

// ! Delete the job post api
export const delJobList = async (req, res) => {
  try {
    const { id } = req.params;

    const findData = await Job.findByIdAndDelete(id);

    // Fetch the updated job list
    const updatedJobList = await Job.find();

    return res.status(201).json({
      success: true,
      jobListing: updateJobList,
    });
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};
