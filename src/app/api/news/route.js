import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import fs from "fs";
import path from "path";

const dbName = "medical";
const collectionName = "news";

async function connectDB() {
  const client = await clientPromise;
  return client.db(dbName).collection(collectionName);
}

// GET: სიახლეები Pagination-ისთვის, ახალი ზედა
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

// POST: ახალი სიახლის დამატება
export async function POST(req) {
  try {
    const data = await req.json();
    const collection = await connectDB();

    // სურათის default
    if (!data.image) data.image = "/img/news/default.jpg";

    // ახალი სიახლე
   
    const newNews = {
        ...data,
        date: new Date(), // ავტომატურად current timestamp, წამები და მილიწამები
        image: data.image || "/img/news/default.jpg"
      };

    const result = await collection.insertOne(newNews);
    return new Response(JSON.stringify({ ...newNews, _id: result.insertedId }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// DELETE: სიახლის წაშლა (მაშინ წაიშალოს სურათიც)
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("_id");
    if (!id) return new Response(JSON.stringify({ error: "_id is required" }), { status: 400 });

    const collection = await connectDB();
    const newsItem = await collection.findOne({ _id: new ObjectId(id) });

    if (!newsItem) return new Response(JSON.stringify({ error: "News not found" }), { status: 404 });

    // სურათის წაშლა ლოკალური ფოლდერიდან
    if (newsItem.image && newsItem.image !== "/img/news/default.jpg") {
      const imagePath = path.join(process.cwd(), "public", newsItem.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await collection.deleteOne({ _id: new ObjectId(id) });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// PATCH: სიახლის რედაქტირება
export async function PATCH(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("_id");
    if (!id) return new Response(JSON.stringify({ error: "_id is required" }), { status: 400 });

    const updatedData = await req.json();
    if (updatedData.date) updatedData.date = new Date(updatedData.date);

    const collection = await connectDB();
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedData });

    if (result.matchedCount === 0) return new Response(JSON.stringify({ error: "News not found" }), { status: 404 });

    const updatedNews = await collection.findOne({ _id: new ObjectId(id) });
    return new Response(JSON.stringify(updatedNews), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}