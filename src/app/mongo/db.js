import mongoose from "mongoose";

const connectionStr =
  process.env.CONNECT_STR || "mongodb://127.0.0.1:27017/marketdb";

async function connectToDatabase() {
  try {
    await mongoose.connect(connectionStr);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

export default connectToDatabase;
