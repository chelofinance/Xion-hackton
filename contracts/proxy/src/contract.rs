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
    info: MessageInfo,
    mut msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    // Update the sender field to the actual sender
    match &mut msg.payload {
        multisig::msg::ExecuteMsg::AddMember { sender, .. }
        | multisig::msg::ExecuteMsg::Propose { sender, .. }
        | multisig::msg::ExecuteMsg::Vote { sender, .. }
        | multisig::msg::ExecuteMsg::Execute { sender, .. }
        | multisig::msg::ExecuteMsg::Close { sender, .. } => {
            *sender = Some(info.sender.clone());
        }
    }

    let cosmsg = CosmosMsg::Wasm(WasmMsg::Execute {
        contract_addr: msg.contract_addr.to_string(),
        msg: to_json_binary(&msg.payload)?,
        funds: vec![],
    });

    Ok(Response::new()
        .add_attribute("action", "proxied")
        .add_message(cosmsg))
}
