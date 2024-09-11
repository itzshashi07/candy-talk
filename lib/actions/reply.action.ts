"use server";

import Reply from "@/database/reply.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateReplyParams,
  DeleteReplyParams,
  GetRepliesParams,
} from "./shared.types";
import Note from "@/database/note.model";
import { revalidatePath } from "next/cache";
import Interaction from "@/database/interaction.model";
import User from "@/database/user.model";
import { createNotification } from "./notification.action";

export async function getReplies(params: GetRepliesParams) {
  try {
    connectToDatabase();
    const { noteId, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;
    const replies = await Reply.find({ note: noteId })
      .populate("author", "_id clerkId name picture")
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(pageSize);

    const totalReplies = await Reply.countDocuments({ note: noteId });

    const isNext = skipAmount + replies.length < totalReplies;
    return { replies, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createReply(params: CreateReplyParams) {
  try {
    connectToDatabase();
    const { content, author, note, path, isAnonymous } = params;
    const newReply = await Reply.create({
      content,
      author,
      note,
      isAnonymous,
    });
    // Add reply to the note's replies array.
    const noteObj = await Note.findByIdAndUpdate(note, {
      $push: { replies: newReply._id },
    });

    await Interaction.create({
      user: author,
      action: "reply",
      note: note,
      reply: newReply._id,
    });

    await User.findByIdAndUpdate(author, {
      $inc: { reputation: 10 },
    });
    await createNotification({
      user: noteObj.author._id,
      type: "note_reply",
      message: "You got new reply on your note!",
      relatedId: noteObj._id,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteReply(params: DeleteReplyParams) {
  try {
    connectToDatabase();
    const { replyId, path } = params;
    const reply = await Reply.findById(replyId);
    if (!reply) throw new Error("Reply not found");
    await Reply.deleteOne({ _id: reply });
    await Note.updateMany({ _id: reply.note }, { $pull: { replies: replyId } });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
