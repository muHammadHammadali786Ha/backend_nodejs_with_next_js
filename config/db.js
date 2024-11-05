import mongoose from "mongoose";

const connectDB = async () => {
    const connect = await mongoose.connect(process.env.MONGO_DB);
    if (connect) {
        console.log("Server is connected with Database Mongo DB");
    }
}

export default connectDB;