import { Request,Response } from "express";
import Tournament from "../../Models/tournamentModel";
import { HttpStatusCode } from "../../constants/constants";
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



 export const createTournament = async (req: Request|any, res: Response): Promise<any> => {
  const { id } = req.params; // Get the userId from request params

  try {
      // Fetch user details from the database
      const user = await User.findById(id);
      if (!user) {
          return res.status(HttpStatusCode.NOT_FOUND).json({ message: "User not found" });
      }

      // Extract userName and profileImage from the user document
      const { userName, profileImage } = user;

      // Tournament data from the request body
      const {
          tournamentName,
          game,
          entryFee,
          firstPrize,
          secondPrize,
          thirdPrize,
          format,
          slots,
          description,
      } = req.body;

      // Get the image URL from the middleware
      const image = req.cloudinaryImageUrl;

      // Create a new tournament document
      const newTournament = new Tournament({
          tournamentName,
          game,
          userName, // Dynamically set from the user document
          profileImage, // Dynamically set from the user document
          entryFee,
          firstPrize,
          secondPrize,
          thirdPrize,
          format,
          slots,
          description,
          image // Add the Cloudinary URL
      });

      // Save the tournament to the database
      await newTournament.save();

      // Add the tournament to the user's list of created tournaments
      user.tournamentCreate.push(newTournament._id);
      await user.save();

      res.status(HttpStatusCode.CREATED).json({
          message: "Tournament created successfully",
          tournament: newTournament,
      });
  } catch (error) {
      console.error(error);
      res
          .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
          .json({ message: "Failed to create tournament" });
  }
};
 