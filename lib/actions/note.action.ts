"use server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import {
  CreateNoteParams,
  DeleteNoteParams,
  EditNoteParams,
  GetNotesParams,
  GetShoutoutsForUser,
  NoteVoteParams,
  ToggleSaveNoteParams,
} from "./shared.types";
import Note from "@/database/note.model";
import User from "@/database/user.model";
import Reply from "@/database/reply.model";
import Interaction from "@/database/interaction.model";
import { createNotification } from "./notification.action";

// Anonymous actions :
export async function createNote(params: CreateNoteParams) {
  try {
    connectToDatabase();
    const { title, content, author, isAnonymous, noteType, path, noteFor } =
      params;

    let mentionedUser;
    if (noteFor && noteFor !== "") {
      mentionedUser = await User.findOne({ username: noteFor });
      if (!mentionedUser) {
        return { error: "Username not found 🫡" };
      }
    }

    const note = await Note.create({
      title,
      content,
      author,
      isAnonymous,
      noteType,
      noteFor: mentionedUser?._id,
    });

    await Interaction.create({
      user: author,
      action: "create_note",
      note: note._id,
    });

    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

    if (mentionedUser) {
      await User.findByIdAndUpdate(mentionedUser._id, {
        $inc: { reputation: 2 },
      });
      // Create notification for the mentioned user
      await createNotification({
        user: mentionedUser._id,
        type: "note_mention",
        message: "You have been mentioned in a note!",
        relatedId: note._id,
      });
    }
    revalidatePath(path);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: "An unexpected error occurred" };
  }
}

export async function getNotes(params: GetNotesParams) {
  try {
    connectToDatabase();
    const { filter, page = 1, pageSize = 20 } = params;
    const skipAmount = (page - 1) * pageSize;
    let sortOptions = {};
    switch (filter) {
      case "most_loved":
        sortOptions = { upvotes: -1 };
        break;
      case "popular":
        sortOptions = { views: -1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      default:
        break;
    }
    const notes = await Note.find({})
      .populate({
        path: "author",
        model: User,
        select: "name _id clerkId picture",
      })
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalNotes = await Note.countDocuments();
    const isNext = totalNotes > skipAmount + notes.length;
    return { notes, isNext };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

interface GetNoteByIdParams {
  noteId: string;
}
export async function getNoteById(params: GetNoteByIdParams) {
  try {
    connectToDatabase();
    const { noteId } = params;
    const note = await Note.findById(noteId).populate({
      path: "author",
      model: User,
      select: "name _id clerkId picture",
    });
    return note;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function upvoteNote(params: NoteVoteParams) {
  try {
    connectToDatabase();
    const { noteId, userId, hasupvoted, hasdownvoted, path } = params;
    let updateQuery = {};
    if (!hasupvoted && !hasdownvoted) {
      updateQuery = { $addToSet: { upvotes: userId } };
    } else if (hasdownvoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else if (hasupvoted) {
      updateQuery = { $pull: { upvotes: userId } };
    }
    await Note.findByIdAndUpdate(noteId, updateQuery, { new: true });
    revalidatePath(path);
    // Create an interaction record for the user's upvote action. Increase author's reputation by 1 on upvoting a note.
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteNote(params: NoteVoteParams) {
  try {
    connectToDatabase();
    const { noteId, userId, hasupvoted, hasdownvoted, path } = params;
    let updateQuery = {};
    if (!hasupvoted && !hasdownvoted) {
      updateQuery = { $addToSet: { downvotes: userId } };
    } else if (hasupvoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else if (hasdownvoted) {
      updateQuery = { $pull: { downvotes: userId } };
    }

    await Note.findByIdAndUpdate(noteId, updateQuery, { new: true });
    revalidatePath(path);
    // Create an interaction record for the user's downvote action. Decrease author's reputation by 1 on downvoting a note.
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteNote(params: DeleteNoteParams) {
  try {
    connectToDatabase();
    const { noteId, path } = params;
    await Note.deleteOne({ _id: noteId });
    await Reply.deleteMany({
      note: noteId,
    });
    await Interaction.deleteMany({ note: noteId });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function editNote(params: EditNoteParams) {
  try {
    connectToDatabase();
    const { noteId, path, title, content, isAnonymous } = params;
    const note = await Note.findById(noteId);
    if (!note) throw new Error("Note not found");
    note.title = title;
    note.content = content;
    note.isAnonymous = isAnonymous;
    await note.save();
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function toggleSaveNote(params: ToggleSaveNoteParams) {
  try {
    connectToDatabase();
    const { userId, noteId, path } = params;
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");
    const isNoteSaved = user.savedNotes?.includes(noteId);
    if (isNoteSaved) {
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: { savedNotes: noteId },
        },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { savedNotes: noteId },
        },
        { new: true }
      );
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getNotesCreatedForUser(params: GetShoutoutsForUser) {
  try {
    connectToDatabase();
    const { clerkId, page = 1, pageSize = 15 } = params;
    const skipAmount = (page - 1) * pageSize;

    const notes = await Note.find({ noteFor: { $exists: true, $eq: clerkId } })
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(pageSize);

    const totalNotes = await Note.countDocuments({
      noteFor: { $exists: true, $eq: clerkId },
    });

    const isNext = skipAmount + notes.length < totalNotes;
    return { notes, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
