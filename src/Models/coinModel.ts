import mongoose from "mongoose";

 interface CoinIf  {
    coins : number,
    prize : number
} 

const coinSchema =new mongoose.Schema<CoinIf>({
    coins :{
        type:Number,
    },
    prize:{
        type:Number
    }
})

export const Coin = mongoose.model('Coin',coinSchema)
