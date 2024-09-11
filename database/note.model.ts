import { Schema, model, models, Document } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
  noteType: string;
  author: Schema.Types.ObjectId;
  noteFor?: Schema.Types.ObjectId;
  createdAt: Date;
  isAnonymous: boolean;
  views: number;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  replies: Schema.Types.ObjectId[];
}

const NoteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  noteType: { type: String, enum: ["confession", "opinion"], required: true },
  isAnonymous: { type: Boolean, default: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  noteFor: { type: Schema.Types.ObjectId, ref: "User", optional: true },
  views: { type: Number, default: 0 },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
  createdAt: { type: Date, default: Date.now },
});

const Note = models.Note || model("Note", NoteSchema);
export default Note;
