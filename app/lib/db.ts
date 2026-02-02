import { MongoClient } from "mongodb";

const MONGOOSE_URI = process.env.MONGOOSE_URI as string;

let client: MongoClient;
let clientPromise: Promise<MongoClient>

if (!MONGOOSE_URI) {
  throw new Error("Please define MONGOOSE_URI in .env");
}

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGOOSE_URI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(MONGOOSE_URI);
  clientPromise = client.connect();
}

export default clientPromise
