import { IUser } from "@/database/user.model";
import { Schema } from "mongoose";
export interface CreateAnswerParams {
  content: string;
  author: string; // User ID
  question: string; // Question ID
  path: string;
}
export interface CreateReplyParams {
  content: string;
  author: string; // User ID
  note: string; // Question ID
  path: string;
  isAnonymous: boolean;
}
export interface GetAnswersParams {
  questionId: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}
export interface GetRepliesParams {
  noteId: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}
export interface AnswerVoteParams {
  answerId: string;
  userId: string;
  hasupvoted: boolean;
  hasdownvoted: boolean;
  path: string;
}
export interface DeleteAnswerParams {
  answerId: string;
  path: string;
}

export interface DeleteReplyParams {
  replyId: string;
  path: string;
}
export interface SearchParams {
  query?: string | null;
  type?: string | null;
}
export interface RecommendedParams {
  userId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}
export interface ViewQuestionParams {
  questionId: string;
  userId: string | undefined;
}
export interface viewNoteParams {
  noteId: string;
  userId: string | undefined;
}

export interface GetQuestionsParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}
export interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
  author: Schema.Types.ObjectId | IUser;
  path: string;
}
export interface GetNotesParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}
export interface CreateNoteParams {
  title: string;
  content: string;
  author: Schema.Types.ObjectId | IUser;
  noteType: string;
  noteFor?: string | undefined;
  isAnonymous: boolean;
  path: string;
}
export interface CreateShoutoutParams {
  title: string;
  author: Schema.Types.ObjectId | IUser;
  receiverName: string;
  isAnonymous: boolean;
  path: string;
}

export interface GetQuestionByIdParams {
  questionId: string;
}
export interface QuestionVoteParams {
  questionId: string;
  userId: string;
  hasupvoted: boolean;
  hasdownvoted: boolean;
  path: string;
}
export interface NoteVoteParams {
  noteId: string;
  userId: string;
  hasupvoted: boolean;
  hasdownvoted: boolean;
  path: string;
}
export interface DeleteQuestionParams {
  questionId: string;
  path: string;
}
export interface DeleteNoteParams {
  noteId: string;
  path: string;
}
export interface DeleteShoutParams {
  shoutoutId: string;
  path: string;
}
export interface EditQuestionParams {
  questionId: string;
  title: string;
  content: string;
  path: string;
}
export interface EditNoteParams {
  noteId: string;
  title: string;
  content: string;
  path: string;
  isAnonymous: boolean;
}
export interface GetAllTagsParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export interface GetShoutoutsForUser {
  page?: number;
  pageSize?: number;
  filter?: string;
  clerkId: string;
}

export interface GetNotesForUser {
  page?: number;
  pageSize?: number;
  filter?: string;
  clerkId: string;
}

export interface GetShoutoutsParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}
export interface GetQuestionsByTagIdParams {
  tagId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}
export interface GetTopInteractedTagsParams {
  userId: string;
  limit?: number;
}
export interface CreateUserParams {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  picture: string;
}
export interface GetUserByIdParams {
  userId: string;
}
export interface GetAllUsersParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string; // Add searchQuery parameter
}
export interface UpdateUserParams {
  clerkId: string;
  updateData: Partial<IUser>;
  path: string;
}
export interface ToggleSaveQuestionParams {
  userId: string;
  questionId: string;
  path: string;
}
export interface ToggleSaveNoteParams {
  userId: string;
  noteId: string;
  path: string;
}

export interface GetSavedQuestionsParams {
  clerkId: string;
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}
export interface GetSavedNotesParams {
  clerkId: string;
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export interface GetUserStatsParams {
  userId: string;
  page?: number;
  pageSize?: number;
}
export interface DeleteUserParams {
  clerkId: string;
}

interface CreateNotifictaionParams {
  user: Schema.Types.ObjectId | IUser;
  type: string;
  message: string;
  relatedId: Schema.Types.ObjectId;
}

interface DeleteNotification {
  notificationId: string;
  path: string;
}
interface GetNotifications {
  clerkId: Schema.Types.ObjectId | undefined;
  page?: number;
  pageSize?: number;
  filter?: string;
}
interface GetNotificationsCount {
  clerkId: Schema.Types.ObjectId | undefined;
}

interface GetNotificationsResult {
  notifications: any[];
  isNext: boolean;
  totalNotifications: number;
}
