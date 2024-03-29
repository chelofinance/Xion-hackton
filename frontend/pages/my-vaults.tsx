import type {NextPage} from 'next';
import Main from '@/components/Main';
import Heading from '@/components/Heading';
import Card from '@/components/Card';
import {formatNumber, formatUSD, simpleFormat} from '@/utils/number';
import {useCallback, useMemo, useRef, useState} from 'react';
import useOraclePrice from '@/hooks/useOraclePrice';
import BigNumber from 'bignumber.js';
import {useAtom} from 'jotai';
import {userWalletAtom} from '@/store/states';
import NFTVaultLinkCard from '@/components/NFTVaultLinkCard';
import AccountAddress from '@/components/AccountAddress';
import BalanceTotal from '@/components/overlays/AccountOverlay/BalanceTotal';
import CopyHelper from '@/components/CopyHelper';
import {shortenAddress} from '@/utils/text';
import Button from '@/components/Button';
import {useRouter} from 'next/router';
import {AllChains, COIN_DICT, ProposalStatus, TokenSymbols} from '@/constants/app';
import Tag from '@/components/Tag';
import useProposals from '@/hooks/useProposals';
import useJoinVault from '@/hooks/useJoinVault';
import TextInput from '@/components/TextInput';
import CoinAmount from '@/components/CoinAmount';
import useDepositToVaultMultisig from '@/hooks/useDepositToVaultMultisig';
import useBalanceOnXion from '@/hooks/useBalanceOnXion';
import useCreateVault from '@/hooks/useCreateVault';
import useMyVaults from '@/hooks/useMyVaults';
import {MyVault, RaisingNFT} from '@/types/asset';
import AmountInput from '@/components/form-presets/AmountInput';
import {useAbstraxionAccount, useAbstraxionSigningClient} from '@burnt-labs/abstraxion';
import WaitingSymbol from '@/components/WaitingSymbol';
import NFTTumbnail from '@/components/NFTThumbnail';
import ProgressBar from '@/components/ProgressBar';
import {executeProposal} from '@/utils/multisig';
import useExecuteProposal from '@/hooks/useExecuteProposal';
import useRaisingNFTVaults from '@/hooks/useRaisingNFTVaults';
import useICASell from '@/hooks/useICASell';

const MyVaults: NextPage = () => {
    const router = useRouter();

    const [userWallet] = useAtom(userWalletAtom);
    const {getOraclePrice} = useOraclePrice();

    const {client} = useAbstraxionSigningClient();
    const isClientLoading = !client;

    const {myVaults, updateMyVaults} = useMyVaults(client, userWallet?.account.bech32Address);

    const [selectedVault, setSelectedVault] = useState<MyVault>();

    const fallbackVault = selectedVault ?? (myVaults[0] || (null as MyVault | null));

    const {getBalance: getMyBalanceOnXion, isBalanceFetching: isMyBalanceFetching} = useBalanceOnXion(
        client,
        userWallet?.account.bech32Address
    );
    const myINJBalance = getMyBalanceOnXion(TokenSymbols.INJ);
    const myXIONBalance = getMyBalanceOnXion(TokenSymbols.XION);

    const {getBalance: getBalanceOnXion, updateBalance: updateBalanceOnXion} = useBalanceOnXion(
        client,
        fallbackVault?.multisigAddress
    );
    const multisigBalance = getBalanceOnXion(TokenSymbols.INJ);

    const {depositToVaultMultisig, isProcessing: isDepositToVaultProcessing} = useDepositToVaultMultisig(client);

    const myNFTVaultsValueUSD = useMemo(() => {
        return myVaults.reduce((accm, vault) => {
            const nftsValuesUSD = vault.proposals.reduce((accm, proposal) => {
                const isOwned = proposal.nft.ownerAddress === vault.multisigAddress;
                if (!isOwned) return accm;

                const oraclePrice = getOraclePrice(proposal.nft.fixedPrice.symbol);
                const priceUSD = new BigNumber(proposal.nft.fixedPrice.value.toString()).times(oraclePrice);
                return accm.plus(priceUSD);
            }, new BigNumber(0));

            const share = vault.share;
            const shareUSD = nftsValuesUSD.times(share);

            return accm.plus(shareUSD);
        }, new BigNumber(0));
    }, [getOraclePrice, myVaults, userWallet?.account.bech32Address]);

    const nfts = useRaisingNFTVaults();

    const vaultOwnedNFTs = useMemo(() => {
        return nfts.filter((nft) => nft.ownerAddress === fallbackVault?.icaAccountAddress);
    }, [nfts, fallbackVault?.icaAccountAddress]);

    const {voteProposal} = useProposals(fallbackVault?.icaControllerAddress ?? '');

    const {joinVault, processing: addMemberLoading} = useJoinVault(client);

    const joinVaultForm = useRef<HTMLFormElement>(null);
    const depositForm = useRef<HTMLFormElement>(null);

    const [newVaultAddress, setNewMemberAddress] = useState<string>('');
    const onChangeVaultAddress = (debouncedValue: string) => {
        setNewMemberAddress(debouncedValue);
    };

    const [isDepositFormOpen, setIsDepositFormOpen] = useState<boolean>(false);

    const [depositAmount, setDepositAmount] = useState<number>(0);
    const [isDepositAmountValid, setIsDepositAmountValid] = useState<boolean>(true);

    const onChangeDepositAmount = useCallback((debouncedValue: string, isValid: boolean) => {
        setIsDepositAmountValid(isValid);

        const amount = parseFloat(debouncedValue);
        if (!isNaN(amount)) {
            setDepositAmount(amount);
        }
    }, []);

    const handleDepositToVault = useCallback(async () => {
        if (!fallbackVault || !userWallet) return;

        const result = await depositToVaultMultisig(fallbackVault, {
            symbol: TokenSymbols.INJ,
            depositAmount,
            senderAddress: userWallet.account.bech32Address,
        });

        if (result?.isSuccess) {
            await updateBalanceOnXion();
        }
    }, [depositAmount, fallbackVault, userWallet]);

    const getDepositAmountErrorMsg = useCallback((value: string) => {
        if (value === '' || value === '0') return 'Enter amount';

        const inputAmount = parseFloat(value);
        if (isNaN(inputAmount)) return 'Invalid number';
        return null;
    }, []);

    const handleMergeBalance = useCallback(async () => {
        //
    }, []);

    const {data: abstraxionAccount} = useAbstraxionAccount();

    const {createVault, isProcessing: isCreateVaultProcessing} = useCreateVault(abstraxionAccount);
    const {executeProposal, isProcessing: loadingExecuteProposal} = useExecuteProposal(abstraxionAccount);

    const handleCreateVault = useCallback(async () => {
        await createVault();
        await updateMyVaults();
    }, [createVault, updateMyVaults]);
    const handleJoinVault = useCallback(
        async (newVaultAddress: string) => {
            await joinVault(newVaultAddress);
            setTimeout(updateMyVaults, 1500);
        },
        [joinVault, updateMyVaults]
    );
    const handleExecuteProposal = useCallback(
        async (proposal: string | number) => {
            await executeProposal(fallbackVault, proposal);
            setTimeout(updateMyVaults, 1500); //wait for blockchain state update
        },
        [fallbackVault, executeProposal, updateMyVaults]
    );

    const isRaised = useCallback(
        (nft: RaisingNFT) => multisigBalance.shifted.gte(simpleFormat(nft.fixedPrice.value, 18)),
        [multisigBalance.shifted]
    );

    //dont remove these conditions. Are correct acording to talis marketplace
    const buyProposals =
        useMemo(
            () =>
                fallbackVault?.proposals.filter(
                    (proposal) => proposal.nft.onSale && proposal.nft.ownerAddress !== fallbackVault?.icaAccountAddress
                ),
            [fallbackVault?.proposals, fallbackVault?.icaAccountAddress]
        ) ?? [];
    const sellProposals =
        useMemo(
            () =>
                fallbackVault?.proposals.filter(
                    (proposal) => !proposal.nft.onSale && proposal.nft.ownerAddress === fallbackVault?.icaAccountAddress
                ),
            [fallbackVault?.proposals, fallbackVault?.icaAccountAddress]
        ) ?? [];

    const {sellNftIca, isProcessing: isProcessingSell} = useICASell();

    const handleSell = useCallback(
        async (nft?: RaisingNFT) => {
            await sellNftIca(fallbackVault, nft);
            setTimeout(updateMyVaults, 1500); //wait for blockchain state
        },
        [sellNftIca, updateMyVaults, fallbackVault]
    );

    const Content =
        userWallet === null ? (
            <Card color="glass" className="p-4 text-body Font_body_md">
                Connect Abstraxion account to see your portfolio.
            </Card>
        ) : (
            <div className="w-full flex items-stretch gap-x-14 text-body">
                <section className="w-1/3 flex flex-col gap-y-16">
                    <div className="flex flex-col gap-y-8">
                        <Heading tagName="h3">My balance</Heading>

                        <Card color="glass">
                            <div className="space-y-4 p-4">
                                <AccountAddress wallet={userWallet} />

                                {isMyBalanceFetching ? (
                                    <WaitingSymbol color="primary" />
                                ) : (
                                    <div className="space-y-1">
                                        <BalanceTotal
                                            formattedNumber={formatUSD(myINJBalance.usd.plus(myXIONBalance.usd))}
                                            isLoading={false}
                                        />
                                        <CoinAmount
                                            size="sm"
                                            symbol={TokenSymbols.INJ}
                                            formattedAmount={formatNumber(myINJBalance.shifted, myINJBalance.decimals)}
                                        />
                                        <CoinAmount
                                            size="sm"
                                            symbol={TokenSymbols.XION}
                                            formattedAmount={formatNumber(myXIONBalance.shifted, myXIONBalance.decimals)}
                                        />
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* <div className="flex justify-end">
                        <Button 
                            iconType="add" 
                            label="Create vault" 
                            status={isCreateVaultProcessing ? 'processing' : 'enabled'}
                            onClick={handleCreateVault} 
                        />
                    </div> */}

                    <div className="flex flex-col gap-y-8">
                        <Heading tagName="h3">My vaults</Heading>

                        <ul className="w-full flex flex-col gap-y-4">
                            {myVaults.length === 0 && (
                                <Card color="glass" className="p-4 text-body">
                                    No vault found.
                                </Card>
                            )}

                            {myVaults.map((myVault) => (
                                <li key={myVault.multisigAddress}>
                                    <Card
                                        size="sm"
                                        color={fallbackVault?.multisigAddress === myVault.multisigAddress ? 'primary' : 'glass'}
                                        className="flex flex-col items-stretch gap-y-4 p-4"
                                    >
                                        <CopyHelper toCopy={myVault.multisigAddress}>
                                            <div className="Font_caption_sm">{shortenAddress(myVault.multisigAddress)}</div>
                                        </CopyHelper>

                                        {myVault.proposals.length > 0 && myVault.proposals[0]?.nft && (
                                            <div className="flex items-center gap-x-2">
                                                <NFTTumbnail
                                                    size="sm"
                                                    imgSrc={myVault.proposals[0]?.nft.imgSrc}
                                                    className="rounded-card_sm"
                                                />

                                                {myVault.proposals.length > 1 && (
                                                    <div className="Font_caption_sm">+ {myVault.proposals.length - 1} more</div>
                                                )}
                                            </div>
                                        )}

                                        {fallbackVault?.multisigAddress !== myVault.multisigAddress && (
                                            <div className="flex justify-end">
                                                <Button
                                                    size="sm"
                                                    iconType="chevron_right"
                                                    // color="secondary"
                                                    label="Manage"
                                                    // labelHidden
                                                    onClick={() => setSelectedVault(myVault)}
                                                />
                                            </div>
                                        )}
                                    </Card>
                                </li>
                            ))}
                        </ul>

                        <div className="flex justify-end items-center">
                            <Button
                                // size="sm"
                                iconType="add"
                                label={isClientLoading ? 'Loading client' : 'Create vault'}
                                status={isClientLoading ? 'disabled' : isCreateVaultProcessing ? 'processing' : 'enabled'}
                                onClick={handleCreateVault}
                            />
                        </div>
                    </div>
                </section>

                <section className="grow shrink flex flex-col gap-y-8">
                    {fallbackVault && (
                        <>
                            <Heading tagName="h3">Vault {shortenAddress(fallbackVault.multisigAddress)}</Heading>

                            <Card color="glass" className="flex flex-col justify-between items-stretch gap-y-4 p-4">
                                <div className="Font_label_14px">Balance</div>

                                <div className="space-y-1">
                                    <BalanceTotal formattedNumber={formatUSD(multisigBalance.usd)} isLoading={false} />

                                    <div className="flex items-center gap-x-2">
                                        <CoinAmount
                                            size="sm"
                                            symbol={TokenSymbols.INJ}
                                            chain={AllChains.XION_TESTNET}
                                            formattedAmount={formatNumber(multisigBalance.shifted, multisigBalance.decimals)}
                                        />
                                        <CopyHelper toCopy={fallbackVault.multisigAddress} className="text-caption">
                                            <span className="truncate Font_caption_xs">
                                                {shortenAddress(fallbackVault.multisigAddress, 4, 4)}
                                            </span>
                                        </CopyHelper>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <span>ica:</span>
                                        <CopyHelper toCopy={fallbackVault.icaAccountAddress} className="text-caption">
                                            <span className="w-fit truncate Font_caption_xs">
                                                {shortenAddress(fallbackVault.icaAccountAddress, 4, 4)}
                                            </span>
                                        </CopyHelper>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-x-2">
                                    <Button
                                        // size="sm"
                                        iconType="arrow_forward"
                                        label="Merge balance"
                                        status={multisigBalance.shifted.gt(0) ? 'enabled' : 'disabled'}
                                        onClick={handleMergeBalance}
                                    />
                                    <Button
                                        // size="sm"
                                        // color="secondary"
                                        label="Deposit"
                                        iconType={isDepositFormOpen ? 'expand_less' : 'expand_more'}
                                        status={isDepositToVaultProcessing ? 'processing' : 'enabled'}
                                        onClick={() => setIsDepositFormOpen(!isDepositFormOpen)}
                                    />
                                </div>

                                {isDepositFormOpen && (
                                    <Card color="primary" className="flex flex-col justify-between items-stretch gap-y-4 p-4">
                                        {/* <div className="Font_label_14px text-white">Deposit</div> */}

                                        <form ref={depositForm} className="flex flex-col items-stretch gap-y-8">
                                            <div className="flex items-stretch justify-between gap-x-4">
                                                <div className="w-1/3 h-[3.125rem] flex items-center Font_label_14px whitespace-nowrap">
                                                    Amount
                                                </div>

                                                <AmountInput
                                                    required
                                                    form={depositForm.current}
                                                    label="Amount"
                                                    placeholder="0.0"
                                                    initialValue={depositAmount}
                                                    getErrorMsg={getDepositAmountErrorMsg}
                                                    onChange={onChangeDepositAmount}
                                                />
                                            </div>

                                            <div className="flex items-center justify-end gap-x-2">
                                                <Button
                                                    color="on_primary"
                                                    type="text"
                                                    label="Cancel"
                                                    className="w-full md:w-fit"
                                                    onClick={() => setIsDepositFormOpen(false)}
                                                />
                                                <Button
                                                    color="on_primary"
                                                    label="OK"
                                                    iconType="arrow_forward"
                                                    className="w-full md:w-fit"
                                                    status={
                                                        isDepositToVaultProcessing
                                                            ? 'processing'
                                                            : isDepositAmountValid
                                                                ? 'enabled'
                                                                : 'disabled'
                                                    }
                                                    onClick={handleDepositToVault}
                                                />
                                            </div>
                                        </form>
                                    </Card>
                                )}
                            </Card>

                            <section className="space-y-4 mt-4">
                                <Heading tagName="h4">Buy Proposals</Heading>

                                {/* MOCK_PROPOSALS */}
                                {buyProposals.map((proposal) => (
                                    <Card
                                        key={proposal.proposal.id}
                                        color={proposal.proposal.status === ProposalStatus.Rejected ? 'caption' : 'primary'}
                                        className="flex flex-col items-stretch gap-y-4 p-4"
                                    >
                                        <div className="flex justify-between items-center gap-x-4">
                                            <div className="flex items-baseline gap-x-4">
                                                <span className="Font_caption_xs text-caption_on_primary">
                                                    #{proposal.proposal.id}
                                                </span>
                                                <div className="w-[300px] truncate Font_label_14px">
                                                    {proposal.proposal.description}
                                                </div>
                                            </div>

                                            <Tag
                                                size="sm"
                                                color={
                                                    proposal.proposal.status === ProposalStatus.Passed ? 'success' : 'secondary'
                                                }
                                                label={proposal.proposal.status}
                                            />
                                        </div>

                                        <NFTVaultLinkCard
                                            key={proposal.nft.tokenId}
                                            href="raising-vault"
                                            nft={proposal.nft}
                                            amountLabel="Fixed price"
                                            formattedAmount={simpleFormat(
                                                proposal.nft.fixedPrice.value,
                                                COIN_DICT[proposal.nft.fixedPrice.symbol].decimals
                                            )}
                                            vaultAddress={fallbackVault.multisigAddress}
                                        />

                                        <ProgressBar
                                            currentNumber={multisigBalance.shifted.toNumber()}
                                            targetNumber={proposal.nft.fixedPrice.value.toNumber()}
                                            decimals={multisigBalance.decimals}
                                            currentNumberCaption="raised"
                                        />

                                        {proposal.proposal.status === ProposalStatus.Pending && (
                                            <div className="flex justify-end gap-x-2">
                                                <Button
                                                    color="on_primary"
                                                    iconType="decrease"
                                                    label="No"
                                                    onClick={() =>
                                                        voteProposal(fallbackVault.multisigAddress, proposal.proposal.id, true)
                                                    }
                                                />
                                                <Button
                                                    color="on_primary"
                                                    iconType="increase"
                                                    label="Yes"
                                                    onClick={() =>
                                                        voteProposal(fallbackVault.multisigAddress, proposal.proposal.id, true)
                                                    }
                                                />
                                            </div>
                                        )}

                                        {proposal.proposal.status === ProposalStatus.Passed && (
                                            <div className="flex justify-end gap-x-2">
                                                <Button
                                                    color="secondary"
                                                    iconType="increase"
                                                    label={isRaised(proposal.nft) ? 'Execute buy' : 'Insufficient balance'}
                                                    status={
                                                        isRaised(proposal.nft)
                                                            ? loadingExecuteProposal
                                                                ? 'processing'
                                                                : 'enabled'
                                                            : 'disabled'
                                                    }
                                                    onClick={() => {
                                                        handleExecuteProposal(proposal.proposal.id);
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </Card>
                                ))}

                                {/* MOCK_PROPOSALS */}
                                {buyProposals.length === 0 && (
                                    <Card color="glass" className="p-4 text-body">
                                        No proposal found
                                    </Card>
                                )}

                                <div className="flex justify-end">
                                    <Button
                                        type="outline"
                                        iconType="arrow_forward"
                                        label="Go market"
                                        onClick={() =>
                                            router.push('/#home-nfts-table', {query: {vault: fallbackVault.multisigAddress}})
                                        }
                                    />
                                </div>

                                <Heading tagName="h4" className="!mt-8">
                                    Sell Proposals
                                </Heading>

                                {/* MOCK_PROPOSALS */}
                                {sellProposals.map((proposal) => (
                                    <Card
                                        key={proposal.proposal.id}
                                        color={proposal.proposal.status === ProposalStatus.Rejected ? 'caption' : 'primary'}
                                        className="flex flex-col items-stretch gap-y-4 p-4"
                                    >
                                        <div className="flex justify-between items-center gap-x-4">
                                            <div className="flex items-baseline gap-x-4">
                                                <span className="Font_caption_xs text-caption_on_primary">
                                                    #{proposal.proposal.id}
                                                </span>
                                                <div className="w-[300px] truncate Font_label_14px">
                                                    {proposal.proposal.description}
                                                </div>
                                            </div>

                                            <Tag
                                                size="sm"
                                                color={
                                                    proposal.proposal.status === ProposalStatus.Passed ? 'success' : 'secondary'
                                                }
                                                label={proposal.proposal.status}
                                            />
                                        </div>

                                        <NFTVaultLinkCard
                                            key={proposal.nft.tokenId}
                                            href="raising-vault"
                                            nft={proposal.nft}
                                            amountLabel="Fixed price"
                                            formattedAmount={simpleFormat(
                                                proposal.nft.fixedPrice.value,
                                                COIN_DICT[proposal.nft.fixedPrice.symbol].decimals
                                            )}
                                            vaultAddress={fallbackVault.multisigAddress}
                                        />

                                        {proposal.proposal.status === ProposalStatus.Pending && (
                                            <div className="flex justify-end gap-x-2">
                                                <Button
                                                    color="on_primary"
                                                    iconType="decrease"
                                                    label="No"
                                                    onClick={() =>
                                                        voteProposal(fallbackVault.multisigAddress, proposal.proposal.id, true)
                                                    }
                                                />
                                                <Button
                                                    color="on_primary"
                                                    iconType="increase"
                                                    label="Yes"
                                                    onClick={() =>
                                                        voteProposal(fallbackVault.multisigAddress, proposal.proposal.id, true)
                                                    }
                                                />
                                            </div>
                                        )}

                                        {proposal.proposal.status === ProposalStatus.Passed && (
                                            <div className="flex justify-end gap-x-2">
                                                <Button
                                                    color="secondary"
                                                    iconType="arrow_forward"
                                                    label="Execute sell"
                                                    status={loadingExecuteProposal ? 'processing' : 'enabled'}
                                                    onClick={() => handleExecuteProposal(proposal.proposal.id)}
                                                />
                                            </div>
                                        )}
                                    </Card>
                                ))}

                                {/* MOCK_PROPOSALS */}
                                {sellProposals.length === 0 && (
                                    <Card color="glass" className="p-4 text-body">
                                        No proposal found
                                    </Card>
                                )}
                            </section>

                            <section className="space-y-4 mt-4">
                                <Heading tagName="h4">NFT Holdings</Heading>

                                <ul className="space-y-4">
                                    {/* MOCK_OWNED_NFTS */}
                                    {vaultOwnedNFTs.map((vaultOwnedNFT) => (
                                        <Card
                                            key={vaultOwnedNFT.tokenId}
                                            color="glass"
                                            className="flex flex-col items-stretch gap-y-4 p-4"
                                        >
                                            {vaultOwnedNFT.onSale && (
                                                <div className="flex justify-end">
                                                    <Tag size="sm" label="On sale" />
                                                </div>
                                            )}

                                            <NFTVaultLinkCard
                                                key={vaultOwnedNFT.tokenId}
                                                color="body"
                                                href="raising-vault"
                                                nft={vaultOwnedNFT}
                                                amountLabel="Fixed price"
                                                formattedAmount={simpleFormat(
                                                    vaultOwnedNFT.fixedPrice.value,
                                                    COIN_DICT[vaultOwnedNFT.fixedPrice.symbol].decimals
                                                )}
                                                vaultAddress={fallbackVault.multisigAddress}
                                            />

                                            {!vaultOwnedNFT.onSale && (
                                                <div className="flex justify-end">
                                                    <Button
                                                        iconType="arrow_forward"
                                                        label="Propose sell"
                                                        onClick={() => handleSell(vaultOwnedNFT)}
                                                        status={isProcessingSell ? 'processing' : 'enabled'}
                                                    />
                                                </div>
                                            )}
                                        </Card>
                                    ))}

                                    {/* MOCK_OWNED_NFTS */}
                                    {vaultOwnedNFTs.length === 0 && (
                                        <Card color="glass" className="text-body p-4">
                                            <div className="Font_body_md">Not found.</div>
                                        </Card>
                                    )}
                                </ul>
                            </section>
                        </>
                    )}

                    <div className="flex flex-col grow gap-y-4">
                        {!fallbackVault && (
                            <div className="flex flex-col">
                                <Card color="glass" className="p-4 text-body">
                                    No vault found.
                                </Card>
                            </div>
                        )}
                        <div className="space-y-4 mt-4">
                            <Heading tagName="h4">Join Vault</Heading>

                            <TextInput
                                form={joinVaultForm.current}
                                initialValue={newVaultAddress}
                                onChange={onChangeVaultAddress}
                                type="text"
                                label="Vault address"
                                placeholder="Address of vault"
                            />

                            <div className="flex justify-end">
                                <Button
                                    label="Join Vault"
                                    status={
                                        newVaultAddress.length === 0 ? 'disabled' : addMemberLoading ? 'processing' : 'enabled'
                                    }
                                    onClick={() => handleJoinVault(newVaultAddress)}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );

    return (
        <Main className="flex flex-col items-stretch min-h-screen pt-app_header_height pb-page_bottom md:mx-page_x">
            <Heading tagName="h2">Portfolio</Heading>

            <div className="mt-10">{Content}</div>
        </Main>
    );
};

export default MyVaults;
