import * as express from "express";
import User from "./../models/user";

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await User.find();
  console.log(result);
  res.json({ message: "HELLO" });
});

router.get("/applications/:userName", async (req, res) => {
  let user = await User.find({ userName: req.params.userName });
  res.send(user);
});

router.post("/sendApplication", async (req, res) => {
  const { userName, profilePicture, documents } = req.body;
  const user = new User({
    userName: userName,
    profilePicture: profilePicture,
    documents: documents,
  });

  const user_response = await user.save();
  console.log(user_response);
  res.json(user_response);
});

router.post("/register", async (req, res) => {
  const { uid, userName, profilePicture, documents } = req.body;
  
  let isUserAlreadyRegistered = await isUserRegistered(uid);

  if (!isUserAlreadyRegistered) {
    const user = new User({
      uid: uid,
      userName: userName,
      profilePicture: profilePicture,
      documents: documents,
    });
    user.save();
  }
});

async function isUserRegistered(uid: any) {
  const result = await User.find({uid: uid});
  return result.length > 0;
}

//functions for application management

router.post("/sendApplication", async (req, res) => {
  const { uid, status, company, sentAT } = req.body;
  const user = new User({
    userName: userName,
    profilePicture: profilePicture,
    documents: documents,
  });

  const user_response = await user.save();
  console.log(user_response);
  res.json(user_response);
});

export { router };
