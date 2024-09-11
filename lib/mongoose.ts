import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.error("Missing monogodb url");
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "NextJsApp",
    });
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
};
