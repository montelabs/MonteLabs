/* eslint-disable flowtype/require-valid-file-annotation */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

import { AuditedContract, AuditedContractPending } from './AuditedContract';
import Reports from './Reports';

import constants from './utils/constants.json';
import { getAuditedContracts, getIPFSAddress, getBlockTimestamp } from './utils/contractUtils';

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
      web3js: null,
      reports: [],
      evidences: [],
      allEvidences: [],
      ipfsProofs: [],
      showReports: false,
    };
  }

  toggleReports = (codeHash) => {
    let evidences = this.state.allEvidences.filter(evidence => (codeHash === evidence.codeHash));
    const ipfsProofs = (this.state.reports.find(report => (report.codeHash === codeHash)));
    this.setState({ ipfsProofs: ipfsProofs, evidences: evidences, showReports: true });
  }

  onCloseReports = () => {
    this.setState({ showReports: false });
  }

  async initialize(contract, ipfs) {
    if (contract == null || ipfs === null)
      return;
    const auditedContracts = await getAuditedContracts(contract, constants.MontelabsMS);
    this.setState({ reports: auditedContracts });
    const reportPromises = auditedContracts.map(async auditedContract => {
      const ipfsAddr = getIPFSAddress(auditedContract.ipfsHash);

      const ipfsObj = await ipfs.dag.get(ipfsAddr);
      const timestamp = await getBlockTimestamp(this.props.web3js, auditedContract.insertedBlock);
      return { ...ipfsObj, ...auditedContract, timestamp: timestamp }
    });
    const reportsList = (await Promise.all(reportPromises)).map(report => {
      return ({
        codeHash: report.codeHash,
        insertedBlock: report.insertedBlock,
        level: report.level,
        timestamp: report.timestamp,
        ...report.value
      });
    });
    this.setState({ reports: reportsList, allEvidences: [] });

    // Treat evidences
    auditedContracts.map(auditedContract => {
      contract.getPastEvents('AttachedEvidence', {
        filter: {
          auditorAddr: auditedContract.auditedBy,
          codeHash: auditedContract.codeHash
        }, fromBlock: auditedContract.insertedBlock, toBlock: 'latest'
      }, (err, events) => {
        events.map(async event => {
          const ipfsAddr = getIPFSAddress(event.returnValues.ipfsHash);
          const ipfsObj = await ipfs.dag.get(ipfsAddr);
          const timestamp = await getBlockTimestamp(this.props.web3js, event.blockNumber);
          this.setState(prevState => prevState.allEvidences.push({
            evidence: ipfsObj.value,
            codeHash: auditedContract.codeHash,
            timestamp: timestamp
          }));
        });
      });
    });

  }

  componentWillReceiveProps(newProps) {
    this.initialize(newProps.auditContract, newProps.ipfs);
  }

  render() {
    const { classes, auditContract } = this.props;
    const { reports, showReports, ipfsProofs, evidences } = this.state;

    return (
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          {showReports ? (
            <Reports ipfsProofs={ipfsProofs} evidences={evidences} onClose={this.onCloseReports} />
          ) : (
              <Grid container className={classes.demo} justify="flex-start" spacing={8}>
                {this.state.reports.map(value => {
                  if (value.pending) {
                    return (
                      <Grid key={value.codeHash} item>
                        <AuditedContractPending
                          auditContract={auditContract}
                          codeHash={value.codeHash}
                          insertedBlock={value.insertedBlock}
                        />
                      </Grid>
                    );
                  }
                  return (
                    <Grid key={value.codeHash} item>
                      <AuditedContract
                        auditContract={auditContract}
                        name={value.name}
                        logo={value.logo}
                        codeHash={value.codeHash}
                        shortDescription={value.shortDescription}
                        insertedBlock={value.insertedBlock}
                        proofs={value.proofs}
                        toggleReports={this.toggleReports}
                      />
                    </Grid>
                  )
                })}
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
