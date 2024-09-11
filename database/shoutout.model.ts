import { Schema, model, models, Document } from "mongoose";

export interface IShoutout extends Document {
  author: Schema.Types.ObjectId;
  receiver: Schema.Types.ObjectId;
  title: string;
  createdAt: Date;
  isAnonymous: boolean;
}

const ShoutoutSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isAnonymous: { type: Boolean, default: false },
});

const Shoutout = models.Shoutout || model("Shoutout", ShoutoutSchema);
export default Shoutout;
