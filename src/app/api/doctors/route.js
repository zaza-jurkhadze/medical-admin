import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import path from "path";
import fs from "fs/promises";
import { ObjectId } from "mongodb";

// GET: ყველა ექიმი ან სლაგით
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slugId = searchParams.get("slugId");
    const doctorSlug = searchParams.get("doctorSlug");

    const client = await clientPromise;
    const db = client.db("medical");

    if (doctorSlug) {
      const doctor = await db.collection("doctors").findOne({ doctorSlug });
      if (!doctor)
        return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
      return NextResponse.json(doctor);
    }

    const query = slugId ? { slugId } : {};
    const doctors = await db.collection("doctors").find(query).toArray();
    return NextResponse.json(doctors);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: ერთი ან რამდენიმე ექიმის დამატება
export async function POST(req) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("medical");

    if (Array.isArray(body)) {
      const result = await db.collection("doctors").insertMany(body);
      const savedDoctors = await db
        .collection("doctors")
        .find({ _id: { $in: Object.values(result.insertedIds) } })
        .toArray();
      return NextResponse.json(savedDoctors);
    }

    const result = await db.collection("doctors").insertOne(body);
    const savedDoctor = await db.collection("doctors").findOne({ _id: result.insertedId });
    return NextResponse.json(savedDoctor);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT: ექიმის ედიტირება
export async function PUT(req) {
  try {
    const body = await req.json();
    if (!body._id) return NextResponse.json({ error: "Missing _id" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("medical");

    const doctorId = new ObjectId(body._id);
    const existingDoctor = await db.collection("doctors").findOne({ _id: doctorId });
    if (!existingDoctor) return NextResponse.json({ error: "Doctor not found" }, { status: 404 });

    // თუ სურათი შეიცვალა და ძველი სურათი არ არის default, წავშალოთ
    if (body.image && existingDoctor.image && existingDoctor.image !== "/img/doctors/default.jpg" && body.image !== existingDoctor.image) {
      const imagePath = path.join(process.cwd(), "public", existingDoctor.image);
      try { await fs.unlink(imagePath); } catch (err) { console.warn(err.message); }
    }

    const updateData = { ...body };
    delete updateData._id;

    await db.collection("doctors").updateOne({ _id: doctorId }, { $set: updateData });
    const updatedDoctor = await db.collection("doctors").findOne({ _id: doctorId });
    return NextResponse.json(updatedDoctor);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: ექიმის წაშლა
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("_id");
    if (!_id) return NextResponse.json({ error: "Missing _id" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("medical");
    const doctor = await db.collection("doctors").findOne({ _id: new ObjectId(_id) });
    if (!doctor) return NextResponse.json({ error: "Doctor not found" }, { status: 404 });

    await db.collection("doctors").deleteOne({ _id: new ObjectId(_id) });

    // სურათის წაშლა თუ არ არის default
    if (doctor.image && doctor.image !== "/img/doctors/default.jpg") {
      const imagePath = path.join(process.cwd(), "public", doctor.image);
      try { await fs.unlink(imagePath); } catch (err) { console.warn(err.message); }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
