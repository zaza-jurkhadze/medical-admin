import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  customId: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  imageUrl: { type: String, required: true },
  text: { type: String, required: true },
}, { timestamps: true });

const News = mongoose.models.News || mongoose.model("News", newsSchema);
export default News;