import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL!, {
        dbName:process.env.MONGO_DB ?? "test"
    });

    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "MongoDB connection error:"));
    db.once("open", () => {
      console.log("Connected to MongoDB");
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("unable  to connect to mongodb", error);
  }
};

export { connectDb };