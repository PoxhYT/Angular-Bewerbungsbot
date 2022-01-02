import express, { json } from "express";

const router = express.Router();

router.get("/", async (req, res) => {
    res.json({message: "HELLO"})
});

export { router };