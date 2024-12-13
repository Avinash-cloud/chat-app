import jwt from "jsonwebtoken";
import connectMongo from "@/lib/mongo"; // Assuming you are using MongoDB
import User from "@/models/User"; // Assuming you have a User model
import bcrypt from "bcryptjs";
// Middleware to verify JWT
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const handler = async (req, res) => {
  // Connect to the database before each operation
  await connectMongo();

  if (req.method === "GET") {
    const token = req.headers.authorization; // Extract the token

    console.log("verifying", token);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = decoded;
    console.log("verifying", decoded);

    try {
      // Use Mongoose's User model to find the user
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  } else if (req.method === "PUT") {
    const token = req.headers.authorization;
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = decoded;
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Use Mongoose's User model to update the user's data
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: { name, email, hashedPassword, role } },
         // Return the updated document
      );

      if (!updatedUser) {
        return res.status(400).json({ message: "No changes made" });
      }

      res
        .status(200)
        .json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  } else if (req.method === "DELETE") {
    const token = req.headers.authorization;
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = decoded;

    try {
      // Use Mongoose's User model to delete the user account
      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default handler;
