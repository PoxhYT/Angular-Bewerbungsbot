import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  uid: { type: String, required: true },
  userName: { type: String, required: true },
  profilePicture: { type: String, required: true },
  message: { type: String, required: true },
  applications: { type: Array, required: true },
  documents: { type: Array, required: true }
});

const user = model("Users", UserSchema);
export default user;
