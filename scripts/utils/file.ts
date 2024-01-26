import fs from "fs";
import path from "path";

export function isValidJSON(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}

// Function to write a JSON file from an object
export function writeJSONFile(filePath: string, data: object) {
  const fullPath = path.join(process.cwd(), filePath); // Use process.cwd() to get the project's root directory
  const jsonString = JSON.stringify(data, null, 2); // Indent with 2 spaces for readability

  fs.writeFileSync(fullPath, jsonString, "utf-8");
  console.log(`JSON file '${filePath}' has been written.`);
}
