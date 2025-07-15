import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGODB_URI!);
};

const blogSchema = new mongoose.Schema({
  url: String,
  content: String,
});

export const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
