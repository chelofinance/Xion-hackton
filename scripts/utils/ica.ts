import {defaultRegistryTypes} from "@cosmjs/stargate";
import {wasmTypes} from "@cosmjs/cosmwasm-stargate";

export const getMessage = (msg: {typeUrl: string; value: Object}) => {
  const {typeUrl, value} = msg;
  const allTypes = [...defaultRegistryTypes, ...wasmTypes];
  const encoder = allTypes.find((type) => type[0] === typeUrl);

  if (!encoder) throw new Error(`Message type ${typeUrl} not found`);

  const any = encoder[1].encode(value).finish();
  return {
    type_url: typeUrl,
    value: Buffer.from(any).toString("base64"),
  };
};
