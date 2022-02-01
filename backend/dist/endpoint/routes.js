"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("./../models/User"));
const router = express_1.default.Router();
exports.router = router;
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield User_1.default.find();
    console.log(result);
    res.json({ message: "HELLO" });
}));
router.post('/sendApplication', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, profilePicture, documents } = req.body;
    const user = new User_1.default({
        userName: userName,
        profilePicture: profilePicture,
        documents: documents
    });
    const user_response = yield user.save();
    res.json(user_response);
}));
//# sourceMappingURL=routes.js.map