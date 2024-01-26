import {Arguments} from "../types";
import fs from "fs";
import {isValidJSON} from "./file";

export const required = (args: Arguments, field: keyof Arguments) => {
  if (!args[field]) throw new Error(`Field ${field} is required by this action`);
};

export const getMessage = (msg: string) => {
  if (isValidJSON(msg)) {
    return JSON.parse(msg);
  } else {
    const messageFilePath = msg;
    const messageFileContent = fs.readFileSync(messageFilePath, "utf-8");

    try {
      const messageObject = JSON.parse(messageFileContent);
      return messageObject;
    } catch (error: any) {
      throw new Error(`Failed to parse JSON in the message file: ${error.message}`);
    }
  }
};
