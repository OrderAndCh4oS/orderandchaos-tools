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
import {priceToXtz} from '../../api/get-swappable-objkts-by-wallet';

const BatchCancel = () => {
    const {auth} = useTezos();
    const {batchCancel} = useTools();
    const {viewType} = useView();
    const {objkts, setObjkts} = useObjkts();
    const [showSummary, setShowSummary] = useState(false);
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
        const cancelData = Object.values(selectedSwaps).map(so => so.swap.id);
        setShowSummary(false);

        await batchCancel(cancelData);
    };

    const handleShowSummary = () => {
        setShowSummary(true);
    };

    const handleClose = () => {
        setShowSummary(false);
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
                                <tr>
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
                        <button onClick={handleClose}>Close</button>
                        {' '}
                        <button onClick={handleBatchCancel}>Confirm</button>
                    </p>
                </div>
            )}
        </>
    );
};

export default BatchCancel;
