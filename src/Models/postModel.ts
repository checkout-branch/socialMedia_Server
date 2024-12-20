import { string } from "joi";
import mongoose, { Schema, Document } from "mongoose";

interface IComment {
  user: mongoose.Types.ObjectId; 
  content: string; 
  date: Date; 
}

interface IPost extends Document {
  userId:string
  userName:string
  profileImage:string
  image: string;
  description: string;
  likes: mongoose.Types.ObjectId[]; 
  share: number; 
  comment: IComment[];   
}

const postSchema = new mongoose.Schema<IPost>(
  {
    userId:{
      type:String
    },
    userName:{
        type:String,

    },
    profileImage:{
        type:String
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User", 
      default: [], 
    },
    share: {
      type: Number,
      default: 0, 
    },
    comment: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", 
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now, 
        },
      },
    ],
  },
  {
    timestamps: true, 
  }
);

const Post = mongoose.model<IPost>("Post", postSchema);
export default Post;
