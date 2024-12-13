import mongoose, { Schema, Document } from 'mongoose';

// TypeScript Interface for Tournament
interface TournamentType extends Document {
  game: string;
  userName: string; // Set dynamically in the controller
  userImage?: string; // Set dynamically in the controller
  gameImage: string;
  description: string;
  totalSlots: number;
  entryFee: number;
  prizepool: number[];
}

// Tournament Schema Definition
const tournamentSchema: Schema<TournamentType> = new mongoose.Schema(
  {
    game: {
      type: String,
      required: [true, 'Game name is required'],
      trim: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userImage: {
      type: String,
      default: '', // Optional
    },
    gameImage: {
      type: String,
      required: [true, 'Game image is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    totalSlots: {
      type: Number,
      required: [true, 'Total slots are required'],
      min: [1, 'Total slots must be at least 1'],
    },
    entryFee: {
      type: Number,
      required: [true, 'Entry fee is required'],
      min: [0, 'Entry fee must be at least 0'],
    },
    prizepool: {
      type: [Number],
      required: true,
      validate: {
        validator: function (value: number[]) {
          return value.every((prize) => prize >= 0);
        },
        message: 'Prizepool amounts must be non-negative',
      },
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

const Tournament = mongoose.model<TournamentType>('Tournament', tournamentSchema);

export default Tournament;
