import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  applicationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Applicant',
    required: true 
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateTime: { 
    type: Date, 
    required: true 
  },
  duration: { 
    type: Number,  // in minutes
    default: 30 
  },
  interviewType: { 
    type: String, 
    enum: ['in-person', 'video', 'phone'],
    required: true 
  },
  meetingLink: String,
  location: String,
  status: {
  type: String,
  enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
  default: 'scheduled'
},
  notes: String
}, { timestamps: true });

// Indexes for faster queries
interviewSchema.index({ applicantId: 1 });
interviewSchema.index({ recruiterId: 1 });
interviewSchema.index({ jobId: 1 });
interviewSchema.index({ applicationId: 1 });

export default mongoose.model('Interview', interviewSchema);