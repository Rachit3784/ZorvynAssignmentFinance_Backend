import Users from "../model/UserSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/EnvVariable.js";

export const Signup = async (req,res)=>{
    try {
        const {name,email,password,role} = req.body;

        const existing = await Users.findOne({email});
        if(existing){
            return res.status(400).json({message:"User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Users.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        
        user.password = undefined; 
        return res.status(201).json({ success: true, message:"User created successfully", user, token });
    } catch (error) {
        return res.status(500).json({ success: false, message:"Internal server error", error: error.message });
    }
}


export const Login = async (req,res)=>{
    try {
        const {email,password} = req.body;

        const user = await Users.findOne({email, isDeleted: { $ne: true }});
        if(!user){
            return res.status(404).json({message:"User not found" , success : false});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message:"Invalid password" , success : false});
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        user.password = undefined;

        return res.status(200).json({message:"User logged in successfully", user, token, success : true});
    } catch (error) {
        return res.status(500).json({message:"Internal server error", error: error.message , success : false});
    }
}

export const ForgetPassword = async (req,res)=>{
    try {
        const {email} = req.body;

        const user = await Users.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found" , success : false});
        }

        if(user) {
            return res.status(200).json({success : true , message : "User found"})
        }

        
    } catch (error) {
        return res.status(500).json({message:"Internal server error",error , success : false});
    }
}

export const ResetPassword = async (req,res)=>{
    try {
        const {email,password} = req.body;

        const user = await Users.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found" , success : false});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        if(user) {
            user.password = hashedPassword;
            await user.save();
            return res.status(200).json({success : true , message : "Password reset successfully"});
        }

        
    } catch (error) {
        return res.status(500).json({message:"Internal server error",error: error.message , success : false});
    }
}

export const GetMe = async (req, res) => {
    try {
        const user = req.user;
        user.password = undefined;
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const GetAllUsers = async (req, res) => {
    try {
        const users = await Users.find({ isDeleted: { $ne: true } }).select('-password');
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const DeleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Users.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};




