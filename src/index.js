import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import TezosProvider from './context/tezos-context';
import ToolsProvider from './context/tools-context';
import ViewProvider from './context/view-context';
import ObjktsProvider from './context/objkts-context';
import {BrowserRouter} from 'react-router-dom';

ReactDOM.render(
    <React.StrictMode>
        <TezosProvider>
            <ToolsProvider>
                <ViewProvider>
                    <ObjktsProvider>
                        <BrowserRouter>
                            <App/>
                        </BrowserRouter>
                    </ObjktsProvider>
                </ViewProvider>
            </ToolsProvider>
        </TezosProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
