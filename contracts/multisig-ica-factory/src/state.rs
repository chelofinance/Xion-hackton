//! This module defines the state storage of the Contract.

use cw_storage_plus::Item;

pub use contract::State as ContractState;

/// The item used to store the state of the application.
pub const STATE: Item<ContractState> = Item::new("state");

mod contract {
    use cosmwasm_schema::schemars::JsonSchema;
    use cw_ica_controller::helpers::CwIcaControllerCode;

    /// State is the state of the contract.
    #[derive(serde::Serialize, serde::Deserialize, Clone, Debug, PartialEq, JsonSchema)]
    pub struct State {
        /// This is a wrapper around the ICA controller code id that
        /// provides some helper functions.
        pub cw_ica_controller_code: CwIcaControllerCode,
        /// This is the code id of the multisig contract that is used
        pub cw3_multisig_code_id: u64,
    }

    impl State {
        /// Creates a new state.
        pub const fn new(cw_ica_controller_code_id: u64, cw3_multisig_code_id: u64) -> Self {
            Self {
                cw_ica_controller_code: CwIcaControllerCode::new(cw_ica_controller_code_id),
                cw3_multisig_code_id,
            }
        }
    }
}
