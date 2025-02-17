const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const streamifier = require("streamifier");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  timeout: 240000,
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(fileBuffer, fileName) {
  let retries = 3;

  while (retries > 0) {
    try {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", public_id: fileName },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        // Pipe the buffer into the upload stream
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
      });
      console.log("result", result);
      return result;
    } catch (error) {
      console.error("Cloudinary Upload Error Details: ", error);

      if (error.name === "TimeoutError" && retries > 0) {
        retries -= 1;
        console.log(`Retrying... Attempts left: ${retries}`);
        continue;
      }

      throw new Error("Cloudinary Upload Failed");
    }
  }
}

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

module.exports = { upload, imageUploadUtil };
