/* eslint-disable flowtype/require-valid-file-annotation */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress'

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

const AuditedContract = withStyles(styles)((props) => {
  const {
    classes,
    codeHash,
    name,
    shortDescription,
    toggleReports,
    insertedBlock,
    proofs,
  } = props;
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
          onClick={() => toggleReports(codeHash)}
        >
          Security report
          </Button>
      </CardActions>
    </Card>
  );
});

const AuditedContractPending = withStyles(styles)((props) => {
  const {
    classes,
    codeHash,
    insertedBlock,
  } = props;
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant='headline' component='h2'>
          {codeHash.substr(0, 10)}...
        </Typography>
        <Typography component='p'>
          [DEBUG] Inserted at block: {insertedBlock}
        </Typography>
        <Typography component='div' align='center'>
          <CircularProgress className={classes.progress} size={75} />
        </Typography>
      </CardContent>
    </Card>
  );
});

AuditedContract.propTypes = {
  auditContract: PropTypes.object,
  name: PropTypes.string.isRequired,
  shortDescription: PropTypes.string.isRequired,
  toggleReports: PropTypes.func.isRequired,
  codeHash: PropTypes.string.isRequired,
  insertedBlock: PropTypes.number.isRequired
};

AuditedContractPending.propTypes = {
  auditContract: PropTypes.object,
  codeHash: PropTypes.string.isRequired,
  insertedBlock: PropTypes.number.isRequired
};

export { AuditedContract, AuditedContractPending };
