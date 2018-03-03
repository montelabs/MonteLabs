/* eslint-disable flowtype/require-valid-file-annotation */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

import verifiedContracts from './utils/verifiedContracts.json';
import AuditedContract from './AuditedContract';
import Reports from './Reports';

import constants from './utils/constants.json';
import { getAuditedContracts, getIPFSAddress } from './utils/contractUtils';

import IPFS from 'ipfs'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

class AuditedContracts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reports: [],
      ipfsProofs: [],
      showReports: false,
    };
  }

  toggleReports = (ipfsProofs) => {
    this.setState({ ipfsProofs: ipfsProofs, showReports: true });
  }

  onCloseReports = () => {
    this.setState({ showReports: false });
  }

  async initialize(contract, ipfs) {
    if (contract == null || ipfs === null)
      return;
    const auditedContracts = await getAuditedContracts(contract, constants.MontelabsMS);
    const reportPromises = auditedContracts.map(async auditedContract => {
      const ipfsAddr = getIPFSAddress(auditedContract.ipfsHash);
      
      const ipfsObj = await ipfs.dag.get(ipfsAddr);
      return {...ipfsObj, ...auditedContract}
    });
    const reportsList = (await Promise.all(reportPromises)).map(report => {
      return({
        codeHash: report.codeHash,
        insertedBlock: report.insertedBlock,
        level: report.level,
        ...report.value
      });
    }); 
    this.setState({reports: reportsList});
  }

  componentWillReceiveProps(newProps) {
    this.initialize(newProps.auditContract, newProps.ipfs);
  }

  render() {
    const { classes, auditContract } = this.props;
    const { reports, showReports, ipfsProofs } = this.state;

    return (
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          {showReports ? (
            <Reports ipfsProofs={ipfsProofs} onClose={this.onCloseReports} />
          ) : (
              <Grid container className={classes.demo} justify="flex-start" spacing={8}>
                {this.state.reports.map(value => (
                  <Grid key={value.name} item>
                    <AuditedContract
                      auditContract={auditContract}
                      name={value.name}
                      codeHash={value.codeHash}
                      shortDescription={value.shortDescription}
                      insertedBlock={value.insertedBlock}
                      proofs={value.proofs}
                      toggleReports={this.toggleReports}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
        </Grid>
      </Grid>
    );
  }
}

AuditedContracts.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AuditedContracts);
