import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import getWeb3 from './utils/getWeb3';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import AuditedContracts from './AuditedContracts';
import AuditJson from '../../build/contracts/Audit.json';

import constants from './utils/constants.json';

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
      provider: 'unknown',
      errorMsg: null,
      auditContract: null,
    }
  }

  // FIXME: Are there race conditions with window.web3?
  async componentDidMount() {
    try {
      const web3Results = await getWeb3();
      const ABI = AuditJson.abi;
      const contract = new web3Results.web3js.eth.Contract(ABI, constants.contracts[web3Results.networkId].Audits);

      this.setState({
        auditContract: contract,
        errorMsg: null,
        ...web3Results
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
            <Typography variant='Title' color='inherit' className={classes.flex}>
              Montelabs
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
        <AuditedContracts
          web3js={this.state.web3js}
          auditContract={this.state.auditContract}
          networkId={this.state.networkId} />
      </div>
    );
  }
}

export default withStyles(styles)(App)
