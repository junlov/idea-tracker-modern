import mongoose from "mongoose";

// Once we connect to the database once, we'll store that connection
// and reuse it so that we don't have to connect to the database on every request.
let cachedDb: any = null;

export async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  // Connect to our MongoDB database hosted on MongoDB Atlas
  mongoose.set("strictQuery", false);

  // Specify which database we want to use
  cachedDb = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return cachedDb;
}
