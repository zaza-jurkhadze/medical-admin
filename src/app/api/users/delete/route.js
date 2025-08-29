import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { id, adminToken } = await req.json();
    if (!adminToken) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const client = await clientPromise;
    const db = client.db();

    await db.collection("users").deleteOne({ _id: new ObjectId(id) });

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}