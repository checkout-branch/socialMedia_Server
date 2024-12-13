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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoinById = exports.getCoin = void 0;
const coinModel_1 = require("../../Models/coinModel");
const constants_1 = require("../../constants/constants");
const getCoin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const coins = yield coinModel_1.Coin.find();
    if (!coins) {
        return res.status(404).json({ success: false, message: 'cannot get coins', status: constants_1.HttpStatusCode.NOT_FOUND });
    }
    res.status(200).json({ success: true, message: 'get all coins', details: coins, status: constants_1.HttpStatusCode.OK });
});
exports.getCoin = getCoin;
const getCoinById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const coin = yield coinModel_1.Coin.findById(id);
    console.log(coin);
    if (!coin) {
        console.log('erroror');
        return res.status(404).json({ sucess: false, message: 'coin not found', status: constants_1.HttpStatusCode.NOT_FOUND });
    }
    res.status(200).json({ success: true, message: 'coin found by id', coin: coin, status: constants_1.HttpStatusCode.OK });
});
exports.getCoinById = getCoinById;
