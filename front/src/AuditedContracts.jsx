/* eslint-disable flowtype/require-valid-file-annotation */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

import verifiedContracts from './utils/verifiedContracts.json';
import ipfsReports from './utils/ipfsReports.json';
import AuditedContract from './AuditedContract';
import Reports from './Reports';

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
      showReports: false,
    };
  }

  // TODO: get from ipfs
  getIPFSReports = (ipfs_report_addr) => {
    this.setState({reports: ipfsReports, showReports: true});
  }

  onCloseReports = () => {
    this.setState({showReports: false});
  }

  render() {
    const { classes } = this.props;
    const { reports, showReports } = this.state;
    const auditContract = this.props.auditContract;

    return (
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          {showReports ? (
            <Reports reports={reports} onClose={this.onCloseReports}/>
          ) : (
            <Grid container className={classes.demo} justify="flex-start" spacing={8}>
              {verifiedContracts.map(value => (
                <Grid key={value.name} item>
                  <AuditedContract
                    auditContract={auditContract}
                    name={value.name}
                    codeHash={value.codeHash}
                    version={value.version}
                    shortDescription={value.shortDescription}
                    ipfs_report_addr={value.ipfs_report_addr}
                    getIPFSReports={this.getIPFSReports}
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
