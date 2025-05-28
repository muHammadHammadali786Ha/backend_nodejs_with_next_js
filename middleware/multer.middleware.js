// multer.config.js
import multer from 'multer';
import path from 'path';

// Define storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Specify the destination folder
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        // Specify the file name (we can include the original file name and a timestamp)
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Define file filter for limiting file types (optional)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']; // Example: allow only JPEG, PNG images and PDF files
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Allow the file
    } else {
        cb(new Error('Invalid file type. Only JPG, PNG, and PDF are allowed.'));
    }
};

// Set up file upload size limit (optional)
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Maximum file size of 5MB
});

export default upload;
