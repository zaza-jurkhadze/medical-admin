import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const dbName = "medical";
const collectionName = "news";

async function connectDB() {
  const client = await clientPromise;
  return client.db(dbName).collection(collectionName);
}

export async function GET(req) {
  try {
    const urlParts = req.url.split("/");
    const id = urlParts[urlParts.length - 1]; 
    if (!id) return new Response(JSON.stringify({ error: "id is required" }), { status: 400 });

    const collection = await connectDB();
    const newsItem = await collection.findOne({ _id: new ObjectId(id) });

    if (!newsItem) return new Response(JSON.stringify({ error: "News not found" }), { status: 404 });

    return new Response(JSON.stringify(newsItem), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
