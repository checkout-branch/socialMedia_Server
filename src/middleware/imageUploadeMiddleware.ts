// import cloudinary from 'cloudinary'
// import multer from 'multer'
// import dotenv from 'dotenv'

// dotenv.config()

// cloudinary.v2.config({
//     cloud_name:process.env.CLOUD_KEY,
//     api_key:process.env.CLOUD_API_KEY,
//     api_secret:process.env.CLOUD_API_SECRET
// })

// const storage = multer.diskStorage({})

// const upload = multer({
//     storage,
//     limits:{fileSize:2000000000}
// })

//  export const uploadImage = (req,res,next)=>{

//     upload.single('image')(req,res,async(err)=>{
//         if(err){
//             console.log(err)
//            return res.status(404).json({message:"File upload failed",err})
           
//         }

//         if(req.file){
//             try {
//                 const stream = await cloudinary.v2.uploader.upload(req.file.path)
//                 req.cloudinaryImageUrl = stream.secure_url
//                 next()
//             } catch (error) {
//                 return res.status(500).json({message:"Cloudinary upload failed",err}) 
//             }
//         }else{
//             res.status(200).json({message:'No file uploaded'})
//             next()
//         }
       
//     })
// }
