"use server";
import Question, { IQuestion } from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
  RecommendedParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import { FilterQuery } from "mongoose";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();
    const { filter, searchQuery, page = 1, pageSize = 20 } = params;

    // Calculating number of questions to skip or return for pagination:
    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<IQuestion> = {};
    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};
    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;
      default:
        break;
    }
    const questions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalQuestions = await Question.countDocuments(query);
    const isNext = totalQuestions > skipAmount + questions.length;
    return { questions, isNext };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase();
    const { title, content, tags, author, path } = params;
    const question = await Question.create({ title, content, author });
    const tagDocuments = [];
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTag._id);
    }
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });
    await Interaction.create({
      user: author,
      action: "ask_question",
      question: question._id,
      tags: tagDocuments,
    });
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();
    const { questionId } = params;
    const question = await Question.findById(questionId)
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });
    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Function to vote questions :
export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();
    const { questionId, userId, hasupvoted, hasdownvoted, path } = params;
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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });
    if (!question) throw new Error("Question not found");

    // Change user's reputation :
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupvoted ? -1 : 1 },
    });

    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasupvoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();
    const { questionId, userId, hasupvoted, hasdownvoted, path } = params;
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
    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });
    if (!question) throw new Error("Question not found");

    // Increment user's reputation.
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownvoted ? -2 : 2 },
    });
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasdownvoted ? -10 : 10 },
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase();
    const { questionId, path } = params;
    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({
      question: questionId,
    });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { question: questionId },
      { $pull: { questions: questionId } }
    );
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase();
    const { questionId, path, title, content } = params;
    const question = await Question.findById(questionId).populate("tags");
    if (!question) throw new Error("Question not found");
    question.title = title;
    question.content = content;
    await question.save();
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getHotQuestions() {
  try {
    connectToDatabase();
    const hotQuestions = await Question.find({})
      .sort({
        views: -1,
        upvotes: -1,
      })
      .limit(5);
    return hotQuestions;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getRecommendedQuestions(params: RecommendedParams) {
  try {
    await connectToDatabase();
    const { userId, page = 1, pageSize = 10, searchQuery } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found");
    const skipAmount = (page - 1) * pageSize;

    // Find user interaction :
    const userInteractions = await Interaction.find({ user: user._id })
      .populate("tags")
      .exec();

    const userTags = userInteractions.reduce((tags, interaction) => {
      if (interaction.tags) {
        tags = tags.concat(interaction.tags);
      }
      return tags;
    }, []);

    const distinctUserTagIds = [
      ...new Set(userTags.map((tag: any) => tag._id)),
    ];

    const query: FilterQuery<IQuestion> = {
      $and: [
        { tags: { $in: distinctUserTagIds } },
        { author: { $ne: user._id } },
      ],
    };
    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const totalQuestions = await Question.countDocuments(query);
    const recommendedQuestions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .skip(skipAmount)
      .limit(pageSize);

    const isNext = totalQuestions > skipAmount + recommendedQuestions.length;
    return { questions: recommendedQuestions, isNext };
  } catch (error) {
    console.log("error getting recommended questions", error);
    throw error;
  }
}
