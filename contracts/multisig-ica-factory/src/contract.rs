//! This module handles the execution logic of the contract.

#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_json_binary, Addr, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult,
};

use crate::error::ContractError;
use crate::msg::{
    CallbacksResponses, ExecuteMsg, ICAControllerResponse, InstantiateMsg, MultisigByCreator,
    MultisigsResponses, QueryMsg,
};
use crate::state;

// version info for migration info
const CONTRACT_NAME: &str = "multisig-ica-factory";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

/// Instantiates the contract.
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    cw_ownable::initialize_owner(deps.storage, deps.api, Some(&info.sender.to_string()))?;
    cw2::set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    // Store the state of the contract.
    state::STATE.save(
        deps.storage,
        &state::ContractState::new(
            msg.cw_ica_controller_code_id,
            msg.cw3_multisig_code_id,
            msg.proxy,
        ),
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
        ExecuteMsg::ReceiveIcaCallback(callback_msg) => {
            execute::receive_ica_callback(deps, env, info, callback_msg)
        }
        ExecuteMsg::UpdateState {
            cw3_multisig_code_id,
            cw_ica_controller_code_id,
            proxy,
        } => execute::update_state(
            deps,
            env,
            info,
            cw3_multisig_code_id,
            cw_ica_controller_code_id,
            proxy,
        ),
        ExecuteMsg::UpdateOwnership(action) => {
            cw_ownable::update_ownership(deps, &env.block, &info.sender, action)?;
            Ok(Response::default())
        }
    }
}

/// Handles the query of the contract.
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(_deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::QueryCallbacks() => to_json_binary(&query_callbacks(_deps)?),
        QueryMsg::QueryMultisigs() => to_json_binary(&query_multisigs(_deps)?),
        QueryMsg::QueryControllerByMultisig(multisig) => {
            to_json_binary(&query_controller_by_multisig(_deps, multisig)?)
        }
        QueryMsg::QueryMultisigByCreator(creator) => {
            to_json_binary(&query_multisig_by_creator(_deps, creator)?)
        }
        QueryMsg::Ownership {} => to_json_binary(&cw_ownable::get_ownership(_deps.storage)?),
    }
}

fn query_callbacks(deps: Deps) -> StdResult<CallbacksResponses> {
    let state = state::STATE.load(deps.storage)?;

    Ok(CallbacksResponses {
        list: state.callbacks,
    })
}

fn query_multisigs(deps: Deps) -> StdResult<MultisigsResponses> {
    let state = state::STATE.load(deps.storage)?;

    Ok(MultisigsResponses {
        multisigs: state.multisigs,
    })
}

fn query_controller_by_multisig(deps: Deps, multisig: Addr) -> StdResult<ICAControllerResponse> {
    let controller = state::MULTISIG_ICA.load(deps.storage, &multisig)?;

    Ok(ICAControllerResponse {
        controller: controller.to_string(),
    })
}

fn query_multisig_by_creator(deps: Deps, creator: Addr) -> StdResult<MultisigByCreator> {
    let multisigs = state::CREATOR_MULTISIG.load(deps.storage, &creator)?;
    let res_controllers: Result<Vec<Addr>, _> = multisigs
        .iter()
        .map(|sig| state::MULTISIG_ICA.load(deps.storage, sig))
        .collect();
    let controllers = res_controllers.unwrap();

    Ok(MultisigByCreator {
        controllers,
        multisigs,
    })
}

mod execute {
    use crate::utils;
    use cosmwasm_std::to_json_binary;
    use cw_ica_controller::{
        helpers::CwIcaControllerCode,
        types::{callbacks::IcaControllerCallbackMsg, msg::options::ChannelOpenInitOptions},
    };
    use multisig::msg::InstantiateMsg as MultisigInstantiateMsg;

    use super::*;

    pub fn deploy_multisig_ica(
        deps: DepsMut,
        env: Env,
        info: MessageInfo,
        mut multisig_instantiate_msg: MultisigInstantiateMsg,
        channel_open_init_options: ChannelOpenInitOptions,
        salt: String,
    ) -> Result<Response, ContractError> {
        let state = state::STATE.load(deps.storage)?;
        multisig_instantiate_msg.proxy = Some(state.proxy);

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

        let mut state = state::STATE.load(deps.storage)?;
        let mut created_by = state::CREATOR_MULTISIG.load(deps.storage, &info.sender)?;

        state.multisigs.push(multisig_addr.to_string());
        created_by.push(multisig_addr.clone());

        state::MULTISIG_ICA.save(deps.storage, &multisig_addr, &cw_ica_controller_address)?;
        state::CREATOR_MULTISIG.save(deps.storage, &info.sender, &created_by)?;
        state::ICA_MULTISIG.save(deps.storage, &cw_ica_controller_address, &multisig_addr)?;
        state::STATE.save(deps.storage, &state)?;

        Ok(Response::new()
            .add_message(multisig_init_cosmos_msg)
            .add_message(cw_ica_init_cosmos_msg))
    }

    pub fn receive_ica_callback(
        deps: DepsMut,
        _env: Env,
        info: MessageInfo,
        callback_msg: IcaControllerCallbackMsg,
    ) -> Result<Response, ContractError> {
        if !state::ICA_MULTISIG.has(deps.storage, &info.sender) {
            return Err(ContractError::Unauthorized);
        }

        let mut state = state::STATE.load(deps.storage)?;
        let mut callbacks = state.callbacks;

        callbacks
            .push(serde_json_wasm::to_string(&callback_msg).unwrap_or("error parsing".to_string()));
        state.callbacks = callbacks;

        // TODO: handle the callback messages?
        match callback_msg {
            IcaControllerCallbackMsg::OnChannelOpenAckCallback { .. } => {}
            IcaControllerCallbackMsg::OnAcknowledgementPacketCallback { .. } => {}
            IcaControllerCallbackMsg::OnTimeoutPacketCallback { .. } => {}
        }

        state::STATE.save(deps.storage, &state)?;

        Ok(Response::default())
    }

    pub fn update_state(
        deps: DepsMut,
        _env: Env,
        info: MessageInfo,
        multisig_code_id: Option<u64>,
        controller_code_id: Option<u64>,
        proxy_addr: Option<Addr>,
    ) -> Result<Response, ContractError> {
        cw_ownable::assert_owner(deps.storage, &info.sender)?;

        let mut state = state::STATE.load(deps.storage)?;

        if let Some(multisig) = multisig_code_id {
            state.cw3_multisig_code_id = multisig;
        }
        if let Some(controller) = controller_code_id {
            state.cw_ica_controller_code = CwIcaControllerCode::new(controller);
        }
        if let Some(proxy) = proxy_addr {
            state.proxy = proxy
        }

        state::STATE.save(deps.storage, &state)?;
        Ok(Response::default())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::{
        from_binary,
        testing::{mock_dependencies, mock_env, mock_info},
    };
    use cw_ownable::Ownership;

    #[test]
    fn proper_initialization() {
        let mut deps = mock_dependencies();

        let msg = InstantiateMsg {
            cw_ica_controller_code_id: 123,
            cw3_multisig_code_id: 456,
            proxy: Addr::unchecked("proxy"),
        };
        let info = mock_info("owner", &[]);
        let env = mock_env();

        // Instantiate the contract
        let res = instantiate(deps.as_mut(), env.clone(), info.clone(), msg).unwrap();
        let owner_query = query(deps.as_ref(), env.clone(), QueryMsg::Ownership {}).unwrap();
        let ownership: Ownership<String> = from_binary(&owner_query).unwrap();

        assert_eq!(0, res.messages.len());
        assert_eq!(ownership.owner.is_some(), true);
        assert_eq!(ownership.owner.unwrap(), info.sender.to_string());
    }

    #[test]
    fn update_state_only_by_owner() {
        let mut deps = mock_dependencies();
        let msg = InstantiateMsg {
            cw_ica_controller_code_id: 123,
            cw3_multisig_code_id: 456,
            proxy: Addr::unchecked("proxy"),
        };
        let owner_info = mock_info("owner", &[]);
        let env = mock_env();

        // Instantiate the contract with "owner" as the owner
        instantiate(deps.as_mut(), env.clone(), owner_info, msg).unwrap();

        // Attempt to update state as the owner
        let owner_info = mock_info("owner", &[]);
        let update_msg = ExecuteMsg::UpdateState {
            cw3_multisig_code_id: Some(789),
            cw_ica_controller_code_id: Some(321),
            proxy: Some(Addr::unchecked("new_proxy")),
        };

        let update_res = execute(deps.as_mut(), env.clone(), owner_info, update_msg);
        assert!(update_res.is_ok());

        // Attempt to update state as a non-owner
        let non_owner_info = mock_info("non_owner", &[]);
        let update_msg = ExecuteMsg::UpdateState {
            cw3_multisig_code_id: Some(111),
            cw_ica_controller_code_id: Some(222),
            proxy: Some(Addr::unchecked("another_proxy")),
        };

        let update_res = execute(deps.as_mut(), env, non_owner_info, update_msg);
        assert!(update_res.is_err());
    }
}
