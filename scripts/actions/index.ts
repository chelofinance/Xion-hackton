import {Action} from "../types";
import store from "./store";
import execute from "./execute";
import propose_ica from "./propose_ica";
import create_channel from "./create_channel";
//import injective_execute from "./injective_execute";
import instantiate from "./instantiate";
import query from "./query";

export const actions: Record<string, Action> = {
  store,
  execute,
  instantiate,
  query,
  propose_ica,
  create_channel,
};
