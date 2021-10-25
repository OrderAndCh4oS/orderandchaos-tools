import styles from './App.module.css';
import useTezos from './hooks/use-tezos';
import Footer from './components/footer/footer';
import BatchSwap from './components/batch-swap/batch-swap';
import BatchCancel from './components/batch-cancel/batch-cancel';
import {Link, Route, Switch} from 'react-router-dom';

const App = () => {
    const {sync, unsync, auth} = useTezos();
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.heading}>Order & Chaos Tools</h1>
            <p className={styles.subText}>Experimental app, use at your own risk.<br/>Make sure to double check swaps before and after transactions.</p>
            <p>
                <Link to="/">Batch Swap</Link>{' / '}
                <Link to="/cancel-swaps">Batch Cancel</Link>
            </p>
            <p>{!auth
                ? <button onClick={sync}>Sync</button>
                : <button onClick={unsync}>Unsync</button>}
                {auth ? ' ' + auth.address : ' Sync Wallet to begin'}
            </p>
            <Switch>
                <Route exact path='/' component={auth ? BatchSwap : null} />
                <Route exact path='/cancel-swaps' component={auth ? BatchCancel : null} />
            </Switch>
            <Footer/>
        </div>
    );
};

export default App;
