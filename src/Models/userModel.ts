import { required, string } from "joi";
import mongoose, { Document, Model ,Types} from "mongoose";
export interface UserI  extends Document{
    name:string;
    userName:string,
    email:string,
    password:string,
    profileImage:string,
    gender:string,
    day:number,
    month:string,
    year:number,
    otp:number | undefined,
    isVerified:boolean,
    otpExpire:number | undefined,
    createdAt:Date,
    isBlocked:boolean
    tournamentCreate:mongoose.Types.ObjectId[];
    posts:mongoose.Types.ObjectId[]
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    likedPosts?: mongoose.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<UserI>({
    // name:{
    //     type:String,
    //     required:true
    // },
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
    gender:{
        type:String,
    },
    day:{
        type:Number,
    },
    month:{
        type:String,
    },
    year:{
        type:Number,
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
        
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
      }],
      following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
      }],

    tournamentCreate:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tournament'
    }],
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }],
    likedPosts: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
        default: [],
      },
},{timestamps:true})

export const User:Model<UserI> = mongoose.model<UserI>('User',userSchema)

