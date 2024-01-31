"use client";
import { useEffect, useState } from "react";
import { Abstraxion, useAbstraxionAccount, useAbstraxionSigningClient } from "@burnt-labs/abstraxion";
import { Button } from "@burnt-labs/ui";
import type { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import Contracts from "@/config/contracts.config";

const contracts = Contracts["xion-testnet"];

export default function Page(): JSX.Element {
  const { data: account, isConnected } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [instantiateResult, setInstantiateResult] = useState<ExecuteResult | undefined>(undefined);
  const [memberAddresses, setMemberAddresses] = useState<string[]>(['xion1gh5hrkta3nze3yvut7u5507lxtje0ryz65zpzw']);
  const [multisigAddresses, setMultisigAddresses] = useState<string[]>([]);

  const blockExplorerUrl = `https://explorer.burnt.com/xion-testnet-1/tx/${instantiateResult?.transactionHash}`;

  useEffect(() => {
    if (client) {
      console.log("client", client);
    }
  }, [client]);

  async function getGranter() {
    setLoading(true);

    try {
      const granter = await client?.getAccount(account.bech32Address);
      console.log("granter", granter);
    } catch (error) {
      console.log("error", error);
      alert(error);
    } finally {
      setLoading(false);
    }
  }

  async function createMultisig() {
    setLoading(true);

    const members = memberAddresses.map((address) => ({ addr: address, weight: 1 }));

    const msg = {
      create_multisig: {
        members,
        threshold: {
          absolute_count: {
            weight: 1,
          },
        },
        max_voting_period: {
          time: 36000,
        },
      }
    };

    try {
      const instantiateResponse = await client?.execute(
        account.bech32Address,
        contracts.nomosFactory.address,
        msg,
        "auto",
      );
      console.log("instantiateResponse", instantiateResponse);
      setInstantiateResult(instantiateResponse);

      const create_wallet_events = instantiateResponse?.events.find(
        (e: any) => e.type === "wasm-create_wallet"
      );
      console.log(JSON.stringify(create_wallet_events));

      const create_membership_events = instantiateResponse?.events.find(
        (e: any) => e.type === "wasm-create_membership"
      );
      console.log(JSON.stringify(create_membership_events));

      const instantiate_events = instantiateResponse?.events.filter(
        (e: any) => e.type === "instantiate"
      );
      console.log(JSON.stringify(instantiate_events));

      setMultisigAddresses(instantiate_events?.map((e: any) => e.attributes[0].value) || []);

      console.log(JSON.stringify(multisigAddresses));
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
          void createMultisig();
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
          <Button type="submit" disabled={loading} fullWidth structure="base">
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
          onClick={getGranter}
          structure="base"
        >
          {loading ? "LOADING..." : "Get Granter"}
        </Button>
      )}
      <Abstraxion isOpen={isOpen} onClose={() => setIsOpen(false)} />

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
      {multisigAddresses.length > 0 && (
        <div className="info-container">
          <div className="info-content">
            <p className="info-description">
              <span className="info-bold">Multisig Addresses</span>
            </p>
            {multisigAddresses.map((address, index) => (
              <div key={index} className="info-item">
                <a
                  className="info-link"
                  href={`https://explorer.burnt.com/xion-testnet-1/account/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {address}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}