import { port, connection } from "./constans";
import "reflect-metadata";

const database = connection;
import { connect } from "mongoose";

async function connectToDatabase() {
  try {
    connect(database as string);
    console.log(`Connected to database ${connection}`);
  } catch (error) {
    console.error((error as any).message);
  }
}

module.exports = connectToDatabase;
