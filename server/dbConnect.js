import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect("mongodb+srv://mohdnuman198:Revoe@cluster0.6ci7u.mongodb.net/yourDatabaseName?retryWrites=true&w=majority&appName=Cluster0", {
    
    });
    console.log("Connected to mongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
connectDB();
