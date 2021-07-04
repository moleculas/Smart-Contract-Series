import React, { useState, useEffect } from "react";
import AppRouter from "./AppRouter.js";
import { getAccount, getHomeTransactions } from "./contracts";
import Navbar from './Navbar';
//import detectEthereumProvider from '@metamask/detect-provider';

import "./App.css";

const App = () => {
  const [state, setState] = useState({
    account: null,
    homeTransactions: null,
    web3error: null
  });
  useEffect(() => {
    const exec = async () => {
      try {
        // Request account access if needed
       // await window.ethereum.enable();
       await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Acccounts now exposed
      } catch (error) {
        window.alert('Navegador Ethereum no detectat. Considera instal·lar Metamask.')
      }
      try {
        const account = await getAccount();
        const homeTransactions = await getHomeTransactions();
        setState({ homeTransactions, account });
      } catch (e) {
        setState({ web3error: e });
      }
    };

    exec();
  }, []);

  const { account, homeTransactions, web3error } = state;

  return (<div>
    <Navbar />
    <AppRouter
      account={account}
      homeTransactions={homeTransactions}
      web3error={web3error}
    />
    </div>
  );
};

export default App;
