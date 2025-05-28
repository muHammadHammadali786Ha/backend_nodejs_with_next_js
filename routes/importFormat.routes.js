import express from 'express';
import mongoose from 'mongoose';
import Job from '../model/job.model.js'; // Your Job model
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';
import { Readable } from 'stream';
import authVerification from '../middleware/authMIddleware.js';

const filerouter = express.Router();

// Middleware for employer authentication (replace with your actual auth)
// const requireEmployerAuth = (req, res, next) => {
//     // Check if the user is authenticated and is an employer
//     // Example:
//     if (req.headers.authorization && req.user && req.user.role === 'employer') {
//         next();
//     } else {
//         res.status(401).json({ message: 'Unauthorized' });
//     }
// };

// filerouter.use(requireEmployerAuth); // Apply authentication to these routes

// POST /api/employer/jobs/import/json
filerouter.post('/jobs/import/json', authVerification,async (req, res) => {
    try {
        const jobDataArray = Array.isArray(req.body) ? req.body : [req.body]; // Handle single or multiple jobs
        const importedJobs = [];
        for (const jobData of jobDataArray) {
            // Basic validation (you should add more robust validation)
            if (!jobData.title || !jobData.department || !jobData.jobType || !jobData.location || !jobData.about) {
                return res.status(400).json({ message: 'Missing required fields in JSON data.' });
            }
            const newJob = new Job({ ...jobData, employeeID: req.user.id }); // Associate with the logged-in employer
            const savedJob = await newJob.save();
            importedJobs.push(savedJob);
        }
        res.status(200).json({ message: `${importedJobs.length} job(s) imported successfully.`, importedJobs });
    } catch (error) {
        console.error('Error importing JSON:', error);
        res.status(500).json({ message: 'Failed to import jobs from JSON.', error: error.message });
    }
});

// GET /api/employer/jobs/export/json
filerouter.get('/jobs/export/json', authVerification,async (req, res) => {
    try {
        const employerJobs = await Job.find({ employeeID: req.user.id });
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="job_postings.json"');
        res.send(JSON.stringify(employerJobs, null, 2));
    } catch (error) {
        console.error('Error exporting JSON:', error);
        res.status(500).json({ message: 'Failed to export jobs as JSON.', error: error.message });
    }
});

// POST /api/employer/jobs/import/csv
filerouter.post('/jobs/import/csv',authVerification, async (req, res) => {
    const csvData = req.body.csvData;
    if (!csvData) {
        return res.status(400).json({ message: 'No CSV data provided.' });
    }

    parse(csvData, {
        columns: true, // Expect the first row to be column headers
        skip_empty_lines: true,
    }, async (err, records) => {
        if (err) {
            console.error('Error parsing CSV:', err);
            return res.status(400).json({ message: 'Error parsing CSV data.', error: err.message });
        }

        try {
            const importedJobs = [];
            for (const record of records) {
                // Map CSV columns to your Job schema fields (adjust as needed)
                const newJobData = {
                    employeeID: req.user._id,
                    title: record.title,
                    department: record.department,
                    jobType: record.jobType,
                    location: record.location,
                    salary: record.salary || null,
                    descriptions: record.descriptions,
                    requirements: record.requirements ? record.requirements.split(',').map(s => s.trim()) : [],
                    deadLine: record.deadLine ? new Date(record.deadLine) : null,
                    startDate: record.startDate ? new Date(record.startDate) : null,
                    duration: record.duration ? parseInt(record.duration) : undefined,
                    durationUnit: record.durationUnit || 'weeks',
                    minStipend: record.minStipend ? parseInt(record.minStipend) : undefined,
                    maxStipend: record.maxStipend ? parseInt(record.maxStipend) : undefined,
                    currency: record.currency || 'INR',
                    stipendDetails: record.stipendDetails || null,
                    applicationDeadline: record.applicationDeadline ? new Date(record.applicationDeadline) : null,
                    openings: record.openings ? parseInt(record.openings) : 1,
                    about: record.about,
                    responsibilities: record.responsibilities || null,
                    skills: record.skills ? record.skills.split(',').map(s => s.trim()) : [],
                    perks: record.perks ? record.perks.split(',').map(s => s.trim()) : [],
                    whoCanApply: record.whoCanApply || null,
                    additionalInfo: record.additionalInfo || null,
                    website: record.website || null,
                    companyAbout: record.companyAbout || null,
                };

                const newJob = new Job(newJobData);
                const savedJob = await newJob.save();
                importedJobs.push(savedJob);
            }
            res.status(200).json({ message: `${importedJobs.length} job(s) imported from CSV successfully.`, importedJobs });
        } catch (error) {
            console.error('Error importing from CSV:', error);
            res.status(500).json({ message: 'Failed to import jobs from CSV.', error: error.message });
        }
    });
});

// GET /api/employer/jobs/export/csv
filerouter.get('/jobs/export/csv',authVerification, async (req, res) => {
    try {
        const employerJobs = await Job.find({ employeeID: req.user._id }).lean(); // Use .lean() for faster performance in read-only scenarios

        const csvColumns = Object.keys(Job.schema.paths).filter(key => !['_id', '__v', 'employeeID', 'createdAt', 'updatedAt'].includes(key)); // Define CSV columns

        stringify(employerJobs.map(job => {
            const rowData = {};
            csvColumns.forEach(col => {
                rowData[col] = Array.isArray(job[col]) ? job[col].join(', ') : job[col]; // Handle arrays as comma-separated strings
            });
            return rowData;
        }), { header: true }, (err, output) => {
            if (err) {
                console.error('Error stringifying CSV:', err);
                return res.status(500).json({ message: 'Failed to generate CSV output.', error: err.message });
            }
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="job_postings.csv"');
            res.send(output);
        });
    } catch (error) {
        console.error('Error exporting CSV:', error);
        res.status(500).json({ message: 'Failed to export jobs as CSV.', error: error.message });
    }
});

export default filerouter;