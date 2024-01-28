//! The utility functions used by the contract

/// Utils to instantiate a contract using the instantiate2 pattern.
pub mod instantiate2 {
    use cosmwasm_std::{
        instantiate2_address, Addr, Api, Binary, CosmosMsg, Env, QuerierWrapper,
        WasmMsg,
    };

    use crate::ContractError;

    /// Instantiate a contract using the instantiate2 pattern.
    /// Returns the instantiate2 message and the contract address.
    #[allow(clippy::too_many_arguments)]
    pub fn contract(
        api: &dyn Api,
        querier: &QuerierWrapper,
        env: &Env,
        code_id: u64,
        salt: impl Into<String>,
        label: impl Into<String>,
        admin: Option<String>,
        instantiate_msg: Binary,
    ) -> Result<(CosmosMsg, Addr), ContractError> {
        let salt = salt.into();
        let code_info = querier.query_wasm_code_info(code_id)?;
        let creator_cannonical = api.addr_canonicalize(env.contract.address.as_str())?;

        let contract_addr = api.addr_humanize(&instantiate2_address(
            &code_info.checksum,
            &creator_cannonical,
            salt.as_bytes(),
        )?)?;

        let instantiate_msg = WasmMsg::Instantiate2 {
            code_id,
            msg: instantiate_msg,
            funds: vec![],
            label: label.into(),
            admin,
            salt: salt.as_bytes().into(),
        };

        Ok((instantiate_msg.into(), contract_addr))
    }
}
