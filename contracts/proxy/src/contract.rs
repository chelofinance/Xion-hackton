use crate::error::ContractError;
use crate::msg::ExecuteMsg;
use crate::msg::InstantiateMsg;
use crate::msg::Payload;
use cosmwasm_std::to_json_binary;
use cosmwasm_std::BankMsg;
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
    let cosmsg = match &mut msg.payload {
        Payload::MultisigExecuteMsg(multisig::msg::ExecuteMsg::AddMember { sender, .. })
        | Payload::MultisigExecuteMsg(multisig::msg::ExecuteMsg::Propose { sender, .. })
        | Payload::MultisigExecuteMsg(multisig::msg::ExecuteMsg::Vote { sender, .. })
        | Payload::MultisigExecuteMsg(multisig::msg::ExecuteMsg::Execute { sender, .. })
        | Payload::MultisigExecuteMsg(multisig::msg::ExecuteMsg::Close { sender, .. }) => {
            *sender = Some(info.sender.clone());
            CosmosMsg::Wasm(WasmMsg::Execute {
                contract_addr: msg.contract_addr.to_string(),
                msg: to_json_binary(&msg.payload)?,
                funds: vec![],
            })
        }

        Payload::SendToken { funds } => CosmosMsg::Bank(BankMsg::Send {
            to_address: msg.contract_addr.to_string(),
            amount: funds.clone(),
        }),
    };

    Ok(Response::new()
        .add_attribute("action", "proxied")
        .add_message(cosmsg))
}
