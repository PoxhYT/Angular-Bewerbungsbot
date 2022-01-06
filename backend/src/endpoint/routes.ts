import express, { json } from "express";
import { isBinaryExpression } from "typescript";
import User from "./../models/User";

const router = express.Router();

router.get("/", async (req, res) => {
    const result = await User.find();
    console.log(result);
    res.json({message: "HELLO"})
});

router.get("/applications/:userName", async (req, res) => {
    let user = await User.find({userName: req.params.userName});
    res.send(user);
});

router.post('/sendApplication', async (req, res) => {
    const { userName, profilePicture, documents} = req.body;
    const user = new User({
        userName: userName,
        profilePicture: profilePicture,
        documents: documents
    });

    const user_response = await user.save();
    console.log(user_response);
    res.json(user_response);
})

export { router };