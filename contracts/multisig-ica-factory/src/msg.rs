//! # Messages
//!
//! This module defines the messages the contract receives.

use cosmwasm_schema::{cw_serde, QueryResponses};
use cw_ica_controller::{
    // this is a macro to insert `ReceiveIcaCallback` into the `ExecuteMsg`
    helpers::ica_callback_execute,
    types::msg::options::ChannelOpenInitOptions,
};

/// The message to instantiate this contract.
#[cw_serde]
pub struct InstantiateMsg {
    /// The code ID of the multisig contract.
    pub cw3_multisig_code_id: u64,
    /// The code ID of the `cw-ica-controller` contract.
    pub cw_ica_controller_code_id: u64,
}

/// The messages to execute this contract.
#[ica_callback_execute]
#[allow(missing_docs)] // added this since the macro is not documented, will be fixed in the next release
#[cw_serde]
pub enum ExecuteMsg {
    /// `DeployMultisigIca` deploys a new multisig contract and a new ICA controller contract.
    DeployMultisigIca {
        /// The message to instantiate the multisig contract.
        multisig_instantiate_msg: multisig::msg::InstantiateMsg,
        /// The options for the ICA channel to be opened.
        /// This is used to specify the underlying connection identifiers.
        channel_open_init_options: ChannelOpenInitOptions,
        /// This is the salt used to generate the address of the multisig contract
        /// and the ICA controller contract.
        salt: String,
    },
}

/// The messages to query this contract.
#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {}
