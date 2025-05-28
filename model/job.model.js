import mongoose from "mongoose";

const jobSchema = mongoose.Schema({
    title: { type: String, required: true },
    department: { type: String, required: true},
    jobType: { type: String, required: true},
    location: { type: String, required: true},
    salary: { type: String, required: true},
    descriptions: { type: String, required: true},
    requirements: [{ type: String,}],
    deadLine:{type:Date}
})

const Job = mongoose.model('Job', jobSchema);

export default Job;