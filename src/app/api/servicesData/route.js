import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    const services = await collection.find({}).sort({ id: 1 }).toArray();
    return new Response(JSON.stringify(services), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// POST: ახალი სერვისის დამატება
export async function POST(req) {
  try {
    const data = await req.json();

    const collection = await connectDB();

    const lastService = await collection.find().sort({ id: -1 }).limit(1).toArray();
    const newId = lastService.length ? lastService[0].id + 1 : 1;

    const newService = {
      ...data,
      id: newId,
      serviceId: newId,
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

    const collection = await connectDB();
    const service = await collection.findOne({ _id: new ObjectId(id) });
    if (!service) return new Response(JSON.stringify({ error: "Service not found" }), { status: 404 });

    // თუ ახალი აიკონი და განსხვავებულია, წაშალე ძველი Cloudinary-დან
    if (service.publicId && data.publicId && service.publicId !== data.publicId) {
      try { await cloudinary.uploader.destroy(service.publicId); } 
      catch (err) { console.warn("Cannot delete Cloudinary file:", service.publicId, err.message); }
    }

  
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
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

    // Cloudinary აიკონის წაშლა თუ არსებობს
    if (service.publicId) {
      try { await cloudinary.uploader.destroy(service.publicId); } 
      catch (err) { console.warn("Cannot delete Cloudinary file:", service.publicId, err.message); }
    }

    await collection.deleteOne({ _id: new ObjectId(id) });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
