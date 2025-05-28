import mongoose from "mongoose"
// import { emit } from "nodemon";

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true, },
    role: {
        type: String,
        enum: ['student', 'employee', 'admin'], // specify the user roles
        default: 'student' // default the user is student
    },
    profile: {
        studentData: {
            degree: String,
            institution: String,
            yearOfStudy: Number,
            GPA: Number,
            graduationDate: Date,
            skills: [String],
            resumeUrl: String,
            certifications: [String],
            portfolioLink: String,
            desiredJobRole: String,
            locationPreferences: [String],
            availability: String,
            previousInternships: [String]
        },

        employeeData: {
            position: String,
            company: String,
            yearsOfExperience: Number,
            industry: String,
            skills: [String],
            certifications: [String],
            linkedinProfile: String,
            hiringRole: String,
            locationPreferences: [String],
            desiredSkills: [String],
            experienceLevel: String
        }

    }

})

const User = mongoose.model('User', userSchema);

export default User;