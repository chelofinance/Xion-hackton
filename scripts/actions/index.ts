import {Action} from "../types";
import store from "./store";
import execute from "./execute";
import instantiate from "./instantiate";
import query from "./query";
import ica_send_tokens from "./ica_send_tokens";
import ica_get_message from "./ica_get_message";
import ica_send_messages from "./ica_send_messages";
import ica_register from "./ica_register";
import migrate from "./migrate";

export const actions: Record<string, Action> = {
  store,
  execute,
  instantiate,
  query,
  ica_send_tokens,
  ica_get_message,
  ica_send_messages,
  ica_register,
  migrate,
};
