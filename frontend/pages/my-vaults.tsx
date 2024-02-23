import type {NextPage} from 'next';
import Main from '@/components/Main';
import Heading from '@/components/Heading';
import Card from '@/components/Card';
import {formatNumber, formatUSD} from '@/utils/number';
import {useCallback, useMemo, useRef, useState} from 'react';
import useOraclePrice from '@/hooks/useOraclePrice';
import BigNumber from 'bignumber.js';
import useMyNFTVaults from '@/hooks/useMyNFTVaults';
import {useAtom} from 'jotai';
import {userWalletAtom} from '@/store/states';
import NFTVaultLinkCard from '@/components/NFTVaultLinkCard';
import AccountAddress from '@/components/AccountAddress';
import BalanceTotal from '@/components/overlays/AccountOverlay/BalanceTotal';
import AccountButton from '@/components/buttons/AccountButton';
import CopyHelper from '@/components/CopyHelper';
import {shortenAddress} from '@/utils/text';
import Button from '@/components/Button';
import {useRouter} from 'next/router';
import ChainLabel from '@/components/ChainLabel';
import {AllChains, PROPOSAL_STATUS_LABEL_DICT, ProposalStatus, TEST_VAULT, TokenSymbols} from '@/constants/app';
import Tag from '@/components/Tag';
import useProposals from '@/hooks/useProposals';
import useAddMember from '@/hooks/useAddMember';
import TextInput from '@/components/TextInput';
import {MyNFTVault} from '@/types/asset';
import CoinAmount from '@/components/CoinAmount';
import useDepositToVaultMultisig from '@/hooks/useDepositToVaultMultisig';
import useBalanceOnInjective from '@/hooks/useBalanceOnInjective';
import useBalanceOnXion from '@/hooks/useBalanceOnXion';
import useCreateVault from '@/hooks/useCreateVault';

const MyVaults: NextPage = () => {
    const router = useRouter();

    const [userWallet] = useAtom(userWalletAtom);

    const {getOraclePrice} = useOraclePrice();

    const myVaults = useMyNFTVaults();
    console.log({myVaults});

    // const [selectedVault, setSelectedVault] = useState<MyNFTVault | undefined>(() => myVaults[0]);
    const selectedVault = myVaults[0];

    const {getBalance: getMyBalanceOnXion} = useBalanceOnXion(userWallet?.account.address);
    const myINJBalance = getMyBalanceOnXion(TokenSymbols.INJ);
    const myXIONBalance = getMyBalanceOnXion(TokenSymbols.XION);

    const {getBalance: getBalanceOnXion} = useBalanceOnXion(selectedVault?.ica.icaControllerAddress);
    const multisigBalance = getBalanceOnXion(TokenSymbols.INJ);

    const {depositToVaultMultisig, isProcessing: isDepositToVaultProcessing} = useDepositToVaultMultisig();

    const {getBalance: getBalanceOnInjective} = useBalanceOnInjective(selectedVault?.ica.icaMultisigAddress);
    const vaultBalance = getBalanceOnInjective(TokenSymbols.INJ);

    const myNFTVaultsValueUSD = useMemo(() => {
        return myVaults.reduce((accm, vault) => {
            const nftsValuesUSD = vault.nfts.reduce((accm, nft) => {
                const isOwned = nft.ownerAddress === vault.ica.icaMultisigAddress;
                if (!isOwned) return accm;

                const oraclePrice = getOraclePrice(nft.fixedPrice.symbol);
                const priceUSD = new BigNumber(nft.fixedPrice.value.toString()).times(oraclePrice);
                return accm.plus(priceUSD);
            }, new BigNumber(0));

            const share = vault.multisig.voters.find((voter) => voter.addr === userWallet?.account.address)?.share ?? 0;
            const shareUSD = nftsValuesUSD.times(share);

            return accm.plus(shareUSD);
        }, new BigNumber(0));
    }, [getOraclePrice, myVaults, userWallet?.account.address]);

    const formattedTotalUSD = useMemo(
        () => formatUSD(vaultBalance.usd.plus(myNFTVaultsValueUSD)),
        [vaultBalance.usd, myNFTVaultsValueUSD]
    );

    const {proposals, voteProposal} = useProposals(selectedVault?.ica.icaControllerAddress ?? '');

    const {addMember} = useAddMember(selectedVault?.ica.icaControllerAddress ?? '');

    const form = useRef<HTMLFormElement>(null);

    const [newMemberAddress, setNewMemberAddress] = useState<string>('');
    const onChangeNewMemberAddress = (debouncedValue: string) => {
        setNewMemberAddress(debouncedValue);
    };

    /**
     *
     * @todo need additional floww to input deposit amount using form
     */
    const handleDepositToVault = useCallback(async () => {
        console.log('HERE', selectedVault, userWallet);
        if (!selectedVault || !userWallet) return;

        const result = await depositToVaultMultisig(selectedVault, {
            symbol: TokenSymbols.INJ,
            depositAmount: 1,
            senderAddress: userWallet.account.address,
        });

        if (result?.isSuccess) {
            // refetch balance
        }
    }, [depositToVaultMultisig, selectedVault, userWallet]);

    const handleTransferToVault = useCallback(async () => {
        //
    }, []);

    const {createVault, isProcessing: isCreateVaultProcessing} = useCreateVault(userWallet);

    const Content =
        userWallet === null ? (
            <AccountButton />
        ) : (
            <div className="w-full flex items-stretch gap-x-14 text-body">
                <section className="w-1/3 flex flex-col gap-y-8">
                    <Heading tagName="h3">My balance</Heading>

                    <Card color="glass">
                        <div className="space-y-4 p-4">
                            <AccountAddress wallet={userWallet} />

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
                        </div>
                    </Card>

                    <Button iconType="add" label="Create vault" onClick={createVault} />
                </section>

                {selectedVault && (
                    <section className="grow shrink flex flex-col gap-y-8">
                        <Heading tagName="h3">Vault summary</Heading>

                        <Card color="glass" className="flex flex-col justify-between items-stretch gap-y-4 p-4">
                            <div className="Font_label_14px">Balance</div>

                            <div className="space-y-1">
                                <BalanceTotal
                                    formattedNumber={formatUSD(vaultBalance.usd.plus(multisigBalance.usd))}
                                    isLoading={false}
                                />

                                <div className="flex items-center gap-x-2">
                                    <CoinAmount
                                        size="sm"
                                        symbol={TokenSymbols.INJ}
                                        chain={AllChains.INJECTIVE_TESTNET}
                                        formattedAmount={formatNumber(vaultBalance.shifted, vaultBalance.decimals)}
                                    />
                                    <CopyHelper toCopy={selectedVault.ica.icaMultisigAddress} className="text-caption">
                                        <span className="w-fit truncate Font_caption_xs">
                                            {shortenAddress(selectedVault.ica.icaMultisigAddress, 4, 4)}
                                        </span>
                                    </CopyHelper>
                                </div>

                                <div className="flex items-center gap-x-2">
                                    <CoinAmount
                                        size="sm"
                                        symbol={TokenSymbols.INJ}
                                        chain={AllChains.XION_TESTNET}
                                        formattedAmount={formatNumber(multisigBalance.shifted, multisigBalance.decimals)}
                                    />
                                    <CopyHelper toCopy={selectedVault.ica.icaControllerAddress} className="text-caption">
                                        <span className="w-fit truncate Font_caption_xs">
                                            {shortenAddress(selectedVault.ica.icaControllerAddress, 4, 4)}
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
                                    onClick={handleTransferToVault}
                                />
                                <Button
                                    // size="sm"
                                    label="Deposit"
                                    iconType="arrow_forward"
                                    status={isDepositToVaultProcessing ? 'processing' : 'enabled'}
                                    onClick={handleDepositToVault}
                                />
                            </div>
                        </Card>

                        {/* <div className="flex flex-col gap-y-2">
                            <CopyHelper toCopy={selectedVault.ica.icaMultisigAddress} className="text-body">
                                <div className="flex items-center gap-x-4">
                                    <div className="flex items-center">
                                        <div className="w-[132px] Font_caption_xs mr-4 text-left">Vault address (ICA)</div>
                                        <ChainLabel logoOnly chain={AllChains.INJECTIVE_TESTNET} />
                                    </div>

                                    <span className="w-fit truncate Font_button_md">
                                        {shortenAddress(selectedVault.ica.icaMultisigAddress, 4, 4)}
                                    </span>
                                </div>
                            </CopyHelper>

                            <CopyHelper toCopy={selectedVault.ica.icaControllerAddress} className="text-body">
                                <div className="flex items-center gap-x-4">
                                    <div className="flex items-center">
                                        <div className="w-[132px] Font_caption_xs mr-4 text-left">Multisig address</div>
                                        <ChainLabel logoOnly chain={AllChains.XION_TESTNET} />
                                    </div>

                                    <span className="w-fit truncate Font_button_md">
                                        {shortenAddress(selectedVault.ica.icaControllerAddress, 4, 4)}
                                    </span>
                                </div>
                            </CopyHelper>
                        </div> */}

                        <section className="space-y-4 mt-4">
                            <Heading tagName="h4">Proposals</Heading>

                            {proposals.map((proposal) => (
                                <Card key={proposal.id} color="primary" className="space-y-4 p-4">
                                    <div>
                                        #{proposal.id} {proposal.description}
                                    </div>
                                    {proposal.status === ProposalStatus.Pending && (
                                        <div className="flex justify-end gap-x-2">
                                            <Button
                                                color="on_primary"
                                                label="No"
                                                onClick={() => voteProposal(proposal.id, true)}
                                            />
                                            <Button
                                                color="on_primary"
                                                label="Yes"
                                                onClick={() => voteProposal(proposal.id, true)}
                                            />
                                        </div>
                                    )}
                                    {proposal.status !== ProposalStatus.Pending && (
                                        <div className="flex justify-end gap-x-2">
                                            <Tag size="sm" label={PROPOSAL_STATUS_LABEL_DICT[proposal.status]} />
                                        </div>
                                    )}
                                </Card>
                            ))}

                            {proposals.length === 0 && (
                                <Card color="glass" className="p-4 text-body">
                                    No proposal found
                                </Card>
                            )}
                        </section>

                        <div className="flex flex-col gap-4 items-stretch mt-4">
                            <Heading tagName="h4">NFTs</Heading>

                            {selectedVault.nfts.map((nft) => (
                                <NFTVaultLinkCard
                                    key={nft.tokenId}
                                    href="raising-vault"
                                    nftVault={nft}
                                    amountLabel="Fixed price"
                                    formattedAmount={formatNumber(nft.fixedPrice.value, 18)}
                                    vaultAddress={selectedVault.ica.icaMultisigAddress}
                                />
                            ))}
                        </div>

                        <section className="space-y-4 mt-4">
                            <Heading tagName="h4">Add member</Heading>

                            <TextInput
                                form={form.current}
                                initialValue={newMemberAddress}
                                onChange={onChangeNewMemberAddress}
                                type="text"
                                label="New member address"
                                placeholder="New member address"
                            />

                            <div className="flex justify-end">
                                <Button
                                    label="Add member"
                                    status={newMemberAddress.length === 0 ? 'disabled' : 'enabled'}
                                    onClick={() => addMember(newMemberAddress)}
                                />
                            </div>
                        </section>
                    </section>
                )}

                {!selectedVault && (
                    <div className="grow shrink flex flex-col gap-y-4">
                        <Card color="glass" className="p-4 text-body">
                            No vault found.
                        </Card>

                        <div className="flex justify-end">
                            <Button
                                size="lg"
                                label="Create vault"
                                iconType="arrow_forward"
                                onClick={() => router.push('/create-vault')}
                            />
                        </div>
                    </div>
                )}
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
