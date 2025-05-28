// import mongoose from "mongoose";

// const jobSchema = mongoose.Schema({
//     employeeID:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     title: { type: String, required: true },
//     department: { type: String, required: true},
//     jobType: { type: String, required: true},
//     location: { type: String, required: true},
//     salary: { type: String, required: true},
//     descriptions: { type: String, required: true},
//     requirements: [{ type: String,}],
//     deadLine:{type:Date}
// })

// const Job = mongoose.model('Job', jobSchema);

// export default Job;

import mongoose from "mongoose";

const jobSchema = mongoose.Schema({
    employeeID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    department: { type: String, required: true },
    jobType: { type: String, enum: ["Full Time", "Part Time", "Internship"], required: true },
    location: { type: String, required: true },
    salary: { type: String }, // Optional field
    descriptions: { type: String, required: true },
    requirements: [{ type: String }], // Array of strings for multiple requirements
    deadLine: { type: Date }, // Optional field
    startDate: { type: Date }, // Start date of the job/internship
    duration: { type: Number }, // Duration in number
    durationUnit: { type: String, enum: ["days", "weeks", "months"], default: "weeks" }, // Unit for duration
    minStipend: { type: Number }, // Minimum stipend
    maxStipend: { type: Number }, // Maximum stipend
    currency: { type: String, default: "INR" }, // Currency for stipend/salary
    stipendDetails: { type: String }, // Optional details about stipend structure
    applicationDeadline: { type: Date, required: true }, // Deadline for applications
    openings: { type: Number, default: 1 }, // Number of openings
    about: { type: String, required: true }, // About the job/internship
    responsibilities: { type: String }, // Responsibilities for the role
    skills: [{ type: String }], // Array of skills required
    perks: [{ type: String }], // Array of perks
    whoCanApply: { type: String }, // Eligibility criteria
    additionalInfo: { type: String }, // Additional information
    website: { type: String }, // Company website
    companyAbout: { type: String }, // About the company
    requireTestBeforeApply: { 
        type: Boolean, 
        default: false 
    },
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

const Job = mongoose.model('Job', jobSchema);

export default Job;