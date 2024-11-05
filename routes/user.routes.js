import { admin, manager, user } from "../controller/user.js";
import express from 'express';
import authVerification from "../middleware/authMIddleware.js";


const Userrouter = express.Router();

Userrouter.get('/user',authVerification,user);
Userrouter.get('/manager',authVerification,manager);
Userrouter.get('/admin',authVerification,admin);


export default Userrouter;
