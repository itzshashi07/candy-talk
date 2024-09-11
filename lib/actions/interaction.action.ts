"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { viewNoteParams, ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";
import Note from "@/database/note.model";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    connectToDatabase();
    const { questionId, userId } = params;
    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });
      if (existingInteraction) {
        console.log("Already viewed this question");
        return;
      }

      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      });
    }
  } catch (error) {
    console.error("Error viewing question:", error);
    throw error;
  }
}

export async function viewNote(params: viewNoteParams) {
  try {
    connectToDatabase();
    const { noteId, userId } = params;
    await Note.findByIdAndUpdate(noteId, { $inc: { views: 1 } });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        note: noteId,
      });
      if (existingInteraction) {
        console.log("Already viewed this note");
        return;
      }

      await Interaction.create({
        user: userId,
        action: "view",
        note: noteId,
      });
    }
  } catch (error) {
    console.error("Error viewing note:", error);
    throw error;
  }
}
