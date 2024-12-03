import mongoose, { Document, Model } from "mongoose";
export interface UserI  extends Document{
    userName:string,
    email:string,
    password:string,
    profileImage:string,
    otp:number | undefined,
    isVerified:boolean,
    otpExpire:number | undefined,
    createdAt:Date,
}

const userSchema = new mongoose.Schema<UserI>({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profileImage:{
        type:String,
   
    },
    otp:{
        type:Number,
        default:null
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    otpExpire:{
        type:Number,
        default:null
    },
    createdAt:{
        type:Date,
        
    }
},{timestamps:true})

export const User:Model<UserI> = mongoose.model<UserI>('User',userSchema)

