use crate::error::ContractError;
use crate::msg::ExecuteMsg;
use crate::msg::InstantiateMsg;
use cosmwasm_std::to_json_binary;
use cosmwasm_std::{entry_point, CosmosMsg, DepsMut, Env, MessageInfo, Response, WasmMsg};

#[entry_point]
pub fn instantiate(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    Ok(Response::default())
}

#[entry_point]
pub fn execute(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    let cosmsg = CosmosMsg::Wasm(WasmMsg::Execute {
        contract_addr: msg.contract_addr.to_string(),
        msg: to_json_binary(&msg.payload)?,
        funds: vec![],
    });

    Ok(Response::new()
        .add_attribute("action", "proxied")
        .add_message(cosmsg))
}
