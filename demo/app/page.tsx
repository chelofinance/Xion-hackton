"use client";
import { useEffect, useState } from "react";
import {
  Abstraxion,
  useAbstraxionAccount,
  useAbstraxionSigningClient,
  useModal,
} from "@burnt-labs/abstraxion";
import { Button } from "@burnt-labs/ui";
import Contracts from "@/config/contracts.config";
import {
  createIcaMultisig, createProposal, executeProposal, getBalance,
  getIcaAccountAddress, getIcaControllerAddress, getProposalList,
  voteProposal, addMember, getAbstractAddress, getMemberList
} from "./utils";


const contracts = Contracts["xion-testnet"];

export default function Page(): JSX.Element {
  const { data: account, isConnected } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();

  const [_, setIsOpen] = useModal();
  const [loading, setLoading] = useState(false);
  const [abstractAddress, setAbstractAddress] = useState<string>("");
  const [memberAddresses, setMemberAddresses] = useState<string[]>([]);
  const [icaMultisigAddress, setIcaMultisigAddress] = useState<string>("");
  const [icaControllerAddress, setIcaControllerAddress] = useState<string>("");
  const [channelInitInfo, setChannelInitInfo] = useState<any>({});
  const [icaAccountAddress, setIcaAccountAddress] = useState<string>("");
  const [proposals, setProposals] = useState<any[]>([]);
  const [proposalJson, setProposalJson] = useState(
    JSON.stringify({
      typeUrl: "/cosmos.bank.v1beta1.MsgSend",
      value: {
        fromAddress: icaAccountAddress,
        toAddress: icaAccountAddress, // To the same address for testing
        amount: [
          {
            denom: "inj",
            amount: "12345",
          },
        ],
      },
    })
  );

  const [newMemberAddress, setNewMemberAddress] = useState<string>("");
  const [feeAmount, setFeeAmount] = useState<string>("1000000000000000");

  useEffect(() => {
    async function fetchData() {
      if (client) {
        console.log("client", client);
        console.log("isConnected", isConnected);

        const abstract_addr = await getAbstractAddress(client, account);
        setAbstractAddress(abstract_addr);
        setMemberAddresses(abstract_addr ? [abstract_addr] : []);

        // For testing, let's hardcode the multisig. Ideally this should be the last created one.
        // setIcaMultisigAddress(contracts.hardcodedIcaMultisig.address); // ToDo use local storage
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  useEffect(() => {
    async function fetchData() {
      if (icaMultisigAddress) {
        const ica_controller_address = await getIcaControllerAddress(client, icaMultisigAddress);
        setIcaControllerAddress(ica_controller_address);
        getProposalListHandler();
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [icaMultisigAddress]);

  useEffect(() => {
    if (icaControllerAddress) {
      getIcaAccountAddressHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [icaControllerAddress]);

  async function getIcaAccountAddressHandler() {
    setLoading(true);
    const ica_account_address = await getIcaAccountAddress(client, icaControllerAddress);
    console.log("ica_account_address", ica_account_address);
    setIcaAccountAddress(ica_account_address)
    setLoading(false);
  }


  async function createIcaMultisigHandler() {
    setLoading(true);
    const ica_multisig_address_response = await createIcaMultisig(client, account, contracts.icaFactory.address, memberAddresses);
    // if (ica_multisig_address_response?.ica_multisig_address) {
    //   // To avoid Unauthorized error, we need to add the proxy as a member to the new multisig
    //   // The reason to do this is that AbstraxionProvider needs a hardcoded contract address to grant execution permission.
    //   // ToDo: This can be fixed by removing the proxy contract when Xion Abstraxion allow executing new contract addresses
    //   const response = await addMember(client, account, ica_multisig_address_response.ica_multisig_address, contracts.proxyMultisig.address, "1")
    //   console.log("response", response);
    // }
    setIcaMultisigAddress(ica_multisig_address_response?.ica_multisig_address || "");
    setChannelInitInfo(ica_multisig_address_response?.channel_init_info || {});
    setLoading(false);
    // logoutAbstraxion();
  }

  async function createProposalHandler() {
    setLoading(true);

    const response = await createProposal(
      client,
      account,
      JSON.parse(proposalJson),
      icaMultisigAddress,
      icaControllerAddress,
      icaAccountAddress
    );
    console.log("response", response);
    await getProposalListHandler();

    setLoading(false);
  }

  async function getMembersListHandler() {
    setLoading(true);
    const response = await getMemberList(client, icaMultisigAddress);
    console.log("response", response);
    setLoading(false);
  }

  async function voteProposalHandler(proposalId: any, vote: string) {
    setLoading(true);
    const response = await voteProposal(
      client,
      account,
      icaMultisigAddress,
      proposalId,
      vote
    );
    console.log("response", response);
    setLoading(false);
  }

  async function getMultisigList() {
    // ToDO - We need an indexer for this. Better to save on local storage
  }

  async function getProposalListHandler() {
    setLoading(true);
    const response = await getProposalList(client, icaMultisigAddress);
    console.log("response", response);
    setProposals(response.proposals);
    setLoading(false);
  }

  async function logoutAbstraxion() {
    localStorage.removeItem("xion-authz-temp-account");
    localStorage.removeItem("xion-authz-granter-account");
    // reload page
    window.location.reload();
  }

  async function executeProposalHandler(proposalId: any) {
    setLoading(true);
    const response = await executeProposal(
      client,
      account,
      icaMultisigAddress,
      proposalId
    );
    console.log("response", response);
    await getProposalListHandler();
    setLoading(false);
  }

  async function getBalanceHandler() {
    setLoading(true);
    const response = await getBalance(client, abstractAddress);
    const response2 = await getBalance(client, icaMultisigAddress);
    console.log(abstractAddress, response);
    console.log(icaMultisigAddress, response2)
    setLoading(false);
  }

  async function addMemberHandler() {
    setLoading(true);

    const response = await addMember(client, account, icaMultisigAddress, newMemberAddress, feeAmount)

    console.log("response", response);
    setNewMemberAddress("");
    setLoading(false);
  }

  return (
    <main className="container">
      <h1>MULTISIG EXAMPLE</h1>
      <Button fullWidth onClick={() => setIsOpen(true)} structure="base">
        {account.bech32Address ? <div>VIEW ACCOUNT</div> : "CONNECT"}
      </Button>
      {client && (
        <div>
          <label htmlFor="memberAddresses">Member Addresses</label>
          {memberAddresses.map((address, index) => (
            <div key={index} className="input-group">
              <input
                type="text"
                value={address}
                onChange={(e) => {
                  const updatedAddresses = [...memberAddresses];
                  updatedAddresses[index] = e.target.value;
                  setMemberAddresses(updatedAddresses);
                }}
                className="text-input"
              />
              <button
                type="button"
                onClick={() => {
                  const updatedAddresses = [...memberAddresses];
                  updatedAddresses.splice(index, 1);
                  setMemberAddresses(updatedAddresses);
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <Button
            onClick={() => {
              setMemberAddresses([...memberAddresses, ""]);
            }}
          >
            Add New
          </Button>

          <Button
            disabled={loading}
            fullWidth
            onClick={createIcaMultisigHandler}
            structure="base"
          >
            {loading ? "LOADING..." : "Create Multisig"}
          </Button>
        </div>
      )}
      {abstractAddress && (
        <Button
          disabled={loading}
          fullWidth
          onClick={getBalanceHandler}
          structure="base"
        >
          {loading ? "LOADING..." : "Get Balances"}
        </Button>
      )}
      {icaMultisigAddress && (
        <Button
          disabled={loading}
          fullWidth
          onClick={getMembersListHandler}
          structure="base"
        >
          {loading ? "LOADING..." : "Get Members"}
        </Button>
      )}
      {icaMultisigAddress && (
        <div>
          <div>
            <label htmlFor="proposal">Proposal</label>
            <textarea
              value={proposalJson}
              onChange={(e) => {
                setProposalJson(e.target.value);
              }}
              style={{
                color: "black",
                width: "100%",
                height: "100%",
              }}
            />
            <Button
              disabled={loading}
              fullWidth
              onClick={createProposalHandler}
              structure="base"
            >
              {loading ? "LOADING..." : "Create Proposal"}
            </Button>
          </div>
          <div>
            <br />
            <h3>Add New Member</h3>
            Address:
            <input type="text" name="new_member_address"
              value={newMemberAddress}
              onChange={(e) => {
                setNewMemberAddress(e.target.value);
              }}
              style={{
                color: "black",
              }}
            />
            <br />
            Fee: <br /><input type="text" name="fee_amount"
              style={{
                color: "black",
              }}
              value={feeAmount}
              onChange={(e) => {
                setFeeAmount(e.target.value);
              }} /> uxion <br />
            <br />
            <Button
              disabled={loading}
              fullWidth
              onClick={addMemberHandler}
              structure="base"
            >
              {loading ? "LOADING..." : "Add Member"}
            </Button>
          </div>
        </div>
      )}
      {abstractAddress && (
        <div className="info-container">
          <div className="info-content">
            <p className="info-description">
              <span className="info-bold">Granter Addresses</span>
            </p>
            <span className="info-value">{abstractAddress}</span>
          </div>
        </div>
      )}
      {icaMultisigAddress && (
        <div className="info-container">
          <div className="info-content">
            <p className="info-description">
              <span className="info-bold">Multisig Addresses</span>
            </p>
            <span className="info-value">{icaMultisigAddress}</span>
          </div>
        </div>
      )}
      {icaControllerAddress && (
        <div className="info-container">
          <div className="info-content">
            <p className="info-description">
              <span className="info-bold">ICA Controller Addresses</span>
            </p>
            <span className="info-value">{icaControllerAddress}</span>
          </div>
        </div>
      )}
      {icaControllerAddress && !icaAccountAddress && Object.keys(channelInitInfo).length > 0 && (
        <div className="info-container">
          <div className="info-content">
            <p className="info-description">
              <span className="info-bold">Run this command</span>
            </p>
            <span className="info-value">{"--------------------------------------------------------------------"}</span>
            <button className="info-value" onClick={(e: any) => {
              navigator.clipboard.writeText(e.target.textContent)
              alert("Command copied to clipboard. Please execute it in your terminal.")
            }}>{"hermes tx chan-open-try --dst-chain injective-888 --src-chain xion-testnet-1 --dst-connection "}{contracts.channelOpenInitOptions.counterpartyConnectionId}{" --dst-port "}{channelInitInfo?.destination_port}{" --src-port "}{channelInitInfo?.src_port_id}{" --src-channel "}{channelInitInfo.src_channel_id}</button>
            <span className="info-value">{"--------------------------------------------------------------------"}</span>
            <button className="info-value" onClick={(e: any) => {
              navigator.clipboard.writeText(e.target.textContent)
              alert("Command copied to clipboard. Please execute it in your terminal.")
            }}>
              {"hermes tx chan-open-ack --dst-chain injective-888 --src-chain xion-testnet-1 --dst-connection "}{contracts.channelOpenInitOptions.counterpartyConnectionId}{" --dst-port "}{channelInitInfo?.destination_port}{" --src-port "}{channelInitInfo?.src_port_id}{" --src-channel "}{channelInitInfo.src_channel_id}{" --dst-channel "}{channelInitInfo.destination_channel_id}
            </button>
            <span className="info-value">{"--------------------------------------------------------------------"}</span>
            <button className="info-value" onClick={(e: any) => {
              navigator.clipboard.writeText(e.target.textContent)
              alert("Command copied to clipboard. Please execute it in your terminal.")
            }}>
              {"hermes tx chan-open-confirm --dst-chain injective-888 --src-chain xion-testnet-1 --dst-connection "}{contracts.channelOpenInitOptions.counterpartyConnectionId}{" --dst-port "}{channelInitInfo?.destination_port}{" --src-port "}{channelInitInfo?.src_port_id}{" --src-channel "}{channelInitInfo.src_channel_id}{" --dst-channel "}{channelInitInfo.destination_channel_id}
            </button>
            <span className="info-value">{"--------------------------------------------------------------------"}</span>
          </div>
        </div>
      )}
      {icaControllerAddress && (
        <div className="info-container">
          <div className="info-content">
            <p className="info-description">
              <span className="info-bold">ICA Account Addresses</span>
            </p>
            {icaAccountAddress ? (
              <span className="info-value">{icaAccountAddress}</span>
            ) : (
              <button disabled={loading} onClick={getIcaAccountAddressHandler}>
                {loading ? "LOADING..." : "Refetch ICA Account Address"}
              </button>)}
          </div>
        </div>
      )
      }
      {
        proposals.length > 0 && (
          <table>
            <caption>Proposal Details</caption>
            <thead>
              <tr>
                <th>ID</th>
                <th>Description</th>
                <th>Status</th>
                <th>Vote</th>
                <th>Execute</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((proposal, index) => (
                <tr key={index}>
                  <td>{proposal.id}</td>
                  <td>{proposal.description}</td>
                  <td>{proposal.status}</td>
                  <td>
                    <button
                      disabled={loading}
                      onClick={() => voteProposalHandler(proposal.id, "yes")}
                    >
                      {loading ? "LOADING..." : "Yes"}
                    </button>
                    <button
                      disabled={loading}
                      onClick={() => voteProposalHandler(proposal.id, "no")}
                    >
                      {loading ? "LOADING..." : "No"}
                    </button>
                  </td>
                  <td>
                    <button
                      disabled={loading}
                      onClick={() => executeProposalHandler(proposal.id)}
                    >
                      {loading ? "LOADING..." : "Execute"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
      <Abstraxion onClose={() => setIsOpen(false)} />
    </main >
  );
}
