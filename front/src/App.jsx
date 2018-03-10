import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import getWeb3 from './utils/getWeb3';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/Menu/MenuItem';

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
      ipfs: null,
    }
  }

  // FIXME: Are there race conditions with window.web3?
  async componentDidMount() {
    try {
      const web3Results = await getWeb3();
      const ABI = AuditJson.abi;
      const contract = new web3Results.web3js.eth.Contract(ABI, constants.Audits);

      const ipfs = new IPFS();
      ipfs.on('ready', async () => {
        constants.IPFSNodes.map(node => {
          ipfs.swarm.connect(node.address, (err, connected) => {
            if (err) {
              console.error(`[IPFS] Could not connect to ${node.name}`);
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
          ...web3Results
        });
      });
    }
    catch (error) {
      console.log('ERROR', error)
    }
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

  handleChange = name => async event => {
    const web3Results = await getWeb3({ provider: event.target.value });
    this.setState({ ...web3Results });
  };

  render() {
    const { classes } = this.props;
    const providers = [
      {
        value: 'local',
        label: 'Local',
      },
      {
        value: 'metamask',
        label: 'MetaMask',
      },
      {
        value: 'native',
        label: 'Browser',
      },
      {
        value: 'infura',
        label: 'Infura',
      },
    ];

    return (
      <div className={classes.wrapper}>
        <AppBar position='static' color='default'>
          <Toolbar>
            <Typography variant='headline' color='inherit' className={classes.flex}>
              Security Audits
            </Typography>
            <Typography variant='subheading' color='inherit' className={classes.flex}>
              <TextField
                id='select-Provider'
                select
                label='Provider'
                className={classes.textField}
                value={this.state.provider}
                onChange={this.handleChange('provider')}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu,
                  },
                }}
              >{providers.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
              </TextField>

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
