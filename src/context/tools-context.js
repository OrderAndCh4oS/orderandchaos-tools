import {createContext} from 'react';
import useTezos from '../hooks/use-tezos';
import {OpKind} from '@taquito/taquito';

export const ToolsContext = createContext({
    getBalance: async() => {},
    batchSwap: async() => {}
});

const contracts = {
    subjkt: 'KT1My1wDZHDGweCrJnQJi3wcFaS67iksirvj',
    v1: 'KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9',
    v2: 'KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn',
    objkts: 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton'
};

const ToolsProvider = ({children}) => {
    const {Tezos, auth} = useTezos();

    const getBalance = async() => {
        const balance = await Tezos.tz.getBalance(auth.address);

        return balance / 1000000;
    };

    const batchSwap = async(objktsToSwap) => {
        const objkts = await Tezos.wallet.at(contracts.objkts);
        const marketplace = await Tezos.wallet.at(contracts.v2);

        const list = objktsToSwap.reduce((arr, o) =>
                [
                    ...arr,
                    {
                        kind: OpKind.TRANSACTION,
                        ...objkts.methods.update_operators([
                            {
                                add_operator: {
                                    operator: contracts.v2,
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
                            o.creator,
                            parseInt(o.amount),
                            parseInt(o.id),
                            parseFloat(o.royalties),
                            parseFloat(o.xtz) * 1000000
                        )
                            .toTransferParams(
                                {amount: 0, mutez: true, storageLimit: 270}
                            )
                    }
                ]
            , []);
        const batch = await Tezos.wallet.batch(list);
        return await batch.send();
    };

    const batchCancel = async(swapsToCancel) => {
        const v2 = await Tezos.wallet.at(contracts.v2);
        const list = await swapsToCancel.reduce(
            (arr, swapId) => ([
                ...arr,
                {
                    kind: OpKind.TRANSACTION,
                    ...v2.methods.cancel_swap(swapId).toTransferParams(
                        {amount: 0, storageLimit: 150}
                    )
                }
            ]),
            []
        );

        const batch = await Tezos.wallet.batch(list);
        return await batch.send();
    };

    return (
        <ToolsContext.Provider
            value={{
                getBalance,
                batchSwap,
                batchCancel
            }}
        >
            {children}
        </ToolsContext.Provider>
    );
};

export default ToolsProvider;
