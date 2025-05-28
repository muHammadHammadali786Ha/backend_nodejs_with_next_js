import Job from "../model/job.model.js";

export const creatPost = async (req, res) => {
    try {
        console.log(req.body);

        const { title, department, jobType, location, salary, descriptions, requirements, deadLine } = req.body;

        const checkJob = await Job.find({
            title: title,
            department: department,
            jobType: jobType,
            location: location
        }).limit(1);

        if (checkJob.length > 0) {
            return res.status(409).json({
                success: false,
                "message": "Job Post already Exits",
                checkJob
            })
        }

        const newPost = await new Job({
            title,
            department,
            jobType,
            location,
            salary,
            descriptions,
            requirements,
            deadLine,
        });

        await newPost.save();

        return res.status(201).json({
            success: true,
            message: "Job Post Created",
            newPost
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

};



export const jobList = async (req, res) => {
    try {
        const { id } = req.params
        if (id) {
            const jobListing = await Job.findOne({_id:id});
            return res.status(200).json({
                success: true,
                jobListing
            })
        }
        const jobListing = await Job.find();
        return res.status(200).json({
            success: true,
            jobListing
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}


export const updateJobList = async (req, res) => {
    try {
        const { id } = req.params;
        const newData = req.body;
        const findData = await Job.findByIdAndUpdate(id, newData, { new: true });

        return res.json({
            success:true,
            findData
        });
    } catch (error) {
        return res.json({
            message: error.message
        });
    }
}

export const delJobList = async (req, res) => {
    try {
        const { id } = req.params;

        const findData = await Job.findByIdAndDelete(id);

        // Fetch the updated job list
        const updatedJobList = await Job.find();

        return res.status(201).json({
            success: true,
            jobListing:updateJobList
        });
    } catch (error) {
        return res.json({
            message: error.message
        });
    }
}