import { Request, Response } from "express"
import { Coin } from "../../Models/coinModel"
import { HttpStatusCode } from "../../constants/constants"
import { any } from "joi"

export const getCoin = async (req:Request,res:Response):Promise<any> => {
    const coins = await Coin.find()

    if(!coins){
        return res.status(404).json({success:false, message:'cannot get coins',status:HttpStatusCode.NOT_FOUND})
    }
    res.status(200).json({success:true,message:'get all coins',details:coins ,status:HttpStatusCode.OK})
}

export const getCoinById = async (req:Request,res:Response): Promise<any> =>{

    const {id} = req.params
    const coin = await Coin.findById(id)

    console.log(coin)

    if(!coin){
        console.log('erroror')
        return res.status(404).json({sucess:false,message:'coin not found',status:HttpStatusCode.NOT_FOUND})
        
    }

    res.status(200).json({success:true,message:'coin found by id', coin:coin, status:HttpStatusCode.OK})

}