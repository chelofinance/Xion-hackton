"use client";
import { useEffect, useState } from "react";
import { Abstraxion, useAbstraxionAccount, useAbstraxionSigningClient, useModal } from "@burnt-labs/abstraxion";
import { Button } from "@burnt-labs/ui";
import Contracts from "@/config/contracts.config";
import { v4 as uuidv4 } from 'uuid';
import { createIcaMultisig, createProposal, executeProposal, getBalance, voteProposal } from "./utils";

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
  const [icaAccountAddress, setIcaAccountAddress] = useState<string>("");
  const [proposalId, setProposalId] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      if (client) {
        console.log("client", client);
        const abstract_addr = await getAbstractAddress();
        setAbstractAddress(abstract_addr);
        setMemberAddresses(abstract_addr ? [abstract_addr] : []);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  async function getAbstractAddress() {
    const abstractAccount = await client?.getAccount(account.bech32Address);
    return abstractAccount?.address || "";
  }

  async function createIcaMultisigHandler() {
    setLoading(true);
    const multisig_creation_response = await createIcaMultisig(client, account, contracts.icaFactory.address, memberAddresses);
    setIcaMultisigAddress(multisig_creation_response ? multisig_creation_response.ica_multisig_address : "");
    setIcaControllerAddress(multisig_creation_response ? multisig_creation_response.ica_controller_address : "");
    setIcaAccountAddress(multisig_creation_response ? multisig_creation_response.ica_account_address : "");
    setLoading(false);
  }

  async function createProposalHandler() {
    setLoading(true);
    const response = await createProposal(client, account, icaMultisigAddress);
    console.log("response", response);
    setProposalId(response ? response.proposal_id : "");
    setLoading(false);
  }

  async function voteProposalHandler(vote: any) {
    setLoading(true);
    const response = await voteProposal(client, account, icaMultisigAddress, proposalId, vote);
    console.log("response", response);
    setLoading(false);
  }


  async function executeProposalHandler() {
    setLoading(true);
    const response = await executeProposal(client, account, icaMultisigAddress, proposalId);
    console.log("response", response);
    setLoading(false);
  }

  async function getBalanceHandler() {
    setLoading(true);
    const response = await getBalance(client, abstractAddress);
    console.log("response", response);
    setLoading(false);
  }

  return (
    <main className="container">
      <h1>MULTISIG EXAMPLE</h1>
      <Button fullWidth onClick={() => setIsOpen(true)} structure="base">
        {account.bech32Address ? <div>VIEW ACCOUNT</div> : "CONNECT"}
      </Button>
      {client && !icaMultisigAddress && (
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
              <button type="button" onClick={() => {
                const updatedAddresses = [...memberAddresses];
                updatedAddresses.splice(index, 1);
                setMemberAddresses(updatedAddresses);
              }}>
                Remove
              </button>
            </div>
          ))}
          <Button onClick={() => {
            setMemberAddresses([...memberAddresses, ""]);
          }}>
            Add New
          </Button>

          <Button
            disabled={loading}
            fullWidth
            onClick={createIcaMultisigHandler}
            structure="base">
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
          onClick={createProposalHandler}
          structure="base"
        >
          {loading ? "LOADING..." : "Create Proposal"}
        </Button>
      )}
      {proposalId && (
        <Button
          disabled={loading}
          fullWidth
          onClick={voteProposalHandler}
          structure="base"
        >
          {loading ? "LOADING..." : "Vote Proposal"}
        </Button>
      )}
      {proposalId && (
        <Button
          disabled={loading}
          fullWidth
          onClick={executeProposalHandler}
          structure="base"
        >
          {loading ? "LOADING..." : "Execute Proposal"}
        </Button>
      )}
      <Abstraxion onClose={() => setIsOpen(false)} />

      {abstractAddress && (
        <div className="info-container">
          <div className="info-header">
            <span className="info-label">Granter:</span>
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