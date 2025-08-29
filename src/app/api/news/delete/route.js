import fs from "fs";
import path from "path";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { _id, imagePath } = body;

    if (!_id) return new Response(JSON.stringify({ error: "_id is required" }), { status: 400 });

    const client = await clientPromise;
    const db = client.db("medical");
    const collection = db.collection("news");

    // 1. პოულობს დოკუმენტს, რომელიც წაიშლება
    const docToDelete = await collection.findOne({ _id: new ObjectId(_id) });
    if (!docToDelete) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });

    const deletedId = docToDelete.id; // UI id

    // 2. წაშლა DB-დან
    await collection.deleteOne({ _id: new ObjectId(_id) });

    // 3. სურათის წაშლა ლოკალური ფოლდერიდან (თუ არა default)
    if (imagePath && !imagePath.includes("default.jpg")) {
      const filePath = path.join(process.cwd(), "public", imagePath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    // 4. ყველა დოკუმენტი, რომლის UI id > წაშლილი id, შეუმცირდეს 1-ით
    await collection.updateMany(
      { id: { $gt: deletedId } },
      { $inc: { id: -1 } }
    );

    return new Response(JSON.stringify({ message: "Deleted successfully" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}