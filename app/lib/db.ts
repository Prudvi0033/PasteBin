import mongoose from "mongoose"

const MONGOOSE_URI = process.env.MONGOOSE_URI as string

if (!MONGOOSE_URI) {
  throw new Error("Please define MONGOOSE_URI in .env");
}

declare global {
  var mongoose : {
    connection: typeof import('mongoose') | null;
    promise: Promise<typeof import('mongoose')> | null;
  }
}

let cached = global.mongoose;

if(!cached){
  cached = global.mongoose = {connection: null, promise: null}
}

export async function connectDb() {
  if(cached.connection) return cached.connection;

  if(!cached.promise) {
    cached.promise = mongoose.connect(MONGOOSE_URI)
  }

  cached.connection = await cached.promise;
  return cached.connection;
}
