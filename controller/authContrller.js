import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";

configDotenv();

// export const register = async (req, res) => {
//   try {
//     console.log(req.body);
//     ;
//     // ! STEP (1)  getting data from the request
//     const { username, email, password, role, whatsappNumber } = req.body;

//     // ! STEP (2) checking user already exit with this email
//     const user = await User.findOne({ email: email });

//     // todo  if user does't exit
//     if (!user) {
//       // ? STEP (3) encrypted the password
//       const hashPassword = await bcrypt.hash(password, 10);

//       // ? STEP (4) creating the new User or registerd into the Database

//       let profileData = {};

//       if (role === "student") {
//         profileData.studentData = {
//           whatsappNumber: whatsappNumber,
//           // other student fields...
//         };
//       } else if (role === "employee") {
//         profileData.employeeData = {
//           whatsappNumber: whatsappNumber,
//           // other employee fields...
//         };
//       }

//       const newUser = new User({
//         username,
//         email,
//         password: hashPassword,
//         role,
//         profile: profileData,
//       });

//       newUser.save();

//       // ? STEP (5) if user save or registerd
//       return res.json({
//         success: true,
//         message: "User Add Successfully",
//       });
//     }

//     // ! if user already EXit
//     return res.json({
//       success: false,
//       message: "User Already Exit",
//       data: req.body,
//     });
//   } catch (error) {
//     console.log(error.message);
//   }
// };


export const register = async (req, res) => {
  try {
      const { username, email, password, role, whatsappNumber, ...profileData } = req.body;

      // Basic validation
      if (!username || !email || !password || !role) {
          return res.status(400).json({
              success: false,
              message: "Missing required fields"
          });
      }

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({
              success: false,
              message: "User already exists"
          });
      }

      // Hash password
      const hashPassword = await bcrypt.hash(password, 10);

      // Prepare user data
      const userData = {
          username,
          email,
          password: hashPassword,
          role,
          profile: {}
      };

      // Role-specific data
      if (role === 'student') {
          if (!whatsappNumber) {
              return res.status(400).json({
                  success: false,
                  message: "WhatsApp number is required for students"
              });
          }
          userData.profile.studentData = {
              whatsappNumber,
              ...profileData // Include other student fields
          };
      } 
      else if (role === 'employee') {
          if (!whatsappNumber) {
              return res.status(400).json({
                  success: false,
                  message: "WhatsApp number is required for employees"
              });
          }
          userData.profile.employeeData = {
              whatsappNumber,
              ...profileData // Include other employee fields
          };
      }

      // Create and save user
      const newUser = new User(userData);
      await newUser.save();

      return res.status(201).json({
          success: true,
          message: "User registered successfully",
          user: {
              id: newUser._id,
              username: newUser.username,
              email: newUser.email,
              role: newUser.role
          }
      });

  } catch (error) {
      console.error("Registration error:", error);
      
      if (error.name === 'ValidationError') {
          return res.status(400).json({
              success: false,
              message: "Validation error",
              error: error.message
          });
      }
      
      return res.status(500).json({
          success: false,
          message: "Internal server error"
      });
  }
};

export const login = async (req, res) => {
  console.log("Login request received");

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        succes: false,
        message: "You are not registered",
      });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.json({
        success: false,
        message: "Password not match",
      });
    }

    // let token = {user,process.en};
    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "6h",
    });

    return res.json({
      success: true,
      message: "Login Successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error.message);
  }
};
