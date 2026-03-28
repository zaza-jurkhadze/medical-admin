import { v2 as cloudinary } from "cloudinary";

// ENV ცვლადები (უკვე გაქვს .env-ში, სიახლეებისთვის იყენებდი)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
      });
    }

    // ფაილის buffer-ად გადაქცევა
    const buffer = Buffer.from(await file.arrayBuffer());

    // Cloudinary upload
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "services/icons", // შექმნის საქაღალდეს Cloudinary-ში
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return new Response(
      JSON.stringify({
        url: result.secure_url, // აი აქედან წამოიღებ სერვისისთვის
        public_id: result.public_id, // optional, წაშლისთვის დაგჭირდება
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
