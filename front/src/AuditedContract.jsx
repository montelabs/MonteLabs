/* eslint-disable flowtype/require-valid-file-annotation */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress'

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
        image={(logo !== undefined) ? require('../ipfs/' + logo + '.jpg') : '/images/placeholder.png'}
        // image={require('../ipfs/Qmca7SNmzZkFFm3SjHVXrwDu8ivMvcqeeVWMDEAAcC6q4a.jpg')}

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

AuditedContract.propTypes = {
  auditContract: PropTypes.object,
  name: PropTypes.string.isRequired,
  shortDescription: PropTypes.string.isRequired,
  logo: PropTypes.string,
  toggleReports: PropTypes.func.isRequired,
  codeHash: PropTypes.string.isRequired,
  insertedBlock: PropTypes.string.isRequired
};

export { AuditedContract };
