import mongoose, { Document, Schema } from 'mongoose';

interface IFollower extends Document {
  follower: mongoose.Types.ObjectId;
  followed: mongoose.Types.ObjectId;
  followedAt: Date;
}

const FollowerSchema = new Schema<IFollower>({
  follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  followed: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  followedAt: { type: Date, default: Date.now },
});

// Ensure that a user cannot follow the same person twice
FollowerSchema.index({ follower: 1, followed: 1 }, { unique: true });

const Follower = mongoose.model<IFollower>('Follower', FollowerSchema);

export default Follower;
