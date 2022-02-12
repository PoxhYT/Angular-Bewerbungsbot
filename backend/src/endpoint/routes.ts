import * as express from "express";
const fetch = require("node-fetch")
import Application from "../models/application";
import User from "./../models/user";
import * as fs from 'fs'


const router = express.Router();
const app = express();

router.use(express.urlencoded({extended: true, parameterLimit: 10000000000, limit: "500mb"}));
router.use(express.json())


router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

async function isUserRegistered(uid: any) {
  const result = await User.find({ uid: uid });
  return result.length > 0;
}

router.post("/register", async (req, res) => {
  const { uid, userName, profilePicture } = req.body;  

  let isUserAlreadyRegistered = await isUserRegistered(uid);

  if (!isUserAlreadyRegistered) {
    const user = new User({
      uid: uid,
      userName: userName,
      profilePicture: profilePicture,
      message: "Type your message",
      applications: [],
      documents: [],
    });
    user.save();
    res.json("USER CREATED!");
  } else {
    res.json("USER ALREADY EXISTS!");
  }
});

router.get("/applications", async (req, res) => {
  const uid = req.query.id;
  const user = await User.find({ uid: uid });

  if (user != null) {
    const applications = user[0].applications;
    res.json(applications);
  } else {
    res.json("USER WITH ID: " + uid + " COULD NOT BE FOUND");
  }
});

router.post("/download", async (req, res) => {
  const { base64 } = req.body 
  var matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  const buffer = Buffer.from(matches[2], 'base64');

  const data = {
    bufferData: buffer,
    type: matches[1]
  }

  res.json(data);
});

async function applicationExists(uidFromUser: any, email: any) {
  const result = await Application.find({ uidFromUser: uidFromUser }).find({
    emailFromCompany: email,
  });
  return result.length > 0;
}

router.post("/sendApplication", async (req, res) => {
  const { uid, fileName, bufferContent, company } = req.body
  const user = await User.find({ uid: uid });
  const date = new Date().toString();
  
  if (user != null) {
    let applications: [] = user[0].applications;
    let list = Array();
    
    const application = {
      uid: uid,
      fileName: fileName,
      file: bufferContent,
      company: company,
      sentAT: date
    }

    list = applications

    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      console.log(element.fileName);
    }

    list.push(application);
    
    const filter = {
      uid: uid
    };
    const update = { applications: list };
    await User.findOneAndUpdate(filter, update);
    res.json("Uploaded " + fileName)
  } else {
    res.json("USER WITH ID: " + uid + " COULD NOT BE FOUND");
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
