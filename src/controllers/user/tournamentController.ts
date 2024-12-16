import { Request,Response } from "express";
import Tournament from "../../Models/tournamentModel";
import { HttpStatusCode } from "../../constants/constants";
import { date } from "joi";
import { User } from "../../Models/userModel";

 export const getTournament = async (req:Request, res:Response):Promise<any> =>  {
    const tournament = await Tournament.find()
    if(!tournament){
        return res.status(HttpStatusCode.NOT_FOUND).json({success:false,message:'Tournament not found',status:HttpStatusCode.NOT_FOUND})
    }
    res.status(HttpStatusCode.OK).json({success:true,message:'Get tournament lists',status:HttpStatusCode.OK, data:tournament})
 }


 export const getTournamentById = async (req:Request, res:Response):Promise<any> =>{
  const {id} = req.params
  const tournament = await Tournament.findById(id)
  console.log(tournament)
  if(!tournament){
    return res.status(HttpStatusCode.NOT_FOUND).json({success:false,message:'Tournament not found',status:HttpStatusCode.NOT_FOUND})
  }
  res.status(HttpStatusCode.OK).json({success:true,messsage:'Get the touurnament',status:HttpStatusCode.OK, data:tournament})
 }



export const createTournament = async (req: Request, res: Response):Promise<any> => {
  const {id} = req.params; // Get the userId from request params

  try {
    // Fetch user details from the database
    const user = await User.findById(id);
    if (!user) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: "User not found" });
    }

    // Extract userName and profileImage from the user document
    const { userName, profileImage: userImage } = user;

    // Tournament data from the request body
    const {
      tournamentName,
      game,
      entryFee,
      FirstPrize,
      secondPrize,
      thirdPrize,
      format,
      slots,
      description,
      // image, // The tournament image
    } = req.body;

    // Create a new tournament document
    const newTournament = new Tournament({
      tournamentName,
      game,
      userName, // Dynamically set from the user document
      // userImage, // Dynamically set from the user document
      entryFee,
      FirstPrize,
      secondPrize,
      thirdPrize,
      format,
      slots,
      description,
      // image,
    });

    // Save the tournament to the database
    await newTournament.save();

    // Add the tournament to the user's list of created tournaments
    user.tournamentCreate.push(newTournament._id);
    await user.save();

    res.status(HttpStatusCode.CREATED).json({ message: "Tournament created successfully", tournament: newTournament });
  } catch (error) {
    console.error(error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to create tournament" });
  }
};

 