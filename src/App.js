import styles from './App.module.css';
import useTezos from './hooks/use-tezos';
import Footer from './components/footer/footer';
import BatchSwap from './components/batch-swap/batch-swap';
import BatchCancel from './components/batch-cancel/batch-cancel';
import BatchTransfer from './components/batch-transfer/batch-transfer';
import {NavLink, Route, Switch} from 'react-router-dom';
import Donations from './components/donations/donations';

const App = () => {
    const {sync, unsync, auth} = useTezos();
    return (
        <div className={styles.wrapper}>
            <div className={styles.headerBar}>
                <div className={styles.headerBarColumn}>
                    <h1 className={styles.heading}>Order & Chaos Tools</h1>
                    <p className={styles.subText}>
                        Experimental dApp, use at your own risk.<br/>
                        Make sure to double check everything before and after
                        transactions.
                    </p>
                    <p>
                        <NavLink exact to="/" activeClassName="active">
                            Batch Swap
                        </NavLink>
                        {' / '}
                        <NavLink
                            exact
                            to="/cancel-swaps"
                            activeClassName="active"
                        >
                            Batch Cancel
                        </NavLink>
                        {' / '}
                        <NavLink exact to="/transfer" activeClassName="active">
                            Batch Send
                        </NavLink>
                    </p>
                    <p>{!auth
                        ? <button onClick={sync}>Sync</button>
                        : <button onClick={unsync}>Unsync</button>}
                        {auth ? ' ' + auth.address : ' Sync Wallet to begin'}
                    </p>
                </div>
                <div className={styles.headerBarColumn}>
                    <Donations />
                </div>
            </div>
            <Switch>
                <Route exact path="/" component={auth ? BatchSwap : null}/>
                <Route
                    exact
                    path="/cancel-swaps"
                    component={auth ? BatchCancel : null}
                />
                <Route
                    exact
                    path="/transfer"
                    component={auth ? BatchTransfer : null}
                />
            </Switch>
            <Footer/>
        </div>
    );
};

export default App;
