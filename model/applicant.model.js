import mongoose from "mongoose";

const applicantSchema = mongoose.Schema({
    internShipID:{type:mongoose.Schema.Types.ObjectId,ref:'Job',required:true},
    candidateID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    employeeID:{type:mongoose.Schema.Types.ObjectId, ref:"User" ,required:true},
    JobTitle:{type:String,required:true},
    resume: { type: String, required: true }, // Path to uploaded resume file
    coverLetter: { type: String },           // Optional cover letter
    status: { 
        type: String, 
        enum: ["pending", "approved", "rejected" ,'interview-scheduled', 'interview-completed', 'hired'], 
        default: "pending" 
    },
    appliedAt: { type: Date, default: Date.now },
    testScore: {type: Number} 
});

const Applicant = mongoose.model('Applicant', applicantSchema);

export default Applicant;