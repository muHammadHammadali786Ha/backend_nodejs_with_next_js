import express from "express";
import {
  applyForInternship,
  getAllApplications,
  getApplicationsByUser,
  getApplicationsByInternship,
  deleteApplication,
  getApplicantionByEmployeeID,
  UpdateApplicationDoc,
} from "../controller/appliant.controller.js"

const application = express.Router();

// Route to apply for an internship
application.post("/apply", applyForInternship);

// Route to get all applications
application.get("/", getAllApplications);

// Route to get applications by user ID
application.get("/user/:employeeID", getApplicantionByEmployeeID);
application.get("/user/student/:userId", getApplicationsByUser);

// Route to get applications for a specific internship
// application.get("/internship/:internShipID", getApplicationsByInternship);

// Route to delete an application
application.delete("/:applicationId", deleteApplication);

// Update the application Status
application.post("/application/update/:app_id",UpdateApplicationDoc);

export default application;

