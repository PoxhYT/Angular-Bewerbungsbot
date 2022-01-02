require("dotenv").config();

import "reflect-metadata";

import { port, connection } from './constans';
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { router } from "./endpoint/routes";

const connectDatase = require('./database');

async function main() {
  connectDatase();   

  const app = express();

  app.use(helmet());
  app.use(express.json());
  app.use(cors());
  app.use(router);

  app.listen(port, () => {
      console.log(`🚀 Server ready at http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.log(err);
});