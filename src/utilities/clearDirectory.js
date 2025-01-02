import fs from "fs";
import path from "path";

export function clearDirectory(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file) => {
      const currentPath = path.join(directoryPath, file);
      if (fs.lstatSync(currentPath).isDirectory()) {
        clearDirectory(currentPath);
        fs.rmdirSync(currentPath); 
      } else {
        // Delete file
        fs.unlinkSync(currentPath);
      }
    });
  } else {
    console.log("Directory does not exist.");
  }
}

// Usage example
const directoryPath = "./path/to/your/directory";
clearDirectory(directoryPath);
