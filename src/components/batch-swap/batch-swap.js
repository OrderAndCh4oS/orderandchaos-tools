/* eslint-disable no-sequences */
import useTezos from '../../hooks/use-tezos';
import useTools from '../../hooks/use-tools';
import {useEffect, useState} from 'react';
import getSwappableObjktsByWallet from '../../api/get-swappable-objkts-by-wallet';
import styles from './batch-swap.module.css';
import {Field, Form, Formik} from 'formik';
import GridView from './grid-view';
import ListView from './list-view';
import useView from '../../hooks/use-view';
import useObjkts from '../../hooks/use-objkts';
import UtilityMenu from '../utility-menu/utility-menu';

const BatchSwap = () => {
    const {auth} = useTezos();
    const {batchSwap} = useTools();
    const {viewType} = useView();
    const {objkts, setObjkts} = useObjkts();
    const [showSummary, setShowSummary] = useState(false);
    const [defaultValues, setDefaultValues] = useState({
        xtz: 10,
        amount: 1
    });
    const [selectedObjkts, setSelectedObjkts] = useState({});

    useEffect(() => {
        (async() => {
            const objkts = await getSwappableObjktsByWallet(auth.address);
            setObjkts(objkts);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth]);

    const toggleObjkt = (objkt) => () => {
        if(objkt.id in selectedObjkts) {
            delete selectedObjkts[objkt.id];
            setSelectedObjkts({...selectedObjkts});
            return;
        }

        setSelectedObjkts(prevState => ({
            ...prevState,
            [objkt.id]: {objkt, ...defaultValues}
        }));
    };

    const handleBatchSwap = async() => {
        const swapData = Object.values(selectedObjkts).map(so => ({
            id: so.objkt.id,
            creator: so.objkt.creator_id,
            royalties: so.objkt.royalties,
            xtz: so.xtz,
            amount: so.amount
        }));
        setShowSummary(false);

        await batchSwap(swapData);
    };

    const handleOverrideSubmit = (values) => {
        setDefaultValues(prevState => ({...prevState, ...values}));
        setSelectedObjkts(prevState => (Object
            .entries(prevState)
            .reduce((obj, [k, v]) => (obj[k] = {...v, ...values}, obj), {})));
    };

    const handleObjktChange = (type, objkt) => (event) => {
        setSelectedObjkts(prevState => {
            const result = {...prevState};
            result[objkt.id][type] = Number(event.target.value);
            return result;
        });
    };

    const handleShowSummary = () => {
        setShowSummary(true);
    };

    const handleClose = () => {
        setShowSummary(false);
    };

    useEffect(() => {
        if(!Object.values(selectedObjkts).length) setShowSummary(false);
    }, [selectedObjkts]);

    return (
        <>
            <div>
                <div className={styles.formHolder}>
                    <div>
                        <Formik
                            initialValues={{xtz: defaultValues.xtz}}
                            onSubmit={handleOverrideSubmit}
                        >
                            <Form>
                                <p className={styles.field}>
                                    <label htmlFor="xtz">xtz</label>
                                    <Field
                                        id="xtz"
                                        name="xtz"
                                        type="number"
                                        placeholder="10"
                                    />
                                    <button type="submit">Override</button>
                                </p>
                            </Form>
                        </Formik>
                        <Formik
                            initialValues={{amount: defaultValues.amount}}
                            onSubmit={handleOverrideSubmit}
                        >
                            <Form>
                                <p className={styles.field}>
                                    <label htmlFor="amount">amount</label>
                                    <Field
                                        id="amount"
                                        name="amount"
                                        type="number"
                                        min="1"
                                        max="10000"
                                        placeholder="1"
                                    />
                                    <button type="submit">Override</button>
                                </p>
                            </Form>
                        </Formik>
                    </div>
                    <UtilityMenu/>
                </div>
                <p className={styles.field}>
                    <button
                        onClick={handleShowSummary}
                    >Swap
                    </button>
                </p>
                {viewType === 'grid' && <GridView
                    objkts={objkts}
                    toggleObjkt={toggleObjkt}
                    selectedObjkts={selectedObjkts}
                    handleObjktChange={handleObjktChange}
                />}
                {viewType === 'list' && <ListView
                    objkts={objkts}
                    toggleObjkt={toggleObjkt}
                    selectedObjkts={selectedObjkts}
                    handleObjktChange={handleObjktChange}
                />}
            </div>
            {showSummary && (
                <div className={styles.summary}>
                    <div className={styles.summaryTableHolder}>
                        <table>
                            <tr>
                                <th>Title</th>
                                <th>Qty</th>
                                <th>Price</th>
                            </tr>
                            {Object.values(selectedObjkts).map(so => (
                                <tr>
                                    <th>{so.objkt.title}</th>
                                    <td>{so.amount}</td>
                                    <td>{so.xtz}ꜩ</td>
                                    <td>
                                        <button
                                            onClick={toggleObjkt(so.objkt)}
                                        >X
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </table>
                    </div>
                    <p className={styles.summaryButtons}>
                        <button onClick={handleClose}>Close</button>
                        {' '}
                        <button onClick={handleBatchSwap}>Confirm</button>
                    </p>
                </div>
            )}
        </>
    );
};

export default BatchSwap;
