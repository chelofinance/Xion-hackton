"use client";
import { useEffect, useState } from "react";
import { Abstraxion, useAbstraxionAccount, useAbstraxionSigningClient, useModal } from "@burnt-labs/abstraxion";
import { Button } from "@burnt-labs/ui";
import type { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import Contracts from "@/config/contracts.config";
import { v4 as uuidv4 } from 'uuid';

const contracts = Contracts["xion-testnet"];

export default function Page(): JSX.Element {
  const { data: account, isConnected } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();

  const [_, setIsOpen] = useModal();
  const [loading, setLoading] = useState(false);
  const [instantiateResult, setInstantiateResult] = useState<ExecuteResult | undefined>(undefined);
  const [memberAddresses, setMemberAddresses] = useState<string[]>(['xion1gh5hrkta3nze3yvut7u5507lxtje0ryz65zpzw']);
  const [icaMultisigAddress, setIcaMultisigAddress] = useState<string>("");
  const [icaControllerAddress, setIcaControllerAddress] = useState<string>("");
  const [icaAccountAddress, setIcaAccountAddress] = useState<string>("");
  const [proposalId, setProposalId] = useState<string>("");

  const blockExplorerUrl = `https://explorer.burnt.com/xion-testnet-1/tx/${instantiateResult?.transactionHash}`;

  useEffect(() => {
    if (client) {
      console.log("client", client);
    }
  }, [client]);

  async function getContractState(ica_controller_address: string) {
    const contract_state = await client?.queryContractSmart(ica_controller_address, { get_contract_state: {} });
    console.log("contract_state", contract_state);

    const ica_account_address = contract_state?.contract_state?.address;
    setIcaAccountAddress(ica_account_address ? ica_account_address : "");
    return contract_state;
  }

  async function createIcaMultisig() {
    setLoading(true);

    const voters = memberAddresses.map((address) => ({ addr: address, weight: 1 }));

    const msg = {
      deploy_multisig_ica: {
        multisig_instantiate_msg: {
          voters,
          threshold: {
            absolute_count: {
              weight: 1,
            },
          },
          max_voting_period: {
            time: 36000,
          }
        },
        channel_open_init_options: {
          connection_id: "connection-39",
          counterparty_connection_id: "connection-207"
        },
        salt: uuidv4()
      }
    };

    try {
      const instantiateResponse = await client?.execute(
        account.bech32Address,
        contracts.icaFactory.address,
        msg,
        "auto",
      );
      console.log("instantiateResponse", instantiateResponse);
      setInstantiateResult(instantiateResponse);

      const instantiate_events = instantiateResponse?.events.filter(
        (e: any) => e.type === "instantiate"
      );

      const ica_multisig_address = instantiate_events
        ?.find((e) => e.attributes.find(attr => attr.key === "code_id" && attr.value === "73"))
        ?.attributes.find(attr => attr.key === "_contract_address")?.value;
      console.log("ica_multisig_address:", ica_multisig_address);
      setIcaMultisigAddress(ica_multisig_address ? ica_multisig_address : "");


      const ica_controller_address = instantiate_events
        ?.find((e) => e.attributes.find(attr => attr.key === "code_id" && attr.value === "59"))
        ?.attributes.find(attr => attr.key === "_contract_address")?.value;
      console.log("ica_controller_address:", ica_controller_address);
      setIcaControllerAddress(ica_controller_address ? ica_controller_address : "");

      if (ica_controller_address) {
        const contract_state = await getContractState(ica_controller_address);
        alert(`Contract State: ${JSON.stringify(contract_state)}`)
      } else {
        alert("No ICA Controller Address found");
      }


    } catch (error) {
      console.log("error", error);
      alert(error);
    } finally {
      setLoading(false);
    }
  }

  async function createProposal() {
    setLoading(true);

    const msg = {
      propose: {
        title: "Test Proposal",
        description: "This is a test proposal",
        msgs: [], // ToDo: Add messages
      }
    };

    try {
      const executionResponse = await client?.execute(
        account.bech32Address,
        icaMultisigAddress,
        msg,
        "auto",
      );
      console.log("executionResponse", executionResponse);

      const proposal_id = executionResponse?.events.find(
        (e: any) => e.type === "wasm"
      )?.attributes.find(
        (a: any) => a.key === "proposal_id"
      )?.value;
      console.log("proposal_id", proposal_id);
      setProposalId(proposal_id ? proposal_id : "");

    } catch (error) {
      console.log("error", error);
      alert(error);
    } finally {
      setLoading(false);
    }
  }

  async function voteProposal() {
    setLoading(true);

    const msg = {
      vote: {
        proposal_id: proposalId,
        vote: {}, // ToDo: Add vote type
      }
    };

    try {
      const executionResponse = await client?.execute(
        account.bech32Address,
        icaMultisigAddress,
        msg,
        "auto",
      );
      console.log("executionResponse", executionResponse);

    } catch (error) {
      console.log("error", error);
      alert(error);
    } finally {
      setLoading(false);
    }
  }

  async function executeProposal() {
    setLoading(true);

    const msg = {
      execute: {
        proposal_id: proposalId
      }
    };

    try {
      const executionResponse = await client?.execute(
        account.bech32Address,
        icaMultisigAddress,
        msg,
        "auto",
      );
      console.log("executionResponse", executionResponse);
    } catch (error) {
      console.log("error", error);
      alert(error);
    } finally {
      setLoading(false);
    }
  }

  async function getBalances() {
    setLoading(true);

    try {
      const accountBalance = await client?.getBalance(
        account.bech32Address,
        "uxion"
      );
      console.log("accountBalance", accountBalance);

      alert(
        `Account Balance: ${accountBalance?.amount} ${accountBalance?.denom}`
      );
    } catch (error) {
      console.log("error", error);
      alert(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>MULTISIG EXAMPLE</h1>
      <Button fullWidth onClick={() => setIsOpen(true)} structure="base">
        {account.bech32Address ? <div>VIEW ACCOUNT</div> : "CONNECT"}
      </Button>
      {client && (
        <form onSubmit={(e) => {
          e.preventDefault();
          void createIcaMultisig();
        }} className="form">
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
              <button type="button" onClick={() => {
                const updatedAddresses = [...memberAddresses];
                updatedAddresses.splice(index, 1);
                setMemberAddresses(updatedAddresses);
              }}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => {
            setMemberAddresses([...memberAddresses, ""]);
          }}>
            Add New
          </button>
          <Button
            disabled={loading}
            fullWidth
            type="submit"
            structure="base">
            {loading ? "LOADING..." : "Create Multisig"}
          </Button>
        </form>
      )}
      {client && (
        <Button
          disabled={loading}
          fullWidth
          onClick={getBalances}
          structure="base"
        >
          {loading ? "LOADING..." : "Get Balances"}
        </Button>
      )}
      {client && (
        <Button
          disabled={loading}
          fullWidth
          onClick={createProposal}
          structure="base"
        >
          {loading ? "LOADING..." : "Create Proposal"}
        </Button>
      )}
      {client && (
        <Button
          disabled={loading}
          fullWidth
          onClick={voteProposal}
          structure="base"
        >
          {loading ? "LOADING..." : "Vote Proposal"}
        </Button>
      )}
      {client && (
        <Button
          disabled={loading}
          fullWidth
          onClick={executeProposal}
          structure="base"
        >
          {loading ? "LOADING..." : "Execute Proposal"}
        </Button>
      )}
      <Abstraxion onClose={() => setIsOpen(false)} />

      {account && (
        <div className="info-container">
          <div className="info-header">
            <span className="info-label">Grantee:</span>
            <span className="info-value">{account.bech32Address}</span>
          </div>
        </div>
      )}
      {instantiateResult && (
        <div className="info-container">
          <div className="info-content">
            <p className="info-description">
              <span className="info-bold">Transaction Hash</span>
            </p>
            <a
              className="info-link"
              href={blockExplorerUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {instantiateResult.transactionHash}
            </a>
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
      {proposalId && (
        <div className="info-container">
          <div className="info-content">
            <p className="info-description">
              <span className="info-bold">Proposal ID</span>
            </p>
            <span className="info-value">{proposalId}</span>
          </div>
        </div>
      )}
    </main>
  );
}