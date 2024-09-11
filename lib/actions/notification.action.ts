"use server";
import { connectToDatabase } from "../mongoose";
import Notification from "@/database/notification.model";
import {
  CreateNotifictaionParams,
  DeleteNotification,
  GetNotifications,
  GetNotificationsCount,
  GetNotificationsResult,
} from "./shared.types";
import { revalidatePath } from "next/cache";

export async function createNotification(params: CreateNotifictaionParams) {
  try {
    connectToDatabase();
    const { user, type, message, relatedId } = params;
    await Notification.create({
      user,
      type,
      message,
      relatedId,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function deleteNotification(params: DeleteNotification) {
  try {
    connectToDatabase();
    const { notificationId, path } = params;
    await Notification.deleteOne({ _id: notificationId });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getNotifications(
  params: GetNotifications
): Promise<GetNotificationsResult> {
  try {
    connectToDatabase();
    const { clerkId, page = 1, pageSize = 20 } = params;
    const skipAmount = (page - 1) * pageSize;

    const notifications = await Notification.find({ user: clerkId })
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(pageSize);

    const totalNotifications = await Notification.countDocuments({
      user: clerkId,
    });
    const isNext = skipAmount + notifications.length < totalNotifications;

    return {
      notifications,
      isNext,
      totalNotifications,
    };
  } catch (error) {
    console.log(error);
    return {
      notifications: [],
      isNext: false,
      totalNotifications: 0,
    };
  }
}
export async function getNotificationsCount(params: GetNotificationsCount) {
  try {
    connectToDatabase();
    const { clerkId } = params;
    const totalNotifications = await Notification.countDocuments({
      user: clerkId,
    });
    return {
      totalNotifications,
    };
  } catch (error) {
    console.log(error);
    return {
      notifications: 0,
    };
  }
}
