"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import Interaction from "@/database/interaction.model";
import User from "@/database/user.model";
import { createNotification } from "./notification.action";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();
    const { content, author, question, path } = params;
    const newAnswer = await Answer.create({
      content,
      author,
      question,
    });
    // Add answer to the question's answers array.
    const questionObj = await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    await Interaction.create({
      user: author,
      action: "answer",
      question: question,
      answer: newAnswer._id,
      tags: questionObj.tags,
    });
    await User.findByIdAndUpdate(author, {
      $inc: { reputation: 10 },
    });
    await createNotification({
      user: questionObj.author._id,
      type: "question_answer",
      message: "You got new answer on your question!",
      relatedId: questionObj._id,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase();
    const { questionId, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture")
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(pageSize);

    const totalAnswers = await Answer.countDocuments({ question: questionId });

    const isNextAnswer = skipAmount + answers.length < totalAnswers;

    return { answers, isNextAnswer };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    connectToDatabase();
    const { answerId, path } = params;
    const answer = await Answer.findById(answerId);
    if (!answer) throw new Error("Answer not found");
    await Answer.deleteOne({ _id: answer });
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: answerId } }
    );
    await Interaction.deleteMany({ answer: answerId });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();
    const { answerId, userId, hasupvoted, hasdownvoted, path } = params;
    let updateQuery = {};
    if (hasupvoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownvoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
    if (!answer) throw new Error("Answer not found");

    // Increament user's reputation :
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupvoted ? -2 : 2 },
    });
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasupvoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();
    const { answerId, userId, hasupvoted, hasdownvoted, path } = params;
    let updateQuery = {};
    if (hasdownvoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupvoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
    if (!answer) throw new Error("Answer not found");

    // Increment user's reputation.
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownvoted ? -2 : 2 },
    });
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasdownvoted ? -10 : 10 },
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
