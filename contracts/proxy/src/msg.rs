use cosmwasm_std::Addr;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, JsonSchema)]
pub struct InstantiateMsg {}

#[derive(Serialize, Deserialize, JsonSchema)]
pub struct ExecuteMsg {
    pub contract_addr: Addr,
    pub payload: multisig::msg::ExecuteMsg,
}
