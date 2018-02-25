/* eslint-disable flowtype/require-valid-file-annotation */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import constants from './utils/constants';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  card: {
    width: 250,
    minHeight: 200,
    marginRight: 12,
    marginTop: 12,
  },
});

class AuditedContract extends Component {
  constructor(props) {
    super(props);

    this.state = {
      proofs: []
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      auditContract,
      codeHash,
      version
    } = nextProps;
    if (auditContract !== null) {
      var events = auditContract.allEvents({
        codeHash: codeHash,
        auditedBy: constants.MontelabsMS,
        version: version
      });
      events.watch((error, event) => {
        console.log(event);
      });

      auditContract.allEvents({}, (error, log) => {
        console.log(log)
      });

      auditContract.auditedContracts.call(codeHash, version, (err, audit) => {
        this.setState({ insertedBlock: audit[2].toNumber() });
      });
    }
  }

  render() {
    const {
      classes,
      name,
      shortDescription,
      ipfs_report_addr,
      getIPFSReports
    } = this.props;
    return <Card className={classes.card}>
      <CardContent>
        <Typography variant="headline" component="h2">
          {name}
        </Typography>
        <Typography component="p">
          {shortDescription}
        </Typography>
        <Typography component="p">
          [DEBUG] Inserted at block: {this.state.insertedBlock}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color='primary'
          onClick={() => getIPFSReports(ipfs_report_addr)}
        >
          Security report
      </Button>
      </CardActions>
    </Card>
  }
}

export default withStyles(styles)(AuditedContract);
