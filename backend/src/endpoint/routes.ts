import * as express from "express";
import { ListFormat } from "typescript";
import Application from "../models/application";
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

router.post("/sendUser", async (req, res) => {
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
  const { uid, userName, profilePicture } = req.body;

  let isUserAlreadyRegistered = await isUserRegistered(uid);

  if (!isUserAlreadyRegistered) {
    const user = new User({
      uid: uid,
      userName: userName,
      profilePicture: profilePicture,
    });
    user.save();
  }
});

async function isUserRegistered(uid: any) {
  const result = await User.find({ uid: uid });
  return result.length > 0;
}

async function applicationExists(uidFromUser: any, email: any) {
  const result = await Application.find({uidFromUser: uidFromUser}).find({emailFromCompany: email});
  return result.length > 0;
}

//Send application function

router.post("/sendApplication", async (req, res) => {
  const { uidFromUser, status, company, emailFromCompany, sentAT } = req.body;

  let applicationAlreadyExists = await applicationExists(
    uidFromUser,
    emailFromCompany
  );

  const application = new Application({
    uidFromUser: uidFromUser,
    status: status,
    company: company,
    emailFromCompany: emailFromCompany,
    sentAT: sentAT,
  });

  if (!applicationAlreadyExists) {
    await application.save();
    res.json(
      "Created application with the uid: " +
        uidFromUser +
        " and email: " +
        emailFromCompany
    );
  } else {
    res.json(
      "Application with the uid: " +
        uidFromUser +
        " and email: " +
        emailFromCompany +
        " already exists!"
    );
  }
});

//Get application function

router.get("/getApplicationsFromUser", async (req, res) => {
  const uidFromUser = req.query.id;
  const applications = await getApplicationsFromUser(uidFromUser);
  res.json(applications);
});

async function getApplicationsFromUser(uidFromUser: any) {
  const result = await Application.find({ uidFromUser: uidFromUser });
  return result;
}

//Update application function
router.put("/updateApplicationFromUser", async (req, res) => {
  const { emailFromCompany, uidFromUser, status } = req.body;
  const filter = {
    emailFromCompany: emailFromCompany,
    uidFromUser: uidFromUser,
  };
  const update = { status: status };

  let applicationAlreadyExists = await applicationExists(
    uidFromUser,
    emailFromCompany
  );

  let result = await Application.findOneAndUpdate(filter, update);
  res.json(result);
});

//Delete application function
router.delete("/deleteApplicationFromUser", async (req, res) => {
  const email = req.query.emailFromCompany;
  const uid = req.query.uidFromUser;

  const doc = await Application.findOneAndDelete(
    { emailFromCompany: email },
    { uidFromUser: uid }
  );
  res.json(doc);
});

export { router };
