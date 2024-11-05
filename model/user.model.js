import mongoose from "mongoose"
// import { emit } from "nodemon";

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] },
    password: { type: String, required: true,}
})

const User = mongoose.model('User', userSchema);

export default User;