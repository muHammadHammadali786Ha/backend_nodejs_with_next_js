import Job from "../model/job.model.js";

export const creatPost = async (req,res) =>{
    try {
    const {title,department,jobType,location,salary,descriptions,requirements,deadLine} = req.body;

    const checkJob = await Job.find({
        title:title,
        department:department,
        jobType:jobType,
        location:location
    }).limit(1);

    if (checkJob.length > 0) {
       return res.status(409).json({
            success:false,
            "message":"Job Post already Exits",
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

    newPost.save();

     return res.status(201).json({
        success:true,
        message:"Job Post Created",
        newPost
     })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })   
    }
//    return res.json(req.body);
    
    
}