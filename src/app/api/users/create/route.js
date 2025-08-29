import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(req, res) {
  try {
    const { email, password, role, adminToken } = await req.json();

    // ვამოწმებთ adminToken-ს (თუ საჭირო, JWT-ით)
    if (!adminToken) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      role,
      isActive: true,
    });

    return new Response(JSON.stringify({ success: true, userId: result.insertedId }));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}