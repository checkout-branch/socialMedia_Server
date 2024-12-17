import { string } from 'joi';
import mongoose, { Schema, Document } from 'mongoose';

// TypeScript Interface for Tournament
interface TournamentType extends Document {
  tournamentName:string,
  game: string;
  userName: string; // Set dynamically in the controller
  profileImage?: string; // Set dynamically in the controller
  image: string;
  description: string;
  slots: number;
  entryFee: number;
  FirstPrize:number;
  secondPrize:number;
  thirdPrize:number
  date:Date;
  _id: mongoose.Types.ObjectId; 

}

// Tournament Schema Definition
const tournamentSchema: Schema<TournamentType> = new mongoose.Schema(
  {
    tournamentName:{
      type:String,
      required:true
    },
    game: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      
    },
    image: {
      type: String,
      // required: true
    },
    description: {
      type: String,
      required: true
    },
    slots: {
      type: Number,
      required: true
    },
    entryFee: {
      type: Number,
      required: true
    },
    FirstPrize:{
      type:Number,
      required:true
    },
    secondPrize:{
      type:Number,
      required:true
    },
    thirdPrize:{
      type:Number,
      required:true
    }
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

const Tournament = mongoose.model<TournamentType>('Tournament', tournamentSchema);

export default Tournament;
