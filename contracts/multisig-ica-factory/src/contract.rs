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
            salt,
        } => execute::deploy_multisig_ica(
            deps,
            env,
            info,
            multisig_instantiate_msg,
            channel_open_init_options,
            salt,
        ),
    }
}

/// Handles the query of the contract.
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(_deps: Deps, _env: Env, _msg: QueryMsg) -> StdResult<Binary> {
    unimplemented!()
}

mod execute {
    use crate::utils;
    use cosmwasm_std::to_json_binary;
    use cw_ica_controller::types::msg::options::ChannelOpenInitOptions;
    use multisig::msg::InstantiateMsg as MultisigInstantiateMsg;

    use super::*;

    pub fn deploy_multisig_ica(
        deps: DepsMut,
        env: Env,
        _info: MessageInfo,
        multisig_instantiate_msg: MultisigInstantiateMsg,
        channel_open_init_options: ChannelOpenInitOptions,
        salt: String,
    ) -> Result<Response, ContractError> {
        let state = state::STATE.load(deps.storage)?;

        let (multisig_init_cosmos_msg, multisig_addr) = utils::instantiate2::contract(
            deps.api,
            &deps.querier,
            &env,
            state.cw3_multisig_code_id,
            salt.clone(),
            format!("multisig-ica-{salt}"),
            Some(env.contract.address.to_string()),
            to_json_binary(&multisig_instantiate_msg)?,
        )?;

        let cw_ica_controller_instantiate_msg = cw_ica_controller::types::msg::InstantiateMsg {
            owner: Some(multisig_addr.to_string()),
            channel_open_init_options,
            send_callbacks_to: Some(env.contract.address.to_string()),
        };

        // This instantiate message will start an ICS-27 channel opening handshake with the
        // counterparty chain. When the handshake is complete, the `cw-ica-controller` will
        // send a callback to this contract which is handled by the `receive_ica_callback`
        // function.
        let (cw_ica_init_cosmos_msg, cw_ica_controller_address) =
            state.cw_ica_controller_code.instantiate2(
                deps.api,
                deps.querier, // should be &deps.querier, this will be fixed in `cw-ica-controller` v0.5.0
                &env,
                cw_ica_controller_instantiate_msg,
                format!("cw-ica-controller-{salt}"),
                Some(&multisig_addr),
                salt,
            )?;

        state::MULTISIG_ICA.save(deps.storage, &multisig_addr, &cw_ica_controller_address)?;
        state::ICA_MULTISIG.save(deps.storage, &cw_ica_controller_address, &multisig_addr)?;

        Ok(Response::new()
            .add_message(multisig_init_cosmos_msg)
            .add_message(cw_ica_init_cosmos_msg))
    }
}

#[cfg(test)]
mod tests {}
