import {Arguments} from "../types";

export const required = (args: Arguments, field: keyof Arguments) => {
  if (!args[field]) throw new Error(`Field ${field} is required by this action`);
};

