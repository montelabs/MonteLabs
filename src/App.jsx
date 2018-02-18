import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import getWeb3 from './utils/getWeb3';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import AuditedContracs from './AuditedContracts';

import MonteLabsContractJson from '../compiledContracts/MonteLabs.json';

const styles = theme => ({
  flex: {
    flex: 'auto',
  },
  wrapper: {
    marginLeft: 200,
    marginRight: 200
  },
});

class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      storageValue: 0,
      web3js: null,
      provider: 'unknown',
      errorMsg: null
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
    const web3js = this.state.web3js;

    if (!(this.state.networkId in MonteLabsContractJson.deployed)) {
      this.setState({errorMsg: 'Contract not deployed in this network'});
      return;
    }
    const ABI = MonteLabsContractJson.abi;
    const address = MonteLabsContractJson.deployed[this.state.networkId];
    try {
      const contract = new web3js.eth.Contract(ABI, address);
      this.setState({monteLabsContract: contract, errorMsg: null});
    }
    catch(error) {
      console.log('ERROR', error)
    }

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

  ErrorBar = () => {
    if (this.state.errorMsg == null) return null;
    return (
    <AppBar position='static' color='inherit'>
      <Typography variant='headline' color='error'>
        Error: {this.state.errorMsg}
      </Typography>
    </AppBar>
    )
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.wrapper}>
        <AppBar position='static' color='default'>
          <Toolbar>
            <Typography variant='headline' color='inherit' className={classes.flex}>
              Security Audits
            </Typography>
            <Typography variant='subheading' color='inherit' className={classes.flex}>
              Web3 Provider: {this.state.provider}
            </Typography>
            <Typography variant='subheading' color='inherit'>
              Network: {this.state.networkName}
            </Typography>
          </Toolbar>
        </AppBar>
        <this.ErrorBar />
        <AuditedContracs />
      </div>
    );
  }
}

export default withStyles(styles)(App)
