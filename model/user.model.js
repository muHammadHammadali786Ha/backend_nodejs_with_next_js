import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['student', 'employee', 'admin'],
        default: 'student'
    },
    // New score field for test results
    scores: {
        skillTests: [{
            score: { type: Number, min: 0, max: 100 },
            dateTaken: { type: Date, default: Date.now },
            // skillCategory: String, // e.g., "Python", "JavaScript"
            // difficultyBreakdown: {
            //     basic: Number,
            //     intermediate: Number,
            //     advanced: Number
            // }
        }],
        // overallScore: { type: Number, default: 0 }
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
            previousInternships: [String],
            whatsappNumber: {
                type: String,
                required: function() {
                    return this.role === 'student';
                }
            }
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
            experienceLevel: String,
            whatsappNumber: {
                type: String,
                required: function() {
                    return this.role === 'employee';
                }
            }
        }
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;