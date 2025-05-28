import jwt from 'jsonwebtoken'

const authVerification = (req,res,next) =>{
    try {
        let token;
        const authHeader = req.headers.authorization||req.headers.Authorization

        if (authHeader && authHeader.startsWith("Bearer")) {
            token =authHeader.split(" ")[1];
        }

        if (!token) {
           return res.status(401).json({message:"Access denied"});
        }

        const decode = jwt.verify(token,process.env.SECRET_KEY);
        req.user = decode;
   

        next();
    } catch (error) {
        console.log(error.message);
        
    }
}

export default authVerification;