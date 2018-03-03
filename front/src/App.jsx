import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import getWeb3 from './utils/getWeb3';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import AuditedContracts from './AuditedContracts';
import AuditJson from '../../build/contracts/Audit.json';

import constants from './utils/constants.json';

import IPFS from 'ipfs';

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
      errorMsg: null,
      auditContract: null,
      ipfs: null
    }
  }

  async componentWillMount() {
    try {
      const web3Results = await getWeb3();
      const ABI = AuditJson.abi;
      const contract = web3Results.web3js.eth.contract(ABI).at(constants.Audits);
      
      const ipfs = new IPFS();
      ipfs.on('ready', async () => {
        constants.IPFSNodes.map(node => {
          ipfs.swarm.connect(node.address, (err, connected) => {
            if (err) {
              console.error('[IPFS]', err);
            }
            else {
              console.log(`[IPFS] Connected to ${node.name}`);
            }
          });
        });
        this.setState({
          auditContract: contract,
          errorMsg: null,
          ipfs,
          ...web3Results});
      });
    }
    catch(error) {
      console.log('ERROR', error)
    }
  }

  // async componentWillMount() {
  //   let ipfs = new IPFS();
  //   ipfs.on('ready', async () => {
  //     this.setState(ipfs);
  //   });


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
        <AuditedContracts web3js={this.state.web3js} auditContract={this.state.auditContract} ipfs={this.state.ipfs} />
      </div>
    );
  }
}

export default withStyles(styles)(App)
