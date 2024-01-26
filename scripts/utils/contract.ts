import fs from "fs";
import path from "path";

export const getContract = (relativePath: string) => {
  try {
    const absolutePath = path.resolve(__dirname, relativePath);
    const fileBuffer = fs.readFileSync(absolutePath);
    return new Uint8Array(fileBuffer);
  } catch (error) {
    console.error("Error reading the WASM file:", error);
    return null;
  }
};
