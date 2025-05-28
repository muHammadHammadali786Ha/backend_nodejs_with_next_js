import { admin, manager, user , updateProfile, updateTestScore,getApplicationDetails,getUserData} from "../controller/user.js";
import express from 'express';
import authVerification from "../middleware/authMIddleware.js";


const Userrouter = express.Router();

Userrouter.get('/user',authVerification,user);
Userrouter.get('/manager',authVerification,manager);
Userrouter.get('/admin',authVerification,admin);
Userrouter.post('/profile',authVerification,updateProfile);
Userrouter.get('/profile',authVerification,getUserData);
Userrouter.post('/updateScore',authVerification,updateTestScore);
Userrouter.post('/applicants',authVerification,getApplicationDetails);
// Userrouter.route("/").get(authVerification,getUsers);


export default Userrouter;
