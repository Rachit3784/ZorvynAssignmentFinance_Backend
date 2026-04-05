import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['viewer','analyst','admin'],
        default:'viewer'
    },
    status : {
        type:String,
        enum:['active','inactive'],
        default:'active'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Users = mongoose.model("Users",UserSchema);
export default Users
