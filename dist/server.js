"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use(express_1.default.json());
mongoose_1.default.connect(process.env.MONGO_URI || '')
    .then(() => console.log('mongodb connected'))
    .catch((err) => console.log(err));
console.log(process.env.MONGO_URI);
app.use('/api/user', authRoute_1.default);
app.listen(port, () => {
    console.log('server running on port 3000');
});
