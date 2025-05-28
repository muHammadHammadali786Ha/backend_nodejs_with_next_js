import mongoose from "mongoose";

const resumeSchema = mongoose.Schema({
    std_id:{type:mongoose.Schema.ObjectId,ref:'User' ,required:true},
    resumeUrl: { type: String, required: true },
},{timestamps:true});

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;