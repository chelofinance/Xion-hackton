use cosmwasm_schema::cw_serde;
use cosmwasm_std::Addr;
use cosmwasm_std::Coin;

#[cw_serde]
pub struct InstantiateMsg {}

#[cw_serde]
pub enum Payload {
    MultisigExecuteMsg(multisig::msg::ExecuteMsg),
    SendToken { funds: Vec<Coin> },
}

#[cw_serde]
pub struct ExecuteMsg {
    pub contract_addr: Addr,
    pub payload: Payload,
}
