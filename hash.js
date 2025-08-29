// hash.js
import bcrypt from "bcrypt";

async function generateHash() {
  const password = "123456"; // შენი ტექსტური პაროლი
  const hash = await bcrypt.hash(password, 10);
  console.log("Hashed password:", hash);
}

generateHash();