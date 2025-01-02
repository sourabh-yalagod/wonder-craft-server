import { asycnHandler } from "../../utilities/asyncHandler.js";
import { uploadOnCloudinary } from "../../utilities/cloudinary.js";
import { io } from "../../../index.js";
import { connectDB } from "../../db/index.js";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import { clearDirectory } from "../../utilities/clearDirectory.js";

const imageConvert = asycnHandler(async (req, res) => {
  const user = req.user;

  const images = req.files;
  const { imageFormate, height, width } = req.body;
  console.log("req.body : ", req.body);

  const format = Array.isArray(imageFormate) ? imageFormate[0] : imageFormate;
  const imageHeight = Array.isArray(height) ? height[0] : height;
  const imageWidth = Array.isArray(width) ? width[0] : width;
  console.log("format : ", format);
  console.log("imageFormate : ", imageFormate);

  if (!images || images.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Images not found.",
    });
  }

  const scale =
    width && height
      ? `-vf scale=iw*${imageWidth[0] / 100}:ih*${imageHeight[0] / 100}`
      : null;
  const imgUrls = [];
  const processedImages = new Set();

  const promises = images.map((image) => {
    return new Promise((resolve, reject) => {
      const inputPath = image.path;

      console.log(`./public/${image.originalname.split(".")[0]}${format}`);

      const outputPath = `./public/${
        image?.originalname.split(".")[0]
      }${format}`; // Output file path

      ffmpeg(inputPath)
        .output(outputPath)
        .outputOptions([scale])
        .on("end", async () => {
          console.log(`Conversion finished: ${outputPath}`);
          try {
            const uploadImage = await uploadOnCloudinary(outputPath);
            console.log("Uploaded Image URL:", uploadImage.secure_url);

            if (uploadImage) {
              const imgObj = {
                name: uploadImage.original_filename,
                extension: uploadImage.format,
                url: uploadImage.secure_url,
              };

              imgUrls.push(imgObj);

              if (processedImages.has(imgObj.url)) {
                const db = await connectDB();
                if (user?.id) {
                  await db.query(
                    "INSERT INTO assets(user_id, images) VALUES($1, $2);",
                    [user?.id, uploadImage.secure_url]
                  );
                }
                processedImages.add(imgObj.url);
                io.emit("image:converted", { image: imgObj });
              }
            }
            fs.unlinkSync(inputPath);
            resolve();
          } catch (uploadError) {
            console.error(
              "Error uploading to Cloudinary:",
              uploadError.message
            );
            reject(uploadError);
          }
        })
        .on("error", (err) => {
          console.error("FFmpeg Error:", err.message);
          reject(err);
        })
        .run();
    });
  });

  await Promise.allSettled(promises);

  clearDirectory("public");

  return res.status(200).json({
    success: true,
    images: imgUrls.length,
    message: "Images processed and uploaded successfully.",
    data: imgUrls,
  });
});

export { imageConvert };
