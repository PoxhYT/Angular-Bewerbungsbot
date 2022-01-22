require("dotenv").config();

import "reflect-metadata";

import { port, connection } from "./constans";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { router } from "./endpoint/routes";
const serverless = require("serverless-http");

const connectDatase = require("./database");
const app = express();

async function main() {
  connectDatase();

  app.use(helmet());
  app.use(express.json());
  const corsOptions = {
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  };

  app.use(cors(corsOptions));
  app.use(router);
}

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  module.exports.handler = serverless(app);
} else {
  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.log(err);
});
