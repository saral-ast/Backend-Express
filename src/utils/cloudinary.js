import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_KEY_SECRET,
  });
const uploadOnCloudinary = async (filePath) => {
    try {
   
        if (!filePath) return null;
        const response =await cloudinary.uploader.upload(filePath,
        {
            resource_type: "auto",
        })
        //file is uploaded to cloudinary
        // console.log("File uploaded to cloudinary",response.url)
        filePath && fs.unlinkSync(filePath);// remove file from local storage
        return response;
    } catch (error) {
        console.error(error);
        fs.unlinkSync(filePath); //remove file from local storage
        return null;
        
    }
}


export { uploadOnCloudinary };