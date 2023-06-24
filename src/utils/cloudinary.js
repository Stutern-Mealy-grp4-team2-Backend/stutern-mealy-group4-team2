import cloudinary from "cloudinary";
// import {config} from "../config/index.js"
// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });

//   const cloudinaryUploading = async (fileToUploads) => {

//   }

// Upload an image to Cloudinary
const uploadImage = async () => {
    try {
      const result = await cloudinary.uploader.upload('path/to/image.jpg');
      console.log(result);
      // Store the result URL or public ID in your database
    } catch (error) {
      // Handle the upload error
      console.error(error);
    }
};
  
uploadImage();