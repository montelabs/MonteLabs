/* eslint-disable flowtype/require-valid-file-annotation */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Base58 from 'bs58';

import constants from './utils/constants.json';
import getAudit from './utils/contractUtils';

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

const getIPFSAddress = (hexaAddr) => {
  const IPFS_HASH = '82ddfdec';
  const ipfsHexa = IPFS_HASH + hexaAddr.substr(2, 64);
  return Base58.encode(Buffer.from(ipfsHexa, 'hex'));
};

class AuditedContract extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proofs: [],
    };
  }

  render() {
    const {
      classes,
      name,
      shortDescription,
      toggleReports,
      insertedBlock,
      proofs,
    } = this.props;
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="headline" component="h2">
            {name}
          </Typography>
          <Typography component="p">
            {shortDescription}
          </Typography>
          <Typography component="p">
            [DEBUG] Inserted at block: {insertedBlock}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={() => toggleReports(proofs)}
          >
            Security report
          </Button>
        </CardActions>
      </Card>
    );
  }
}

AuditedContract.propTypes = {
  auditContract: PropTypes.object,
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  shortDescription: PropTypes.string.isRequired,
  toggleReports: PropTypes.func.isRequired,
  codeHash: PropTypes.string.isRequired,
  insertedBlock: PropTypes.number.isRequired
};

export default withStyles(styles)(AuditedContract);
