import { Schema, models, model, Document } from "mongoose";

export interface IReply extends Document {
  author: Schema.Types.ObjectId;
  note: Schema.Types.ObjectId;
  content: string;
  createdAt: Date;
  isAnonymous: boolean;
}

const ReplySchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  note: { type: Schema.Types.ObjectId, ref: "Note", required: true },
  content: { type: String, required: true },
  isAnonymous: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Reply = models.Reply || model("Reply", ReplySchema);
export default Reply;
