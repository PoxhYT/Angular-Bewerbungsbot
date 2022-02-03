import { Schema, model } from "mongoose";

const ApplicationSchema = new Schema({
  uidFromUser: { type: String, required: true },
  status: { type: String, required: true },
  company: { type: String, required: true },
  emailFromCompany: { type: String, required: true },
  sentAT: { type: String, required: true },
});

const application = model("Applications", ApplicationSchema);
export default application;