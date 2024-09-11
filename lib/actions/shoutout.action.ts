"use server";

import Shoutout from "@/database/shoutout.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateShoutoutParams,
  DeleteShoutParams,
  GetShoutoutsForUser,
  GetShoutoutsParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Interaction from "@/database/interaction.model";
import { createNotification } from "./notification.action";

export async function createShoutout(params: CreateShoutoutParams) {
  try {
    connectToDatabase();
    const { title, author, isAnonymous, receiverName, path } = params;

    const receiver = await User.findOne({ username: receiverName });
    if (!receiver) {
      return { error: "Username not found 🫡" };
    }

    const shoutout = await Shoutout.create({
      title,
      receiver: receiver._id,
      author,
      isAnonymous,
      path,
    });

    if (receiver.shoutoutsReceived) {
      receiver.shoutoutsReceived.push(shoutout._id);
    }
    await receiver.save();

    await Interaction.create({
      user: author,
      action: "create_shoutout",
      shoutout: shoutout,
    });

    await User.findByIdAndUpdate(author, {
      $inc: { reputation: 5 },
    });

    await User.findByIdAndUpdate(receiver._id, {
      $inc: { reputation: 2 },
    });

    // Create notification for the receiver
    await createNotification({
      user: receiver._id,
      type: "shoutout",
      message: "You received a new shoutout!",
      relatedId: shoutout._id,
    });
    revalidatePath(path);

    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: "An unexpected error occurred" };
  }
}

export async function getShoutouts(params: GetShoutoutsParams) {
  try {
    connectToDatabase();
    const { page = 1, pageSize = 20 } = params;
    const skipAmount = (page - 1) * pageSize;

    const shoutouts = await Shoutout.find({})
      .populate({
        path: "receiver",
        model: User,
        select: "_id name picture clerkId",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id name picture clerkId",
      })
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(pageSize);

    const totalShoutouts = await Shoutout.countDocuments();

    const isNext = skipAmount + shoutouts.length < totalShoutouts;

    return { shoutouts, isNext };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteShoutout(params: DeleteShoutParams) {
  try {
    connectToDatabase();
    const { shoutoutId, path } = params;
    const shoutout = await Shoutout.findById(shoutoutId);
    if (!shoutout) throw new Error("shoutout not found");
    await Shoutout.deleteOne({ _id: shoutout });
    await User.findByIdAndUpdate(
      { _id: shoutout.receiver._id },
      { $pull: { shoutoutsReceived: shoutoutId } }
    );
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getShoutoutsCreatedByUser(params: GetShoutoutsForUser) {
  try {
    connectToDatabase();
    const { clerkId, page = 1, pageSize = 15 } = params;
    const skipAmount = (page - 1) * pageSize;

    const shoutouts = await Shoutout.find({ author: clerkId })
      .populate({
        path: "receiver",
        model: User,
        select: "_id name picture clerkId",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id name picture clerkId",
      })
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(pageSize);

    const totalShoutouts = await Shoutout.countDocuments({ author: clerkId });

    const isNext = skipAmount + shoutouts.length < totalShoutouts;
    return { shoutouts, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getShoutoutsCreatedForUser(params: GetShoutoutsForUser) {
  try {
    connectToDatabase();
    const { clerkId, page = 1, pageSize = 15 } = params;
    const skipAmount = (page - 1) * pageSize;

    const shoutouts = await Shoutout.find({ receiver: clerkId })
      .populate({
        path: "receiver",
        model: User,
        select: "_id name picture clerkId",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id name picture clerkId",
      })
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(pageSize);

    const totalShoutouts = await Shoutout.countDocuments({ receiver: clerkId });

    const isNext = skipAmount + shoutouts.length < totalShoutouts;
    return { shoutouts, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
