import {Action} from "../types";
import store from "./store";
import execute from "./execute";
//import injective_execute from "./injective_execute";
import instantiate from "./instantiate";
import query from "./query";

export const actions: Record<string, Action> = {
  store,
  execute,
  instantiate,
  query,
  //injective_execute,
};
