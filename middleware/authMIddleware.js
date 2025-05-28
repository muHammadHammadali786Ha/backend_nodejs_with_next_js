import jwt from 'jsonwebtoken'

const authVerification = (req,res,next) =>{
    // console.log("Auth verification middleware called");
    
    try {
        let token;
        const authHeader = req.headers.authorization||req.headers.Authorization
        // console.log("Auth Header:", authHeader);
        
        if (authHeader && authHeader.startsWith("Bearer")) {
            token =authHeader.split(" ")[1];
        }
        // console.log("Token:", token);
        
        if (!token) {
            return res.status(401).json({message:"Access denied"});
        //    return res.status(401).json({message:"Access denied"});
        }

        const decode = jwt.verify(token,process.env.SECRET_KEY);
        req.user = decode;
        // console.log("Decoded user:", req.user);
        
        next();
    } catch (error) {
        console.log(error.message);
        
    }
}

export default authVerification;