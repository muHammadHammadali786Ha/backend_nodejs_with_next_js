// const mongoose = require('mongoose');
import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    filename: { type: String, required: true },
    filePath: { type: String, required: true },
    fileSize: { type: Number, required: true },
    uploadDate: { type: Date, default: Date.now }
});

// module.exports = mongoose.model('File', fileSchema);
const File = mongoose.model('File', fileSchema);

export default File;
