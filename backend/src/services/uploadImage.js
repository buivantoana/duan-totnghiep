require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET
});

// Hàm upload ảnh
const uploadImage = async (fileBuffer) => {
   return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "uploads" }, (error, result) => {
         if (error) reject(error);
         else resolve(result);
      }).end(fileBuffer);
   });
};

//  Hàm xóa ảnh
const deleteImage = async (publicId) => {
   return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
         if (error) reject(error);
         else resolve(result);
      });
   });
};

module.exports = { uploadImage, deleteImage };
