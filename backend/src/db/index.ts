import { connect } from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

async function connectDB() {
  await connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.4vhb0.mongodb.net/kn-multi?retryWrites=true&w=majority`
  );
  return;
}

export { connectDB };