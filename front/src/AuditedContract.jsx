/* eslint-disable flowtype/require-valid-file-annotation */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardMedia, CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress'

import Base58 from 'bs58';

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
  media: {
    height: 250,
    backgroundSize: 'contain',
  },
  content: {
    height: 80,
  }
});

const AuditedContract = withStyles(styles)((props) => {
  const {
    classes,
    codeHash,
    name,
    shortDescription,
    logo,
    toggleReports,
    insertedBlock,
    proofs,
  } = props;
  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.media}
        image={(logo !== undefined) ? ('https://ipfs.io/ipfs/' + logo) : '/images/placeholder.png'}
      />
      <CardContent className={classes.content}>
        <Typography variant="headline" component="h2">
          {name}
        </Typography>
        <Typography component="p">
          {shortDescription}
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
  logo: PropTypes.string,
  toggleReports: PropTypes.func.isRequired,
  codeHash: PropTypes.string.isRequired,
  insertedBlock: PropTypes.string.isRequired
};

AuditedContractPending.propTypes = {
  auditContract: PropTypes.object,
  codeHash: PropTypes.string.isRequired,
  insertedBlock: PropTypes.string.isRequired
};

export { AuditedContract, AuditedContractPending };
