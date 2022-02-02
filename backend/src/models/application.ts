import { Schema, model } from "mongoose";

const ApplicationSchema = new Schema({
  uid: { type: Number, required: true },
  status: { type: String, required: true },
  company: { type: String, required: true },
  sentAT: { type: String, required: true },
});

const application = model("Applications", ApplicationSchema);
export default application;