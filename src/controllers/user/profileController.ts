import { Request,Response } from "express"
import { User } from "../../Models/userModel"
import { HttpStatusCode } from "../../constants/constants"

export const getAllUser = async(req:Request, res:Response) => {
    const users =await User.find()
    if(!users){
        res.status(HttpStatusCode.NOT_FOUND).json({status:HttpStatusCode.NOT_FOUND, message:'dont have users'})
    }
    res.status(HttpStatusCode.OK).json({success:true, status:HttpStatusCode.OK, data:users})
}

export const getUserById = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const user = await User.findById(id).populate('posts');

    if (!user) {
        return res.status(HttpStatusCode.NOT_FOUND).json({status:HttpStatusCode.NOT_FOUND, message: 'User not found' });
    }
    return res.json(user);
};