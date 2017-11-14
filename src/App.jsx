import React, { Component } from 'react';
// import SimpleStorageContract from '../build/contracts/MonteLabs.json';
import getWeb3 from './utils/getWeb3';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import AuditedContracs from './AuditedContracts';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null
    }
  }

  componentWillMount() {
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      this.instantiateContract();
    })
    .catch(() => {
      console.log('Error finding web3.');
    })
  }

  instantiateContract() {

    const contract = require('truffle-contract');
    // const simpleStorage = contract(SimpleStorageContract);
    // simpleStorage.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance;

    // Get accounts.
    // this.state.web3.eth.getAccounts((error, accounts) => {
    //   simpleStorage.deployed().then((instance) => {
    //     simpleStorageInstance = instance;

    //     // Stores a given value, 5 by default.
    //     return simpleStorageInstance.set(5, {from: accounts[0]})
    //   }).then((result) => {
    //     // Get the value from the contract to prove it worked.
    //     return simpleStorageInstance.get.call(accounts[0]);
    //   }).then((result) => {
    //     // Update state with the result.
    //     return this.setState({ storageValue: result.c[0] });
    //   })
    // })
  }

  render() {
    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography type="title" color="inherit">
              Audited codes
            </Typography>
          </Toolbar>
        </AppBar>
        <AuditedContracs />
      </div>
    );
  }
}

export default App
