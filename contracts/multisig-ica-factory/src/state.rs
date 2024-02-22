//! This module defines the state storage of the Contract.

use cosmwasm_std::Addr;
use cw_storage_plus::{Item, Map};

pub use contract::State as ContractState;

/// The item used to store the state of the application.
pub const STATE: Item<ContractState> = Item::new("state");
/// The mapping of the multisig contract addresses to the `cw-ica-controller`
/// contract addresses that they own.
pub const MULTISIG_ICA: Map<&Addr, Addr> = Map::new("multisig_ica");
/// The mapping of the multisig contract addresses to the `creator`/`member(ToDo)`
/// multisig addresses that they own/member.
pub const CREATOR_MULTISIG: Map<&Addr, Vec<Addr>> = Map::new("creator_multisig");
/// The mapping of the `cw-ica-controller` contract addresses to the multisig
/// contract addresses that own them. This is the reverse of [`MULTISIG_ICA`].
pub const ICA_MULTISIG: Map<&Addr, Addr> = Map::new("ica_multisig");

mod contract {
    use cosmwasm_schema::schemars::JsonSchema;
    use cosmwasm_std::Addr;
    use cw_ica_controller::helpers::CwIcaControllerCode;

    /// State is the state of the contract.
    #[derive(serde::Serialize, serde::Deserialize, Clone, Debug, PartialEq, JsonSchema)]
    pub struct State {
        /// This is a wrapper around the ICA controller code id that
        /// provides some helper functions.
        pub cw_ica_controller_code: CwIcaControllerCode,
        /// This is the code id of the multisig contract that is used
        pub cw3_multisig_code_id: u64,

        /// store callbacks messages. For debugging
        pub callbacks: Vec<String>,

        /// store multisigs created
        pub multisigs: Vec<String>,

        ///proxy address
        pub proxy: Addr,
    }

    impl State {
        /// Creates a new state.
        pub const fn new(
            cw_ica_controller_code_id: u64,
            cw3_multisig_code_id: u64,
            proxy: Addr,
        ) -> Self {
            Self {
                cw_ica_controller_code: CwIcaControllerCode::new(cw_ica_controller_code_id),
                cw3_multisig_code_id,
                proxy,
                callbacks: vec![],
                multisigs: vec![],
            }
        }
    }
}
