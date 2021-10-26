/* eslint-disable no-sequences */
import useTezos from '../../hooks/use-tezos';
import useTools from '../../hooks/use-tools';
import {useEffect, useState} from 'react';
import styles from './batch-cancel.module.css';
import GridView from './grid-view';
import ListView from './list-view';
import useView from '../../hooks/use-view';
import useObjkts from '../../hooks/use-objkts';
import UtilityMenu from '../utility-menu/utility-menu';
import getSwappedObjktsByWallet from '../../api/get-swapped-objkts-by-wallet';
import getSwappableObjktsByWallet, {priceToXtz} from '../../api/get-swappable-objkts-by-wallet';

const BatchCancel = () => {
    const {auth} = useTezos();
    const {batchCancel} = useTools();
    const {viewType} = useView();
    const {objkts, setObjkts} = useObjkts();
    const [showSummary, setShowSummary] = useState(false);
    const [transactionStatus, setTransactionStatus] = useState(null);
    const [selectedSwaps, setSelectedSwaps] = useState({});

    useEffect(() => {
        (async() => {
            const objkts = await getSwappedObjktsByWallet(auth.address);
            setObjkts(objkts);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth]);

    const toggleSwap = ({swap, objkt}) => () => {
        if(swap.id in selectedSwaps) {
            delete selectedSwaps[swap.id];
            setSelectedSwaps({...selectedSwaps});
            return;
        }

        setSelectedSwaps(prevState => ({
            ...prevState,
            [swap.id]: {swap, objkt}
        }));
    };

    const handleBatchCancel = async() => {
        setTransactionStatus('Transaction in progress…');
        const cancelData = Object.values(selectedSwaps).map(so => so.swap.id);
        setSelectedSwaps({});
        setShowSummary(false);
        const isSuccessful = await batchCancel(cancelData);
        setTransactionStatus(isSuccessful ? 'Swaps Cancelled' : 'Failed');
        if(isSuccessful) {
            const objkts = await getSwappableObjktsByWallet(auth.address);
            setObjkts(objkts);
        }
        setTimeout(() => {
            setTransactionStatus(null);
        }, 2000);
    };

    const handleShowSummary = () => {
        setShowSummary(true);
    };

    const handleCloseModal = () => {
        setShowSummary(false);
    };

    const handleCloseToast = () => {
        setTransactionStatus(null);
    };

    useEffect(() => {
        if(!Object.values(selectedSwaps).length) setShowSummary(false);
    }, [selectedSwaps]);

    return (
        <>
            <div>
                <div className={styles.formHolder}>
                    <UtilityMenu/>
                </div>
                <p className={styles.field}>
                    <button
                        onClick={handleShowSummary}
                    >Cancel
                    </button>
                </p>
                {viewType === 'grid' && <GridView
                    objkts={objkts}
                    toggleSwap={toggleSwap}
                    selectedSwaps={selectedSwaps}
                />}
                {viewType === 'list' && <ListView
                    objkts={objkts}
                    toggleSwap={toggleSwap}
                    selectedSwaps={selectedSwaps}
                />}
            </div>
            {showSummary && (
                <div className={styles.summary}>
                    <div className={styles.summaryTableHolder}>
                        <table>
                            <thead>
                            <tr>
                                <th>Title</th>
                                <th>Amount</th>
                                <th>Price</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.values(selectedSwaps).map(s => (
                                <tr key={s.objkt.id}>
                                    <th>{s.objkt.title}</th>
                                    <th>{s.swap.amount_left}</th>
                                    <th>{priceToXtz(s.swap.price)}ꜩ</th>
                                    <td>
                                        <button
                                            onClick={toggleSwap(s)}
                                        >X</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <p className={styles.summaryButtons}>
                        <button onClick={handleCloseModal}>Close</button>
                        {' '}
                        <button onClick={handleBatchCancel}>Confirm</button>
                    </p>
                </div>
            )}
            {transactionStatus && (
                <div className={styles.toast}>
                    <p className={styles.toastText}>{transactionStatus}</p>
                    <button onClick={handleCloseToast}>Close</button>
                </div>
            )}
        </>
    );
};

export default BatchCancel;
