import connectMongo from "@/lib/mongo";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, password, role } = req.body;

    await connectMongo();

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
