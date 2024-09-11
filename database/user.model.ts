import { Schema, models, model, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  picture?: string;
  college?: string;
  instagram?: string;
  reputation?: number;
  shoutoutsReceived: Schema.Types.ObjectId[];
  saved: Schema.Types.ObjectId[];
  savedNotes: Schema.Types.ObjectId[];
  joinedAt: Date;
}

const UserSchema = new Schema({
  clerkId: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: String,
  bio: { type: String },
  college: { type: String },
  instagram: { type: String },
  picture: String,
  reputation: { type: Number, default: 0 },
  shoutoutsReceived: [{ type: Schema.Types.ObjectId, ref: "Shoutout" }],
  saved: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  savedNotes: [{ type: Schema.Types.ObjectId, ref: "Note" }],
  joinedAt: { type: Date, default: Date.now },
});

const User = models.User || model("User", UserSchema);
export default User;
