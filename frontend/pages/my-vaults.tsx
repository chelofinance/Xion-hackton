import type {NextPage} from 'next';
import Main from '@/components/Main';
import Heading from '@/components/Heading';
import Card from '@/components/Card';
import {formatNumber, formatUSD} from '@/utils/number';
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
import {AllChains, PROPOSAL_STATUS_LABEL_DICT, ProposalStatus, TEST_VAULT, TokenSymbols} from '@/constants/app';
import Tag from '@/components/Tag';
import useProposals from '@/hooks/useProposals';
import useAddMember from '@/hooks/useAddMember';
import TextInput from '@/components/TextInput';
import CoinAmount from '@/components/CoinAmount';
import useDepositToVaultMultisig from '@/hooks/useDepositToVaultMultisig';
import useBalanceOnInjective from '@/hooks/useBalanceOnInjective';
import useBalanceOnXion from '@/hooks/useBalanceOnXion';
import useCreateVault from '@/hooks/useCreateVault';
import useMyVaults from '@/hooks/useMyVaults';
import { MyVault } from '@/types/asset';

const MyVaults: NextPage = () => {
    const router = useRouter();

    const [userWallet] = useAtom(userWalletAtom);
    const {getOraclePrice} = useOraclePrice();

    const { myVaults } = useMyVaults(userWallet?.account.address);

    const [selectedVault, setSelectedVault] = useState<MyVault | undefined>();

    const fallbackVault = selectedVault ?? myVaults[0];

    const {getBalance: getMyBalanceOnXion} = useBalanceOnXion(userWallet?.account.address);
    const myINJBalance = getMyBalanceOnXion(TokenSymbols.INJ);
    const myXIONBalance = getMyBalanceOnXion(TokenSymbols.XION);

    const {getBalance: getBalanceOnXion} = useBalanceOnXion(fallbackVault?.multisigAddress);
    const multisigBalance = getBalanceOnXion(TokenSymbols.INJ);

    const {depositToVaultMultisig, isProcessing: isDepositToVaultProcessing} = useDepositToVaultMultisig();

    const {getBalance: getBalanceOnInjective} = useBalanceOnInjective(fallbackVault?.multisigAddress);
    const vaultBalance = getBalanceOnInjective(TokenSymbols.INJ);

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
    }, [getOraclePrice, myVaults, userWallet?.account.address]);

    const formattedTotalUSD = useMemo(
        () => formatUSD(vaultBalance.usd.plus(myNFTVaultsValueUSD)),
        [vaultBalance.usd, myNFTVaultsValueUSD]
    );

    const { voteProposal} = useProposals(fallbackVault?.icaControllerAddress ?? '');

    const {addMember} = useAddMember(fallbackVault?.icaControllerAddress ?? '');

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
        console.log('HERE', fallbackVault, userWallet);
        if (!fallbackVault || !userWallet) return;

        const result = await depositToVaultMultisig(fallbackVault, {
            symbol: TokenSymbols.INJ,
            depositAmount: 1,
            senderAddress: userWallet.account.address,
        });

        if (result?.isSuccess) {
            // refetch balance
        }
    }, [depositToVaultMultisig, fallbackVault, userWallet]);

    const handleMergeBalance = useCallback(async () => {
        //
    }, []);

    const {createVault, isProcessing: isCreateVaultProcessing} = useCreateVault(userWallet);

    const Content =
        userWallet === null ? (
            <Card color="glass" className="p-4 text-body Font_body_md">
                Connect Abstraxion account to see your portfolio.
            </Card>
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

                    <Button 
                        iconType="add" 
                        label="Create vault" 
                        status={isCreateVaultProcessing ? 'processing' : 'enabled'}
                        onClick={createVault} 
                    />

                    <ul>
                        {myVaults.map(myVault => (
                            <li key={myVault.multisigAddress}>
                                <button type="button" onClick={() => setSelectedVault(myVault)}>
                                    <Card color={fallbackVault?.multisigAddress === myVault.multisigAddress ? 'primary' : 'glass'} className="p-4">
                                        {myVault.multisigAddress}
                                    </Card>
                                </button>
                            </li>
                        ))}
                     
                    </ul>
                </section>

                {fallbackVault && (
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
                                    <CopyHelper toCopy={fallbackVault.multisigAddress} className="text-caption">
                                        <span className="w-fit truncate Font_caption_xs">
                                            {shortenAddress(fallbackVault.multisigAddress, 4, 4)}
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
                                    <CopyHelper toCopy={fallbackVault.icaControllerAddress} className="text-caption">
                                        <span className="w-fit truncate Font_caption_xs">
                                            {shortenAddress(fallbackVault.icaControllerAddress, 4, 4)}
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
                                    label="Deposit"
                                    iconType="arrow_forward"
                                    status={isDepositToVaultProcessing ? 'processing' : 'enabled'}
                                    onClick={handleDepositToVault}
                                />
                            </div>
                        </Card>

                        {/* <div className="flex flex-col gap-y-2">
                            <CopyHelper toCopy={fallbackVault.ica.icaMultisigAddress} className="text-body">
                                <div className="flex items-center gap-x-4">
                                    <div className="flex items-center">
                                        <div className="w-[132px] Font_caption_xs mr-4 text-left">Vault address (ICA)</div>
                                        <ChainLabel logoOnly chain={AllChains.INJECTIVE_TESTNET} />
                                    </div>

                                    <span className="w-fit truncate Font_button_md">
                                        {shortenAddress(fallbackVault.ica.icaMultisigAddress, 4, 4)}
                                    </span>
                                </div>
                            </CopyHelper>

                            <CopyHelper toCopy={fallbackVault.ica.icaControllerAddress} className="text-body">
                                <div className="flex items-center gap-x-4">
                                    <div className="flex items-center">
                                        <div className="w-[132px] Font_caption_xs mr-4 text-left">Multisig address</div>
                                        <ChainLabel logoOnly chain={AllChains.XION_TESTNET} />
                                    </div>

                                    <span className="w-fit truncate Font_button_md">
                                        {shortenAddress(fallbackVault.ica.icaControllerAddress, 4, 4)}
                                    </span>
                                </div>
                            </CopyHelper>
                        </div> */}

                        <section className="space-y-4 mt-4">
                            <Heading tagName="h4">Proposals</Heading>

                            {fallbackVault.proposals.map((proposal) => (
                                <Card key={proposal.proposal.id} color="primary" className="space-y-4 p-4">
                                    <div>
                                        #{proposal.proposal.id} {proposal.proposal.description}
                                    </div>
                                    {proposal.proposal.status === ProposalStatus.Pending && (
                                        <div className="flex justify-end gap-x-2">
                                            <Button
                                                color="on_primary"
                                                label="No"
                                                onClick={() => voteProposal(fallbackVault.multisigAddress, proposal.proposal.id, true)}
                                            />
                                            <Button
                                                color="on_primary"
                                                label="Yes"
                                                onClick={() => voteProposal(fallbackVault.multisigAddress, proposal.proposal.id, true)}
                                            />
                                        </div>
                                    )}
                                    {proposal.proposal.status !== ProposalStatus.Pending && (
                                        <div className="flex justify-end gap-x-2">
                                            <Tag size="sm" label={PROPOSAL_STATUS_LABEL_DICT[proposal.proposal.status]} />
                                        </div>
                                    )}
                                </Card>
                            ))}

                            {fallbackVault.proposals.length === 0 && (
                                <Card color="glass" className="p-4 text-body">
                                    No proposal found
                                </Card>
                            )}
                        </section>

                        <div className="flex flex-col gap-4 items-stretch mt-4">
                            <Heading tagName="h4">NFTs</Heading>

                            {fallbackVault.proposals.map((proposal) => (
                                <NFTVaultLinkCard
                                    key={proposal.nft.tokenId}
                                    href="raising-vault"
                                    nft={proposal.nft}
                                    amountLabel="Fixed price"
                                    formattedAmount={formatNumber(proposal.nft.fixedPrice.value, 18)}
                                    vaultAddress={fallbackVault.multisigAddress}
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

                {!fallbackVault && (
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
