import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { unlink } from "fs/promises";
import path from "path";

const dbName = "medical";
const collectionName = "servicesDetails";

async function connectDB() {
  const client = await clientPromise;
  return client.db(dbName).collection(collectionName);
}

// --- GET: ყველა სერვისი ან კონკრეტული slugId-ით ---
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slugId = searchParams.get("slugId");

    const collection = await connectDB();

    if (slugId) {
      // ერთი სერვისი
      const service = await collection.findOne({ slugId });
      if (!service) {
        return new Response(JSON.stringify({ error: "Service not found" }), { status: 404 });
      }
      return new Response(JSON.stringify(service), { status: 200 });
    } else {
      // ყველა სერვისი
      const services = await collection.find({}).toArray();
      return new Response(JSON.stringify(services), { status: 200 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// --- POST: ახალი სერვისის დამატება ---
export async function POST(req) {
  try {
    let data = await req.json();

    if (!data.image || String(data.image).trim() === "") {
      data.image = "/img/servicesDetails/default.jpg";
    }

    const newService = {
      ...data,
      generalDescription: data.generalDescription || "",
      symptoms: data.symptoms || "",
      ourApproach: data.ourApproach || "",
      createdAt: new Date(),
    };

    const collection = await connectDB();
    const result = await collection.insertOne(newService);

    return new Response(JSON.stringify({ ...newService, _id: result.insertedId }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// --- DELETE: სერვისის წაშლა ---
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("_id");
    if (!id) {
      return new Response(JSON.stringify({ error: "Missing _id" }), { status: 400 });
    }

    const collection = await connectDB();
    const service = await collection.findOne({ _id: new ObjectId(id) });
    if (!service) {
      return new Response(JSON.stringify({ error: "Service not found" }), { status: 404 });
    }

    // წავშალოთ სურათი ფაილური სისტემიდან თუ არ არის default
    if (service.image && !service.image.includes("default.jpg")) {
      const filePath = path.join(process.cwd(), "public", service.image);
      try {
        await unlink(filePath);
      } catch (err) {
        console.warn("Cannot delete file:", filePath, err.message);
      }
    }

    await collection.deleteOne({ _id: new ObjectId(id) });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// --- PATCH: სერვისის განახლება ---
export async function PATCH(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("_id");
    if (!id) {
      return new Response(JSON.stringify({ error: "Missing _id" }), { status: 400 });
    }

    const updatedData = await req.json();
    const collection = await connectDB();

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "Service not found" }), { status: 404 });
    }

    const updatedService = await collection.findOne({ _id: new ObjectId(id) });
    return new Response(JSON.stringify(updatedService), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}