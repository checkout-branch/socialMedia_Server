import { Request,Response } from "express";
import Tournament from "../../Models/tournamentModel";
import { HttpStatusCode } from "../../constants/constants";

 export const getTournament = async (req:Request, res:Response):Promise<any> =>  {
    const tournament = await Tournament.find()
    if(!tournament){
        return res.status(HttpStatusCode.NOT_FOUND).json({success:false,message:'Tournament not found',status:HttpStatusCode.NOT_FOUND})
    }
    res.status(HttpStatusCode.OK).json({success:true,message:'Get tournament lists',status:HttpStatusCode.OK, data:tournament})
 }

 export const createTournament = async (req: any, res: any) => {
  try {
    // Get user details from the request (assumes user is authenticated)
    const { name: userName, profileImage: userImage } = req.user;

    // Tournament data from the request body
    const {
      game,
      gameImage,
      description,
      totalSlots,
      entryFee,
      prizepool,
    } = req.body;

    // Create a new tournament document
    const newTournament = new Tournament({
      game,
      userName, // Set dynamically from the logged-in user
      userImage, // Set dynamically from the logged-in user
      gameImage,
      description,
      totalSlots,
      entryFee,
      prizepool,
    });

    // Save to the database
    await newTournament.save();

    res.status(201).json({ message: 'Tournament created successfully', tournament: newTournament });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create tournament',  });
  }
};
