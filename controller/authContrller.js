import User from "../model/user.model.js";
import bcrypt from 'bcryptjs';
import { configDotenv } from "dotenv";
import jwt from 'jsonwebtoken';

configDotenv();

export const register = async (req, res) => {
    try {

        // ! STEP (1)  getting data from the request
        const { username, email, password } = req.body;

        // ! STEP (2) checking user already exit with this email 
        const user = await User.findOne({ email: email });

        // todo  if user does't exit 
        if (!user) {

            // ? STEP (3) encrypted the password 
            const hashPassword = await bcrypt.hash(password, 10);

            // ? STEP (4) creating the new User or registerd into the Database
            const newUser = await new User({
                username,
                email,
                password: hashPassword
            })

            newUser.save();

            // ? STEP (5) if user save or registerd 
            return res.json({
                success:true,
                message: "User Add Successfully",
                // data: newUser
            })

        };

        // ! if user already EXit 
        return res.json({
            message: "User Already Exit",
            data: req.body
        })
    } catch (error) {
        console.log(error.message);

    }

}

export const login = async (req, res) => {
    try {


        const { email, password } = req.body;

        const user = await User.findOne({ email: email })
        if (!user) {
            return res.json({
                succes: false,
                message: "You are not registered"
            });
        }

        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.json({
                success: false,
                message: "Password not match"
            });
        }

        // let token = {user,process.en};
        const payload = { id: user._id, email: user.email };
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });

        return res.json({
            success: true,
            user,
            token
        });
    } catch (error) {

        console.log(error.message);

    }
} 