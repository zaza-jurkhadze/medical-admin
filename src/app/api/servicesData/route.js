import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { unlink } from "fs/promises";
import path from "path";

const dbName = "medical";
const collectionName = "servicesData";

async function connectDB() {
  const client = await clientPromise;
  return client.db(dbName).collection(collectionName);
}

// GET: ყველა სერვისის წამოღება
export async function GET() {
  try {
    const collection = await connectDB();
    const services = await collection.find({}).sort({ id: 1 }).toArray(); // ID ზრდადობით
    return new Response(JSON.stringify(services), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// POST: ახალი სერვისის დამატება
export async function POST(req) {
  try {
    const data = await req.json();

    if (!data.icon || String(data.icon).trim() === "") {
      data.icon = "/img/icons/default.png";
    }

    const collection = await connectDB();

    // ID ზრდადობით
    const lastService = await collection.find().sort({ id: -1 }).limit(1).toArray();
    const newId = lastService.length ? lastService[0].id + 1 : 1;

    const newService = {
      ...data,
      id: newId,
      serviceId: newId, // ავტომატურად დამატებულია serviceId რომელიც ემთხვევა id-ს
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newService);

    return new Response(JSON.stringify({ ...newService, _id: result.insertedId }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// PUT: არსებული სერვისის რედაქტირება
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("_id");
    if (!id) return new Response(JSON.stringify({ error: "Missing _id" }), { status: 400 });

    const data = await req.json();
    if (!data.icon || String(data.icon).trim() === "") {
      data.icon = "/img/icons/default.png";
    }

    const collection = await connectDB();
    const service = await collection.findOne({ _id: new ObjectId(id) });
    if (!service) return new Response(JSON.stringify({ error: "Service not found" }), { status: 404 });

    // თუ icon შეიცვალა, წაშალე ძველი ფაილი (თუ არა default)
    if (service.icon && service.icon !== data.icon && !service.icon.includes("default.png")) {
      const filePath = path.join(process.cwd(), "public", service.icon);
      try { await unlink(filePath); } 
      catch (err) { console.warn("Cannot delete file:", filePath, err.message); }
    }

    await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...data } });
    const updatedService = await collection.findOne({ _id: new ObjectId(id) });

    return new Response(JSON.stringify(updatedService), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// DELETE: სერვისის წაშლა
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("_id");
    if (!id) return new Response(JSON.stringify({ error: "Missing _id" }), { status: 400 });

    const collection = await connectDB();
    const service = await collection.findOne({ _id: new ObjectId(id) });
    if (!service) return new Response(JSON.stringify({ error: "Service not found" }), { status: 404 });

    // სერვისის icon-ის წაშლა თუ არაა default
    if (service.icon && !service.icon.includes("default.png")) {
      const filePath = path.join(process.cwd(), "public", service.icon);
      try { await unlink(filePath); } 
      catch (err) { console.warn("Cannot delete file:", filePath, err.message); }
    }

    await collection.deleteOne({ _id: new ObjectId(id) });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}