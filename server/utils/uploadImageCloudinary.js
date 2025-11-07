import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const uploadImageCloudinary = async (image) => {
  try {
    if (!image) {
      throw new Error("No image provided");
    }

    const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());

    const uploadImage = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "grocart" }, (error, uploadResult) => {
          if (error) {
            return reject(error);
          }
          return resolve(uploadResult);
        })
        .end(buffer);
    });

    if (!uploadImage?.url) {
      throw new Error("Upload failed - no URL received");
    }

    return uploadImage;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error; // Re-throw to be handled by the controller
  }
};

export default uploadImageCloudinary;
