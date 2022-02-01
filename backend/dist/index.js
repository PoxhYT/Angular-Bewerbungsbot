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
require("dotenv").config();
require("reflect-metadata");
const constans_1 = require("./constans");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./endpoint/routes");
const connectDatase = require('./database');
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        connectDatase();
        const app = (0, express_1.default)();
        app.use((0, helmet_1.default)());
        app.use(express_1.default.json());
        app.use((0, cors_1.default)());
        app.use(routes_1.router);
        app.listen(constans_1.port, () => {
            console.log(`🚀 Server ready at http://localhost:${constans_1.port}`);
        });
    });
}
main().catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map