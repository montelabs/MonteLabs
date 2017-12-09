import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import getWeb3 from './utils/getWeb3';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import AuditedContracs from './AuditedContracts';

const styles = theme => ({
  flex: {
    flex: 'auto',
  }
});

class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      storageValue: 0,
      web3js: null,
      provider: 'unknown'
    }
  }

  componentWillMount() {
    getWeb3
    .then(results => {
      console.log(results)
      this.setState(
        results
      )
      this.instantiateContract();
    })
    .catch(() => {
      console.log('Error finding web3.');
    })
  }

  instantiateContract() {
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
    const { classes } = this.props;

    return (
      <div style={{marginLeft: 200, marginRight: 200}}>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography type='headline' color='inherit' className={classes.flex}>
              Security Audits
            </Typography>
            <Typography type='subheading' color='inherit' className={classes.flex}>
              Web3 Provider: {this.state.provider}
            </Typography>
            <Typography type='subheading' color='inherit'>
              Network: {this.state.networkName}
            </Typography>
          </Toolbar>
        </AppBar>
        <AuditedContracs />
      </div>
    );
  }
}

export default withStyles(styles)(App)
