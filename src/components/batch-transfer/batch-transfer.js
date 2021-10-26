/* eslint-disable no-sequences */
import useTezos from '../../hooks/use-tezos';
import useTools from '../../hooks/use-tools';
import {useEffect, useState} from 'react';
import getSwappableObjktsByWallet
    from '../../api/get-swappable-objkts-by-wallet';
import styles from './batch-transfer.module.css';
import {Field, Form, Formik} from 'formik';
import GridView from './grid-view';
import ListView from './list-view';
import useView from '../../hooks/use-view';
import useObjkts from '../../hooks/use-objkts';
import UtilityMenu from '../utility-menu/utility-menu';

const BatchTransfer = () => {
    const {auth} = useTezos();
    const {batchTransfer} = useTools();
    const {viewType} = useView();
    const {objkts, setObjkts} = useObjkts();
    const [showSummary, setShowSummary] = useState(false);
    const [transactionStatus, setTransactionStatus] = useState(null);
    const [defaultValues, setDefaultValues] = useState({
        address: '',
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

    const handleBatchTransfer = async() => {
        setTransactionStatus('Transaction in progress…');
        const data = Object.values(selectedObjkts).map(so => ({
            id: so.objkt.id,
            address: so.address,
            amount: Number(so.amount)
        }));
        setSelectedObjkts({});
        setShowSummary(false);
        console.log(data);
        const isSuccessful = await batchTransfer(data);

        setTransactionStatus(isSuccessful ? 'Objkts Sent' : 'Failed');
        if(isSuccessful) {
            const objkts = await getSwappableObjktsByWallet(auth.address);
            setObjkts(objkts);
        }
        setTimeout(() => {
            setTransactionStatus(null);
        }, 2000);
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
            result[objkt.id][type] = event.target.value;
            return result;
        });
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
        if(!Object.values(selectedObjkts).length) setShowSummary(false);
    }, [selectedObjkts]);

    return (
        <>
            <div>
                <div className={styles.formHolder}>
                    <div>
                        <Formik
                            initialValues={{address: defaultValues.address}}
                            onSubmit={handleOverrideSubmit}
                        >
                            <Form>
                                <p className={styles.field}>
                                    <label htmlFor="address">address</label>
                                    <Field
                                        id="address"
                                        name="address"
                                        placeholder="tz1…"
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
                    >Send
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
                            <thead>
                            <tr>
                                <th>Title</th>
                                <th>Qty</th>
                                <th>Address</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.values(selectedObjkts).map(so => (
                                <tr key={so.objkt.id}>
                                    <th>{so.objkt.title}</th>
                                    <td>{so.amount}</td>
                                    <td>{so.address.slice(0,
                                        5)}…{so.address.slice(-5)}</td>
                                    <td>
                                        <button onClick={toggleObjkt(so.objkt)}>
                                            X
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <p className={styles.summaryButtons}>
                        <button onClick={handleCloseModal}>Close</button>
                        {' '}
                        <button onClick={handleBatchTransfer}>Confirm</button>
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

export default BatchTransfer;
