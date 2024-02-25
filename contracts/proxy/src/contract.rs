use crate::error::ContractError;
use cosmwasm_schema::cw_serde;
use cosmwasm_std::to_json_binary;
use cosmwasm_std::Addr;
use cosmwasm_std::BankMsg;
use cosmwasm_std::Coin;
use cosmwasm_std::{entry_point, CosmosMsg, DepsMut, Env, MessageInfo, Response, WasmMsg};

#[cw_serde]
pub struct InstantiateMsg {}

#[cw_serde]
pub enum Payload {
    MultisigExecuteMsg(multisig::msg::ExecuteMsg),
    SendToken { funds: Vec<Coin> },
}

#[cw_serde]
pub struct ExecuteMsg {
    pub contract_addr: Addr,
    pub payload: Payload,
}

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
    let cosmsg = match &mut msg.payload {
        Payload::MultisigExecuteMsg(exec_msg) => match exec_msg {
            multisig::msg::ExecuteMsg::AddMember { sender, .. }
            | multisig::msg::ExecuteMsg::Propose { sender, .. }
            | multisig::msg::ExecuteMsg::Vote { sender, .. }
            | multisig::msg::ExecuteMsg::Execute { sender, .. }
            | multisig::msg::ExecuteMsg::Close { sender, .. } => {
                *sender = Some(info.sender.clone());
                CosmosMsg::Wasm(WasmMsg::Execute {
                    contract_addr: msg.contract_addr.to_string(),
                    msg: to_json_binary(exec_msg)?,
                    funds: vec![],
                })
            }
        },

        Payload::SendToken { funds } => CosmosMsg::Bank(BankMsg::Send {
            to_address: msg.contract_addr.to_string(),
            amount: funds.clone(),
        }),
    };

    Ok(Response::new()
        .add_attribute("action", "proxied")
        .add_message(cosmsg))
}
