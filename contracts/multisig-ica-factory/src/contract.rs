//! This module handles the execution logic of the contract.

#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state;

// version info for migration info
const CONTRACT_NAME: &str = "multisig-ica-factory";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

/// Instantiates the contract.
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    // Set the contract version using the cw2 standard.
    cw2::set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    // Store the state of the contract.
    state::STATE.save(
        deps.storage,
        &state::ContractState::new(msg.cw_ica_controller_code_id, msg.cw3_multisig_code_id),
    )?;

    Ok(Response::default())
}

/// Handles the execution of the contract.
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::DeployMultisigIca {
            multisig_instantiate_msg,
            channel_open_init_options,
        } => execute::deploy_multisig_ica(
            deps,
            env,
            info,
            multisig_instantiate_msg,
            channel_open_init_options,
        ),
    }
}

/// Handles the query of the contract.
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(_deps: Deps, _env: Env, _msg: QueryMsg) -> StdResult<Binary> {
    unimplemented!()
}

mod execute {
    use cw_ica_controller::types::msg::options::ChannelOpenInitOptions;
    use multisig::msg::InstantiateMsg as MultisigInstantiateMsg;

    use super::*;

    pub fn deploy_multisig_ica(
        _deps: DepsMut,
        _env: Env,
        _info: MessageInfo,
        _multisig_instantiate_msg: MultisigInstantiateMsg,
        _channel_open_init_options: ChannelOpenInitOptions,
    ) -> Result<Response, ContractError> {
        todo!()
    }
}

#[cfg(test)]
mod tests {}
