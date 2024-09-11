import { Schema, model, models, Document } from "mongoose";

export interface IInteraction extends Document {
  user: Schema.Types.ObjectId;
  action: string;
  question: Schema.Types.ObjectId;
  note: Schema.Types.ObjectId;
  answer: Schema.Types.ObjectId;
  reply: Schema.Types.ObjectId;
  //tags: Schema.Types.ObjectId;
  tags?: Schema.Types.ObjectId[];
  shoutout: Schema.Types.ObjectId;
  createdAt: Date;
}

const InteractionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  question: { type: Schema.Types.ObjectId, ref: "Question" },
  note: { type: Schema.Types.ObjectId, ref: "Note" },
  answer: { type: Schema.Types.ObjectId, ref: "Answer" },
  reply: { type: Schema.Types.ObjectId, ref: "Reply" },
  // tags: { type: Schema.Types.ObjectId, ref: "Tag" },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  shoutout: { type: Schema.Types.ObjectId, ref: "Shoutout" },
  createdAt: { type: Date, default: Date.now },
});

const Interaction =
  models.Interaction || model("Interaction", InteractionSchema);

export default Interaction;
