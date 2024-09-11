"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";
import Note from "@/database/note.model";
import Shoutout from "@/database/shoutout.model";
import Reply from "@/database/reply.model";

const searhableTypes = [
  "question",
  "user",
  "answer",
  "tag",
  "note",
  "shoutout",
];

export async function globalSearch(params: SearchParams) {
  try {
    await connectToDatabase();
    const { query, type } = params;
    const regexQuery = { $regex: query, $options: "i" };
    let results: any[] = [];
    const modelsAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: User, searchField: "name", type: "user" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: Reply, searchField: "content", type: "reply" },
      { model: Tag, searchField: "name", type: "tag" },
      { model: Note, searchField: "title", type: "note" },
      { model: Shoutout, searchField: "title", type: "shoutout" },
    ];
    const typeLower = type?.toLowerCase();
    if (!typeLower || !searhableTypes.includes(typeLower)) {
      // search for everything
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model
          .find({
            [searchField]: regexQuery,
          })
          .limit(2);
        results.push(
          ...queryResults.map((item) => ({
            title:
              type === "answer" || type === "reply"
                ? `Results Containing ${query}`
                : item[searchField],
            type: type,
            id:
              type === "user"
                ? item.clerkId
                : type === "answer"
                  ? item.question
                  : item._id,
          }))
        );
      }
    } else {
      // specific search
      const modelInfo = modelsAndTypes.find((item) => item.type === type);
      if (!modelInfo) throw new Error("Invalid search type");
      const queryResults = await modelInfo.model
        .find({
          [modelInfo.searchField]: regexQuery,
        })
        .limit(8);
      results = queryResults.map((item) => ({
        title:
          type === "answer"
            ? `Answers containing ${query}`
            : item[modelInfo.searchField],
        type: type,
        id:
          type === "user"
            ? item.clerkId
            : type === "answer"
              ? item.question
              : item._id,
      }));
    }
    return JSON.stringify(results);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

interface SearchUsersParams {
  query: string;
}

export async function searchUsers(params: SearchUsersParams) {
  try {
    await connectToDatabase();
    const { query } = params;
    const regexQuery = new RegExp(query, "i");

    const users = await User.find({
      $or: [{ username: regexQuery }, { name: regexQuery }],
    })
      .select("username _id picture")
      .limit(5);
    if (!users) return [];
    const plainUsers = JSON.parse(JSON.stringify(users));
    return plainUsers;
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
}
