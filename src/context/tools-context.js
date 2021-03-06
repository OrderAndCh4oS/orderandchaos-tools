import {createContext} from 'react';
import useTezos from '../hooks/use-tezos';
import {OpKind} from '@taquito/taquito';

export const ToolsContext = createContext({
    getBalance: async() => {},
    batchSwap: async() => {},
    batchCancel: async() => {},
    batchTransfer: async() => {},
    xtzTransfer: async() => {}
});

const contracts = {
    subjkt: 'KT1My1wDZHDGweCrJnQJi3wcFaS67iksirvj',
    v1: 'KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9',
    v2: 'KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn',
    teia: 'KT1PHubm9HtyQEJ4BBpMTVomq6mhbfNZ9z5w',
    objkts: 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton'
};

const confirmations = 2;

const ToolsProvider = ({children}) => {
    const {Tezos, auth} = useTezos();

    const getBalance = async() => {
        const balance = await Tezos.tz.getBalance(auth.address);

        return balance / 1000000;
    };

    // const batchSwap = async(objktsToSwap) => {
    //     try {
    //         const objkts = await Tezos.wallet.at(contracts.objkts);
    //         const marketplace = await Tezos.wallet.at(contracts.v2);
    //
    //         const list = objktsToSwap.reduce((arr, o) =>
    //                 [
    //                     ...arr,
    //                     {
    //                         kind: OpKind.TRANSACTION,
    //                         ...objkts.methods.update_operators([
    //                             {
    //                                 add_operator: {
    //                                     operator: contracts.v2,
    //                                     token_id: parseInt(o.id),
    //                                     owner: auth.address
    //                                 }
    //                             }])
    //                             .toTransferParams(
    //                                 {amount: 0, mutez: true, storageLimit: 100}
    //                             )
    //                     },
    //                     {
    //                         kind: OpKind.TRANSACTION,
    //                         ...marketplace.methods.swap(
    //                             o.creator,
    //                             parseInt(o.amount),
    //                             parseInt(o.id),
    //                             parseFloat(o.royalties),
    //                             Math.round(parseFloat(o.xtz) * 1000000)
    //                         )
    //                             .toTransferParams(
    //                                 {amount: 0, mutez: true, storageLimit: 270}
    //                             )
    //                     },
    //                     {
    //                         kind: OpKind.TRANSACTION,
    //                         ...objkts.methods.update_operators([
    //                             {
    //                                 remove_operator: {
    //                                     operator: contracts.v2,
    //                                     token_id: parseFloat(o.id),
    //                                     owner: auth.address
    //                                 }
    //                             }])
    //                             .toTransferParams(
    //                                 {amount: 0, mutez: true, storageLimit: 175}
    //                             )
    //                     }
    //                 ]
    //             , []);
    //         const batch = await Tezos.wallet.batch(list);
    //         const operation = await batch.send();
    //         await operation.confirmation(confirmations);
    //     } catch(e) {
    //         console.log('Error:', e);
    //         return false;
    //     }
    //     return true;
    // };

    const batchSwapTeia = async(objktsToSwap) => {
        try {
            const objktsAddress = 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton';
            const objkts = await Tezos.wallet.at(contracts.objkts);
            const marketplace = await Tezos.wallet.at(contracts.teia);

            const list = objktsToSwap.reduce((arr, o) =>
                    [
                        ...arr,
                        {
                            kind: OpKind.TRANSACTION,
                            ...objkts.methods.update_operators([
                                {
                                    add_operator: {
                                        operator: contracts.teia,
                                        token_id: parseInt(o.id),
                                        owner: auth.address
                                    }
                                }])
                                .toTransferParams(
                                    {amount: 0, mutez: true, storageLimit: 100}
                                )
                        },
                        {
                            kind: OpKind.TRANSACTION,
                            ...marketplace.methods.swap(
                                objktsAddress,
                                parseInt(o.id),
                                parseInt(o.amount),
                                Math.round(parseFloat(o.xtz) * 1000000),
                                parseFloat(o.royalties),
                                o.creator,
                            )
                                .toTransferParams(
                                    {amount: 0, mutez: true, storageLimit: 300}
                                )
                        },
                        {
                            kind: OpKind.TRANSACTION,
                            ...objkts.methods.update_operators([
                                {
                                    remove_operator: {
                                        operator: contracts.teia,
                                        token_id: parseFloat(o.id),
                                        owner: auth.address
                                    }
                                }])
                                .toTransferParams(
                                    {amount: 0, mutez: true, storageLimit: 175}
                                )
                        }
                    ]
                , []);
            const batch = await Tezos.wallet.batch(list);
            const operation = await batch.send();
            await operation.confirmation(confirmations);
        } catch(e) {
            console.log('Error:', e);
            return false;
        }
        return true;
    };

    function getCancelTransaction(v1Contract, v2Contract, teiaContract, {swapId, contract}) {
        if(contract === 'KT1PHubm9HtyQEJ4BBpMTVomq6mhbfNZ9z5w')
            return {
                kind: OpKind.TRANSACTION,
                ...teiaContract.methods.cancel_swap(swapId).toTransferParams(
                    {amount: 0, storageLimit: 150}
                )
            };
        if(contract === 'KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn')
            return {
                kind: OpKind.TRANSACTION,
                ...v2Contract.methods.cancel_swap(swapId).toTransferParams(
                    {amount: 0, storageLimit: 150}
                )
            };
        if(contract === 'KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9')
            return {
                kind: OpKind.TRANSACTION,
                ...v1Contract.methods.cancel_swap(swapId).toTransferParams(
                    {amount: 0, storageLimit: 150}
                )
            };

        throw new Error('Unhandled Contract Address');
    }

    const batchCancel = async(swapsToCancel) => {
        try {
            const v1Contract = await Tezos.wallet.at(contracts.v1);
            const v2Contract = await Tezos.wallet.at(contracts.v2);
            const teiaContract = await Tezos.wallet.at(contracts.teia);
            const list = await swapsToCancel.reduce(
                (arr, swap) => ([
                    ...arr,
                    getCancelTransaction(v1Contract, v2Contract, teiaContract, swap)
                ]),
                []
            );

            const batch = await Tezos.wallet.batch(list);
            const operation = await batch.send();
            await operation.confirmation(confirmations);
        } catch(e) {
            console.log('Error:', e);
            return false;
        }
        return true;
    };

    const batchTransfer = async(objktsToTransfer) => {
        try {
            const objkts = await Tezos.wallet.at(contracts.objkts);
            const params = [
                {
                    from_: auth.address,
                    txs: objktsToTransfer.map(data => ({
                            to_: data.address,
                            token_id: data.id,
                            amount: data.amount
                        })
                    )
                }
            ];
            const operation = await objkts.methods.transfer(params)
                .send({amount: 0, mutez: true});
            await operation.confirmation(confirmations);
        } catch(e) {
            console.log('Error:', e);
            return false;
        }
        return true;
    };

    const xtzTransfer = async(xtz) => {
        try {
            const operation = await Tezos.wallet
                .transfer(
                    {to: 'tz1fxorokU3AWY3C7cZGQEfoX22w2V7SMTke', amount: xtz}
                ).send();
            await operation.confirmation(confirmations);
        } catch(e) {
            console.log('Error:', e);
            return false;
        }
        return true;
    };

    return (
        <ToolsContext.Provider
            value={{
                getBalance,
                batchSwap: batchSwapTeia,
                batchCancel,
                batchTransfer,
                xtzTransfer
            }}
        >
            {children}
        </ToolsContext.Provider>
    );
};

export default ToolsProvider;
