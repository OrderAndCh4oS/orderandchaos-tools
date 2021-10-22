/* eslint-disable no-sequences */
import useTezos from '../../hooks/use-tezos';
import useTools from '../../hooks/use-tools';
import {useEffect, useState} from 'react';
import getObjktsByWallet from '../../api/get-objkts-by-wallet';
import styles from './batch-swap.module.css';
import {Field, Form, Formik} from 'formik';

const BatchSwap = () => {
    const {auth} = useTezos();
    const {batchSwap} = useTools();
    const [objkts, setObjkts] = useState();
    const [defaultValues, setDefaultValues] = useState({
        xtz: 10,
        amount: 1
    });
    const [swapObjkts, setSwapObjkts] = useState({});

    useEffect(() => {
        (async() => {
            const objkts = await getObjktsByWallet(auth.address);
            setObjkts(objkts);
        })();
    }, [auth]);

    const toggleObjkt = (objkt) => () => {
        if(objkt.id in swapObjkts) {
            delete swapObjkts[objkt.id];
            setSwapObjkts({...swapObjkts});
            return;
        }

        setSwapObjkts(prevState => ({
            ...prevState,
            [objkt.id]: {objkt, ...defaultValues}
        }));
    };

    const handleBatchSwap = async() => {
        const swapData = Object.values(swapObjkts).map(so => ({
            id: so.objkt.id,
            creator: so.objkt.creator_id,
            royalties: so.objkt.royalties,
            xtz: so.xtz,
            amount: so.amount
        }));

        await batchSwap(swapData);
    };

    const handleOverrideSubmit = (values) => {
        setDefaultValues(prevState => ({...prevState, ...values}));
        setSwapObjkts(prevState => (Object
            .entries(prevState)
            .reduce((obj, [k, v]) => (obj[k] = {...v, ...values}, obj), {})));
    };

    const handleObjktChange = (type, objkt) => (event) => {
        setSwapObjkts(prevState => {
            const result = {...prevState};
            result[objkt.id][type] = Number(event.target.value);
            return result;
        });
    };

    const handleSort = (event) => {
        switch(event.target.value) {
            case 'id-asc':
                setObjkts(prevState => ([...prevState.sort((a, b) => a.id - b.id)]))
                break;
            case 'id-desc':
                setObjkts(prevState => ([...prevState.sort((a, b) => b.id - a.id)]));
                break;
            case 'floor-asc':
                setObjkts(prevState => ([...prevState.sort((a, b) => a.floor - b.floor)]))
                break;
            case 'floor-desc':
                setObjkts(prevState => ([...prevState.sort((a, b) => b.floor - a.floor)]));
                break;
            case 'last-asc':
                setObjkts(prevState => ([...prevState.sort((a, b) => (a.tradeData?.last || -1) - (b.tradeData?.last || -1))]))
                break;
            case 'last-desc':
                setObjkts(prevState => ([...prevState.sort((a, b) => (b.tradeData?.last || -1) - (a.tradeData?.last || -1))]))
                break;
            case 'avg-asc':
                setObjkts(prevState => ([...prevState.sort((a, b) => (a.tradeData?.avg || -1) - (b.tradeData?.avg || -1))]))
                break;
            case 'avg-desc':
                setObjkts(prevState => ([...prevState.sort((a, b) => (b.tradeData?.avg || -1) - (a.tradeData?.avg || -1))]))
                break;
            default:
                console.log('Unhandled type')
        }
    };

    return (
        <div>
            <div className={styles.formHolder}>
                <div className={styles.overridesHolder}>
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
                <div className={styles.sortHolder}>
                    <label htmlFor="sortOn">Sort On</label>
                    <select onChange={handleSort} id='sortOn' defaultValue={'id-desc'}>
                        <option value={'id-desc'}>Objkt ID (desc)</option>
                        <option value={'id-asc'}>Objkt ID (asc)</option>
                        <option value={'floor-desc'}>Floor (desc)</option>
                        <option value={'floor-asc'}>Floor (asc)</option>
                        <option value={'last-desc'}>Last (desc)</option>
                        <option value={'last-asc'}>Last (asc)</option>
                        <option value={'avg-desc'}>Avg (desc)</option>
                        <option value={'avg-asc'}>Avg (asc)</option>
                    </select>
                </div>
            </div>
            <p className={styles.field}>
                <button
                    onClick={handleBatchSwap}
                >Swap
                </button>
            </p>
            <div className={styles.grid}>
                {objkts && objkts.map(objkt => (
                    <div key={objkt.id} className={styles.gridCell}>
                        <div className={styles.cell}>
                            <img
                                alt={objkt.title}
                                loading="lazy"
                                className={styles.img}
                                src={`https://cloudflare-ipfs.com/ipfs/${objkt.display_uri.slice(
                                    7)}`}
                            />
                            <div className={styles.objktInfo}>
                                <h2 className={styles.title}>#{objkt.id} {objkt.title}</h2>
                                <p className={styles.text}>{objkt.creator_id}</p>
                                <p className={styles.text}>Royalties {objkt.royalties /
                                10}%</p>
                                <p className={styles.text}>Swappable {objkt.totalPossessed}</p>
                                {objkt.tradeData && <p className={styles.text}>
                                    Min&nbsp;{objkt.tradeData.min}ꜩ
                                    Max&nbsp;{objkt.tradeData.max}ꜩ
                                    Avg&nbsp;{objkt.tradeData.average}ꜩ
                                    Last&nbsp;{objkt.tradeData.last}ꜩ
                                </p>}
                                {objkt.floor &&
                                <p className={styles.text}>Floor&nbsp;{objkt.floor}ꜩ</p>}
                            </div>
                            <p>
                                <button
                                    onClick={toggleObjkt(objkt)}
                                    className={styles.selectButton}
                                >{
                                    objkt.id in
                                    swapObjkts
                                        ? 'Deselect'
                                        : 'Select'
                                }</button>
                            </p>
                            {objkt.id in swapObjkts && <div>
                                <p>
                                    <label htmlFor={`${objkt.id}Xtz`}>xtz</label>
                                    <input
                                        id={`${objkt.id}Xtz`}
                                        type="number"
                                        min={0.000001}
                                        value={swapObjkts?.[objkt.id].xtz}
                                        onChange={handleObjktChange('xtz',
                                            objkt)}
                                    />
                                </p>
                                <p>
                                    <label htmlFor={`${objkt.id}Amount`}>Amount</label>
                                    <input
                                        id={`${objkt.id}Amount`}
                                        type="number"
                                        min={1}
                                        max={objkt.totalPossessed}
                                        value={swapObjkts?.[objkt.id].amount}
                                        onChange={handleObjktChange('amount',
                                            objkt)}
                                    />
                                </p>
                            </div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BatchSwap;
