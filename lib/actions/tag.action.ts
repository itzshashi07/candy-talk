"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetQuestionsByTagIdParams } from "./shared.types";
import Tag, { ITag } from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import Question from "@/database/question.model";

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();
    const { searchQuery, filter, page = 1, pageSize = 20 } = params;
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Tag> = {};
    if (searchQuery) {
      //@ts-ignore
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }
    let sortOptions = {};
    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;

      default:
        break;
    }
    const tags = await Tag.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);
    const totalTags = await Tag.countDocuments(query);
    const isNext = totalTags > skipAmount + tags.length;
    return { tags, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase();
    const { tagId, page = 1, pageSize = 20, searchQuery } = params;
    const tagFilter: FilterQuery<typeof Tag> = { _id: tagId };
    if (searchQuery) {
      tagFilter.$or = [
        //@ts-ignore
        { title: { $regex: new RegExp(searchQuery, "i") } },
        //@ts-ignore
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }
    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
        populate: [
          { path: "tags", model: Tag, select: "_id name" },
          {
            path: "author",
            model: User,
            select: "_id clerkId name picture",
          },
        ],
      },
    });
    if (!tag) throw new Error("Tag not found");
    const questions = tag.questions;
    return { tagTitle: tag.name, questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getPopularTags() {
  try {
    connectToDatabase();
    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);
    return popularTags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
