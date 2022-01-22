const serverless = require("serverless-http");

import * as bodyParser from "body-parser";
import * as express from "express";

require("dotenv").config();

import "reflect-metadata";

import { port, connection } from "./constans";
const helmet = require("helmet");
import * as cors from "cors";
import { router } from "./endpoint/routes";

const connectDatase = require("./database");

const app = express();
const appname = "app";

connectDatase();

app.use(helmet());
app.use(express.json());
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(router);
app.use(`/.netlify/functions/${appname}`, router);

const isProd = process.env.NODE_ENV === "production";
console.log("Is prod: " + isProd);

module.exports.handler = serverless(app);
export { app };
