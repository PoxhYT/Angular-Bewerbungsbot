import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  uid: { type: String, required: true },
  userName: { type: String, required: true },
  profilePicture: { type: String, required: true },
  documents: { type: Array<Object>() },
});

const user = model("Users", UserSchema);
export default user;
