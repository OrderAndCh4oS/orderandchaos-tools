import styles from './donations.module.css';
import {Field, Form, Formik} from 'formik';
import useTezos from '../../hooks/use-tezos';
import useTools from '../../hooks/use-tools';
import {useState} from 'react';

const Donations = () => {
    const {auth} = useTezos();
    const {xtzTransfer} = useTools();
    const [transactionStatus, setTransactionStatus] = useState(null);

    const handleDonate = async (values) => {
        if(!auth || values.xtz <= 0) return;
        setTransactionStatus('Transaction in progress…');
        const isSuccessful = await xtzTransfer(Number(values.xtz));
        setTransactionStatus(isSuccessful ? 'Objkts Swapped' : 'Failed');
        setTimeout(() => {
            setTransactionStatus(null);
        }, 2000);
    };

    const handleCloseToast = () => {
        setTransactionStatus(null);
    };

    return (
        <>
            <div className={styles.donations}>
                <h2 className={styles.heading}>Support</h2>
                <p>If you'd like to sling a few tez my way to support
                   development and maintenance of these tools,
                   please feel free to sync your wallet enter a modest amount
                   below or send funds
                   to <code>tz1fxorokU3AWY3C7cZGQEfoX22w2V7SMTke</code></p>
                <Formik
                    initialValues={{xtz: 0}}
                    onSubmit={handleDonate}
                >
                    <Form>
                        <p className={styles.field}>
                            <label htmlFor="xtz">xtz</label>
                            <Field
                                id="xtz"
                                name="xtz"
                                type="number"
                                placeholder="0"
                            />
                            <button type="submit">Donate</button>
                        </p>
                    </Form>
                </Formik>
            </div>
            {transactionStatus && (
                <div className={styles.toast}>
                    <p className={styles.toastText}>{transactionStatus}</p>
                    <button onClick={handleCloseToast}>Close</button>
                </div>
            )}
        </>
    );
};

export default Donations;
