import styles from './App.module.css';
import useTezos from './hooks/use-tezos';
import Footer from './components/footer/footer';
import BatchSwap from './components/batch-swap/batch-swap';

const App = () => {
    const {sync, unsync, auth} = useTezos();
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.heading}>Batch Swapper</h1>
            <p className={styles.subText}>Experimental app, use at your own risk.<br/>Make sure to double check swaps before and after transactions.</p>
            <p>{!auth
                ? <button onClick={sync}>Sync</button>
                : <button onClick={unsync}>Unsync</button>}
                {auth ? ' ' + auth.address : ' Sync Wallet to begin'}
            </p>
            {auth ? <BatchSwap/> : null}
            <Footer/>
        </div>
    );
};

export default App;
