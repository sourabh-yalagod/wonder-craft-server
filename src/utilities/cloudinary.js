import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
cloudinary.config({
  cloud_name: "daaqothd4",
  api_key: "979811982914146",
  api_secret: "Cnw4BnTjVSNH-AJmNgvD2W6KtFI",
});

export const uploadOnCloudinary = async (fileLink) => {
  console.log("fileLink : ",fileLink);
  
  try {
    const fileExtension = path.extname(fileLink).replace(".", "");
 
    if (!fileLink) return null;
    const response = await cloudinary.uploader.upload(fileLink, {
      resource_type: "auto",
      format: fileExtension,
    });
    fs.unlinkSync(fileLink);
    return response;
  } catch (error) {
    fs.unlinkSync(fileLink);
    return error;
  }
};

export const deleteFromCloudinary = async (file_public_id) => {

  try {
    const response = await cloudinary.uploader.destroy(file_public_id);
    return response;
  } catch (error) {
    console.log(
      "Error from deleting the resources from cloudinary....! : ",
      error
    );
  }
};
export const deleteAllImages = async () => {
  try {
    let nextCursor = null;

    do {
      // Fetch the list of images
      const result = await cloudinary.api.resources({
        type: "upload",
        next_cursor: nextCursor, // Pagination cursor
      });

      // Extract public_ids of images
      const publicIds = result.resources.map((image) => image.public_id);

      // Delete the images in bulk
      if (publicIds.length > 0) {
        const deleteResult = await cloudinary.api.delete_resources(publicIds);
        console.log(`Deleted ${publicIds.length} images:`, deleteResult);
      } else {
        console.log("No images found to delete.");
      }

      // Update the cursor for the next batch
      nextCursor = result.next_cursor;
    } while (nextCursor);

    console.log("All images have been deleted successfully.");
  } catch (error) {
    console.error("Error deleting images from Cloudinary:", error);
  }
};

export const deleteAllVideos = async () => {
  try {
    let nextCursor = null;

    do {
      // Fetch the list of videos
      const result = await cloudinary.api.resources({
        type: "upload",
        resource_type: "video", // Fetch only videos
        max_results: 100, // Maximum resources per page
        next_cursor: nextCursor, // Pagination cursor
      });

      // Extract public_ids of videos
      const publicIds = result.resources.map((video) => video.public_id);

      // Delete the videos in bulk
      if (publicIds.length > 0) {
        const deleteResult = await cloudinary.api.delete_resources(publicIds, {
          resource_type: "video", // Specify resource type as video
        });
        console.log(`Deleted ${publicIds.length} videos:`, deleteResult);
      } else {
        console.log("No videos found to delete.");
      }

      // Update the cursor for the next batch
      nextCursor = result.next_cursor;
    } while (nextCursor);

    console.log("All videos have been deleted successfully.");
  } catch (error) {
    console.error("Error deleting videos from Cloudinary:", error);
  }
};