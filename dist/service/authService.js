"use strict";
// import bcrypt from 'bcrypt'
// import { User, UserI } from '../Models/userModel'
Object.defineProperty(exports, "__esModule", { value: true });
// export const registerUser = async (userName:string,email:string,password:string): Promise<{success:boolean,message:string,newUser?:UserI}> =>{
//     const userExist = await User.findOne({email})
//     if(userExist){
//         return {
//             success:false,
//             message:'user already exist'
//         }
//     }
//     const hashedPassword =await bcrypt.hash(password,10)
//     const newUser = new User({
//         userName,
//         email,
//         password:hashedPassword
//     })
//     console.log(newUser,'jsjdfkal')
//     await newUser.save()
//     return {
//         success:true,
//         message:'registration successfull',
//         newUser
//     }
// }
