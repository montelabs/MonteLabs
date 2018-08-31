/* eslint-disable flowtype/require-valid-file-annotation */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { AuditedContract, AuditedContractPending } from './AuditedContract';
import Reports from './Reports';

import constants from './utils/constants.json';
import { getAuditedContracts, getIPFSAddress, getBlockTimestamp } from './utils/contractUtils';


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

//TODO: FIX THAT in next version
const IPFS_HASH = '1220';

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

  async initialize(contract, networkId) {
    if (contract == null)
      return;
    const auditedContracts = await getAuditedContracts(contract, constants.contracts[networkId].MontelabsMS);
    this.setState({ reports: auditedContracts });
    const reportPromises = auditedContracts.map(async (auditedContract, idx) => {
      let ipfsAddr = getIPFSAddress(IPFS_HASH, auditedContract.ipfsHash);
      let ipfsObj;
      try {
        ipfsObj = require(`../ipfs/${ipfsAddr}.json`);
      }
      catch(err) {
        console.error(`Could not find ${ipfsAddr}.json`);
        ipfsObj = {name: null};
      }
      const timestamp = await getBlockTimestamp(this.props.web3js, auditedContract.insertedBlock);
      this.setState(prevState => {
        let report = { ...ipfsObj, ...auditedContract, timestamp: timestamp };
        prevState.reports[idx] = {
          codeHash: report.codeHash,
          insertedBlock: report.insertedBlock,
          level: report.level,
          timestamp: report.timestamp,
          ...report
        }
        return {prevState};
      });
    });
    // Treat evidences
    auditedContracts.map(auditedContract => {
      contract.getPastEvents('AttachedEvidence', {
        filter: {
          auditorAddr: auditedContract.auditedBy,
          codeHash: auditedContract.codeHash
        }, fromBlock: auditedContract.insertedBlock, toBlock: 'latest'
      }, (err, events) => {
        events.map(async event => {
          let ipfsAddr = getIPFSAddress(IPFS_HASH, event.returnValues.ipfsHash);
          let ipfsObj = require(`../ipfs/${ipfsAddr}.json`);
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
    this.initialize(newProps.auditContract, newProps.networkId);
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
                  if (!value.name) {
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
