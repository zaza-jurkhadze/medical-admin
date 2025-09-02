
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

const dbName = "medical";
const collectionName = "news";

async function connectDB() {
  const client = await clientPromise;
  return client.db(dbName).collection(collectionName);
}

// GET: Pagination
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const collection = await connectDB();
    const totalCount = await collection.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    let news = await collection
      .find({})
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    news = news.map((n) => ({ ...n, id: n.id || n._id }));

    return new Response(JSON.stringify({ news, totalPages }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// POST: Add news
export async function POST(req) {
  try {
    const data = await req.json();
    const collection = await connectDB();

    let imageUrl = "/img/news/default.jpg";

    // ატვირთვა Cloudinary-ზე მხოლოდ თუ სურათი არ არის უკვე URL
    if (data.image && !data.image.startsWith("http")) {
      const uploadResponse = await cloudinary.uploader.upload(data.image, {
        folder: "news",
      });
      imageUrl = uploadResponse.secure_url;
    } else if (data.image && data.image.startsWith("http")) {
      imageUrl = data.image; // უკვე ატვირთული სურათი
    }

    const newNews = {
      ...data,
      date: new Date(),
      image: imageUrl,
    };

    const result = await collection.insertOne(newNews);
    return new Response(JSON.stringify({ ...newNews, _id: result.insertedId }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// PATCH: Update news
export async function PATCH(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("_id");
    if (!id) return new Response(JSON.stringify({ error: "_id is required" }), { status: 400 });

    const updatedData = await req.json();
    if (updatedData.date) updatedData.date = new Date(updatedData.date);

    const collection = await connectDB();
    const newsItem = await collection.findOne({ _id: new ObjectId(id) });
    if (!newsItem) return new Response(JSON.stringify({ error: "News not found" }), { status: 404 });

    // თუ ახალი სურათი მივიღეთ და ის არ არის URL, წაშალე ძველი Cloudinary-ზე
    if (updatedData.image && !updatedData.image.startsWith("http")) {
      if (newsItem.image && !newsItem.image.includes("default.jpg")) {
        const segments = newsItem.image.split("/");
        const fileName = segments[segments.length - 1].split(".")[0];
        await cloudinary.uploader.destroy(`news/${fileName}`);
      }
      const uploadResponse = await cloudinary.uploader.upload(updatedData.image, {
        folder: "news",
      });
      updatedData.image = uploadResponse.secure_url;
    }

    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
    const updatedNews = await collection.findOne({ _id: new ObjectId(id) });
    return new Response(JSON.stringify(updatedNews), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// DELETE: Delete news
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("_id");
    if (!id) return new Response(JSON.stringify({ error: "_id is required" }), { status: 400 });

    const collection = await connectDB();
    const newsItem = await collection.findOne({ _id: new ObjectId(id) });
    if (!newsItem) return new Response(JSON.stringify({ error: "News not found" }), { status: 404 });

    // სურათის წაშლა Cloudinary-ზე
    if (newsItem.image && !newsItem.image.includes("default.jpg")) {
      const segments = newsItem.image.split("/");
      const fileName = segments[segments.length - 1].split(".")[0];
      await cloudinary.uploader.destroy(`news/${fileName}`);
    }

    await collection.deleteOne({ _id: new ObjectId(id) });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
