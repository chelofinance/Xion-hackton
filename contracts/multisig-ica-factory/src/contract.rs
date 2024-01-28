//! This module handles the execution logic of the contract.

#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
// use cw2::set_contract_version;

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
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    unimplemented!()
}

/// Handles the query of the contract.
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(_deps: Deps, _env: Env, _msg: QueryMsg) -> StdResult<Binary> {
    unimplemented!()
}

#[cfg(test)]
mod tests {}
