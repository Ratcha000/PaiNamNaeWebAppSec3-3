const cloudinary = require('cloudinary').v2
const ApiError = require("./ApiError");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const uploadToCloudinary = (fileBuffer, folder, options = {}) => {
    return new Promise((resolve, reject) => {
        
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder || 'painamnae',
                resource_type: options.resource_type || "auto",
                ...(options.filename_override && { 
                    public_id: options.filename_override.replace(/\.[^.]*$/, '') 
                })
            },
            (error, result) => {
                if (error) {
                    console.error("❌ Cloudinary Upload Error:", error.message);
                    return reject(new ApiError(500, "Cloudinary upload failed."));
                }
                
                console.log('✅ Cloudinary upload result:', {
                    public_id: result.public_id,
                    secure_url: result.secure_url
                });
                
                // ✅ Return full result object (ไม่ใช่ { url, public_id })
                resolve({
                    secure_url: result.secure_url,
                    url: result.url,
                    public_id: result.public_id,
                    width: result.width,
                    height: result.height,
                    format: result.format
                });
            }
        );

        uploadStream.on('error', (error) => {
            console.error('❌ Stream error:', error.message);
            reject(new ApiError(500, "Upload stream failed."));
        });

        uploadStream.end(fileBuffer);
    });
};

const deleteFromCloudinary = (publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                console.error("❌ Cloudinary Delete Error:", error.message);
                return reject(new ApiError(500, "Cloudinary deletion failed."));
            }
            console.log('✅ Deleted from Cloudinary:', publicId);
            resolve(result);
        });
    });
};

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary,
};
//49