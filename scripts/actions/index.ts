import {Action} from "../types";
import store from "./store";
import execute from "./execute";
import propose_ica from "./propose_ica";
import propose_ica_wasm from "./propose_ica_wasm";
import create_channel from "./create_channel";
import migrate from "./migrate";
import instantiate from "./instantiate";
import query from "./query";

export const actions: Record<string, Action> = {
  store,
  migrate,
  execute,
  instantiate,
  query,
  propose_ica,
  create_channel,
  propose_ica_wasm,
};
