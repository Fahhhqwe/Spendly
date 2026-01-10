"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = Number(process.env.PORT) || 4080;
app.get('/', (req, res) => {
    res.send('Spendly is running');
});
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
