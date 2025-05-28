import express from "express";  
import multer from 'multer'
import File from '../model/file.model.js'
import fs from 'fs'
import path from "path";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// CREATE a file
router.post('/upload', upload.single('file'), async (req, res) => {
    // console.log('====================================');
    // // console.log(req.body);
    // // console.log(req.file);
    // console.log('====================================');
    const {candidateID} = req.body
    try {
        const file = new File({
            candidateId:candidateID,
            filename: req.file.originalname,
            filePath: req.file.path,
            fileSize: req.file.size,
        });
        await file.save();
        res.status(201).json({ success:true, message: 'File uploaded successfully', file });
    } catch (error) {
        res.status(500).json({ success:false,dmessage: 'Error uploading file', error });
    }
});


// READ a file by ID
router.get('/:id', async (req, res) => {
    // console.log(req.params.id);
    const id = req.params.id;
    // console.log('====================================');
    // console.log("id = ",id);
    // console.log('====================================');
    try {
        const file = await File.find({candidateId:id});
        // console.log("File Data",file);
        
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        res.status(200).json(file);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching file', error });
    }
});

// UPDATE file metadata
router.put('/:id', async (req, res) => {
    console.log(req.params);
    
    try {
        const updatedFile = await File.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFile) return res.status(404).json({ message: 'File not found' });
        res.status(200).json(updatedFile);
    } catch (error) {
        res.status(500).json({ message: 'Error updating file', error });
    }
});

// DELETE a file
router.delete('/delete/:id', async (req, res) => {
    // const fs = require('fs');
    // const path = require('path');

    try {
        // console.log('Deleting file with ID:', req.params.id);

        const file = await File.findById(req.params.id);
        // console.log('File found:', file);

        if (!file) {
            return res.status(404).json({ message: 'File not found in database' });
        }

        const normalizedPath = path.normalize(file.filePath);
        console.log('Normalized Path:', normalizedPath);

        if (fs.existsSync(normalizedPath)) {
            fs.unlinkSync(normalizedPath);
            // console.log('File deleted from filesystem');
        } else {
            console.error('File does not exist on filesystem');
            return res.status(404).json({ message: 'File not found on server' });
        }

        await file.deleteOne();
        // console.log('File removed from database');

        res.status(200).json({ success: true, message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ success: false, message: 'Error deleting file', error });
    }
});

// router.delete('/delete/:id', async (req, res) => {
//     console.log(req.params.id);
    
//     try {
//         const file = await File.findById(req.params.id);
//         console.log(file);
        
//         if (file == null) return res.status(404).json({ message: 'File not found' });

//         const fs = require('fs');
//         fs.unlinkSync(file.filePath);

//         await file.remove();
//         res.status(200).json({ 
//             success: true, message: 'File deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Error deleting file', error });
//     }
// });

export default router;