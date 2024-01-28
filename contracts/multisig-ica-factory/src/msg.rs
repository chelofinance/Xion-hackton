//! # Messages
//!
//! This module defines the messages the contract receives.

use cosmwasm_schema::{cw_serde, QueryResponses};

/// The message to instantiate this contract.
#[cw_serde]
pub struct InstantiateMsg {
    /// The code ID of the multisig contract.
    pub multisig_code_id: u64,
    /// The code ID of the `cw-ica-controller` contract.
    pub cw_ica_controller_code_id: u64,
}

/// The messages to execute this contract.
#[cw_serde]
pub enum ExecuteMsg {}

/// The messages to query this contract.
#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {}
