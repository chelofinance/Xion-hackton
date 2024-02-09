"use client";
import { useEffect, useState } from "react";
import { Abstraxion, useAbstraxionAccount, useAbstraxionSigningClient, useModal } from "@burnt-labs/abstraxion";
import { Button } from "@burnt-labs/ui";
import Contracts from "@/config/contracts.config";
import { createIcaMultisig, createProposal, executeProposal, getBalance, getProposalList, voteProposal } from "./utils";

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
  const [proposals, setProposals] = useState<any[]>([]);
  const [proposalJson, setProposalJson] = useState("{}");

  useEffect(() => {
    async function fetchData() {
      if (client) {
        console.log("client", client);
        const abstract_addr = await getAbstractAddress();
        setAbstractAddress(abstract_addr);
        setMemberAddresses(abstract_addr ? [abstract_addr] : []);

        // For testing, let's hardcode the multisig. Ideally this should be the last created one.
        setIcaMultisigAddress(contracts.hardcodedIcaMultisig.address);
        setIcaAccountAddress(contracts.hardcodedIcaController.address);

        getProposalListHandler();
        console.log("isConnected", isConnected);
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
    // logoutAbstraxion();
  }

  async function createProposalHandler() {
    setLoading(true);
    const response = await createProposal(client, account, JSON.parse(proposalJson), icaMultisigAddress, icaControllerAddress, icaAccountAddress);
    console.log("response", response);

    await getProposalListHandler();

    setLoading(false);
  }

  async function voteProposalHandler(proposalId: any, vote: any) {
    setLoading(true);
    const response = await voteProposal(client, account, icaMultisigAddress, proposalId, vote);
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

  async function testFunction() {
    // Do anything here
  }

  async function executeProposalHandler(proposalId: any) {
    setLoading(true);
    const response = await executeProposal(client, account, icaMultisigAddress, proposalId);
    console.log("response", response);
    await getProposalListHandler();
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
        <div>
          <label htmlFor="proposal">Proposal</label>
          <textarea
            value={"{}"}
            onChange={(e) => {
              setProposalJson(e.target.value);
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
      {proposals && (
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
                  <button disabled={loading} onClick={() => voteProposalHandler(proposal.id, true)}>
                    {loading ? "LOADING..." : "Yes"}
                  </button>
                  <button disabled={loading} onClick={() => voteProposalHandler(proposal.id, false)}>
                    {loading ? "LOADING..." : "No"}
                  </button>
                </td>
                <td>
                  <button disabled={loading} onClick={() => executeProposalHandler(proposal.id)}>
                    {loading ? "LOADING..." : "Execute"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {icaMultisigAddress && (
        <Button
          disabled={loading}
          fullWidth
          onClick={testFunction}
          structure="base"
        >
          {loading ? "LOADING..." : "Test"}
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
    </main>
  );
}