use cosmwasm_std::StdError;
use thiserror::Error;

#[allow(missing_docs)]
#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized,
}
