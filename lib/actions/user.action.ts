"use server";
import { FilterQuery } from "mongoose";
import { connectToDatabase } from "../mongoose";
import Note from "@/database/note.model";
import User from "@/database/user.model";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";

export async function getUserById(params: GetUserByIdParams) {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();
    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();
    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();
    const { clerkId } = params;
    const user = await User.findOneAndDelete({ clerkId });
    if (!user) throw new Error("User not found");

    // Delete everything that user have ever done.
    /*
    const userQuestionIds = await Question.find({ author: user._id }).distinct(
      "_id"
    );
    */
    await Question.deleteMany({ author: user._id });
    const deletedUser = await User.findByIdAndDelete(user._id);
    return deletedUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();
    const { searchQuery, filter, page = 1, pageSize = 20 } = params;
    const skipAmout = (page - 1) * pageSize;

    const query: FilterQuery<typeof User> = {};
    if (searchQuery) {
      query.$or = [
        //@ts-ignore
        { name: { $regex: new RegExp(searchQuery, "i") } },
        //@ts-ignore
        { username: { $regex: new RegExp(searchQuery, "i") } },
        //@ts-ignore
        { email: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};
    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: -1 };
        break;
      case "old_users":
        sortOptions = { joinedAt: 1 };
        break;
      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;
      default:
        break;
    }

    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skipAmout)
      .limit(pageSize);
    const totalUsers = await User.countDocuments(query);
    const isNext = totalUsers > skipAmout + users.length;
    return { users, isNext };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();
    const { userId, questionId, path } = params;
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    const isQuestionSaved = user.saved.includes(questionId);
    if (isQuestionSaved) {
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: { saved: questionId },
        },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { saved: questionId },
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

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();
    const { clerkId, page = 1, pageSize = 20, searchQuery } = params;
    const skipAmout = (page - 1) * pageSize;
    const query: FilterQuery<typeof Question> = searchQuery
      ? //@ts-ignore
        { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: { createdAt: -1 },
        skip: skipAmout,
        limit: pageSize + 1,
        populate: [
          { path: "tags", model: Tag, select: "_id name" },
          { path: "author", model: User, select: "_id clerkId name picture" },
        ],
      },
    });
    if (!user) throw new Error("User not found");
    const savedQuestions = user.saved;

    const isNext = user.saved.length > pageSize;
    return { questions: savedQuestions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedNotes(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();
    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;
    const query: FilterQuery<typeof Note> = searchQuery
      ? //@ts-ignore
        { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const user = await User.findOne({ clerkId }).populate({
      path: "savedNotes",
      match: query,
      options: {
        sort: { createdAt: -1 },
        populate: [
          { path: "author", model: User, select: "_id clerkId name picture" },
        ],
      },
    });
    if (!user) throw new Error("User not found");
    const savedNotes = user.savedNotes;
    return { savedNotes };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error("User not found");
    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalNotes = await Note.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);
    const [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);
    const [noteUpvotes] = await Note.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const [questionViews] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    const [noteViews] = await Note.aggregate([
      { $match: { author: user._id } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    const criteria = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      { type: "NOTE_COUNT" as BadgeCriteriaType, count: totalNotes },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0,
      },
      {
        type: "NOTE_UPVOTES" as BadgeCriteriaType,
        count: noteUpvotes?.totalUpvotes || 0,
      },
      {
        type: "TOTAL_QUESTION_VIEWS" as BadgeCriteriaType,
        count: questionViews?.totalViews || 0,
      },
      {
        type: "TOTAL_NOTE_VIEWS" as BadgeCriteriaType,
        count: noteViews?.totalViews || 0,
      },
    ];

    const badgeCounts = assignBadges({ criteria });

    return {
      user,
      totalQuestions,
      totalAnswers,
      totalNotes,
      badgeCounts,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    const { userId, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;

    const totalQuestions = await Question.countDocuments({
      author: userId,
    });
    const userQuestions = await Question.find({ author: userId })
      .sort({
        views: -1,
        upvotes: -1,
      })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");
    const isNext = totalQuestions > skipAmount + userQuestions.length;
    return { totalQuestions, questions: userQuestions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    const { userId, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;

    const totalAnswers = await Answer.countDocuments({
      author: userId,
    });
    const userAnswers = await Answer.find({ author: userId })
      .sort({
        upvotes: -1,
      })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("question", "_id title")
      .populate("author", "_id clerkId name picture");

    const isNext = totalAnswers > skipAmount + userAnswers.length;
    return { totalAnswers, answers: userAnswers, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserNotes(params: GetUserStatsParams) {
  try {
    const { userId, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;

    const totalNotes = await Note.countDocuments({
      author: userId,
    });
    const userNotes = await Note.find({ author: userId })
      .sort({
        views: -1,
        upvotes: -1,
      })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("author", "_id clerkId name picture");

    const isNext = totalNotes > skipAmount + userNotes.length;
    return { totalNotes, notes: userNotes, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
