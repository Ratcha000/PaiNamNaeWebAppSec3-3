const cloudinary = require('cloudinary').v2
const ApiError = require("./ApiError");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const uploadToCloudinary = (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: "auto",
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    
                    return reject(new ApiError(500, "Cloudinary upload failed."));
                }
                
                resolve({ url: result.secure_url, public_id: result.public_id });
            }
        );

        uploadStream.end(fileBuffer);
    });
};

const deleteFromCloudinary = (publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                console.error("Cloudinary Delete Error:", error);
                return reject(new ApiError(500, "Cloudinary deletion failed."));
            }
            resolve(result);
        });
    });
};

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary,
};