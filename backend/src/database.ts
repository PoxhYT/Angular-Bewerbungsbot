import { port, connection } from './constans';
import "reflect-metadata";

const database = connection;
import mongoose from 'mongoose';

async function connectToDatabase() {
    try {
        mongoose.connect(database);
        console.log(`Connected to database ${connection}`);
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = connectToDatabase;