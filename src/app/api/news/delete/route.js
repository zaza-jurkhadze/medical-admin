import cloudinary from "@/lib/cloudinary";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { _id } = body;

    if (!_id) return new Response(JSON.stringify({ error: "_id is required" }), { status: 400 });

    const client = await clientPromise;
    const db = client.db("medical");
    const collection = db.collection("news");

    // პოულობს დოკუმენტს
    const docToDelete = await collection.findOne({ _id: new ObjectId(_id) });
    if (!docToDelete) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });

    // სურათის წაშლა Cloudinary-ზე, თუ არსებობს
    if (docToDelete.cloudinaryId) {
      await cloudinary.uploader.destroy(docToDelete.cloudinaryId);
    }

    // წაშლა DB-დან
    await collection.deleteOne({ _id: new ObjectId(_id) });

    return new Response(JSON.stringify({ message: "Deleted successfully" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
