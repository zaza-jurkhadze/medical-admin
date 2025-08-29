import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { id, newPassword, adminToken } = await req.json();
    if (!adminToken) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const client = await clientPromise;
    const db = client.db();

    const hashed = await bcrypt.hash(newPassword, 10);

    await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: { password: hashed } }
    );

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}