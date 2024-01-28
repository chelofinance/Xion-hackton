//! This module defines [`ContractError`].

use cosmwasm_std::StdError;
use thiserror::Error;

/// `ContractError` is the error type returned by contract's functions.
#[allow(missing_docs)]
#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized,

    #[error("error when computing the instantiate2 address: {0}")]
    Instantiate2AddressError(#[from] cosmwasm_std::Instantiate2AddressError),
}
