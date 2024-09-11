import { Schema, Document, models, model } from "mongoose";

interface INotification extends Document {
  user: Schema.Types.ObjectId;
  type: string;
  message: string;
  relatedId: Schema.Types.ObjectId;
  createdAt: Date;
}

const NotificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
  relatedId: { type: Schema.Types.ObjectId },
  createdAt: { type: Date, default: Date.now },
});

const Notification =
  models.Notification || model("Notification", NotificationSchema);
export default Notification;
