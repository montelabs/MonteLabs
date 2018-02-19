/* eslint-disable flowtype/require-valid-file-annotation */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

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

const AuditedContract = ({ 
  classes, 
  name, 
  short_description, 
  ipfs_report_addr, 
  getIPFSReports 
}) =>
  <Card className={classes.card}>
    <CardContent>
      <Typography variant="headline" component="h2">
        {name}
      </Typography>
      <Typography component="p">
        {short_description}
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

AuditedContract.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AuditedContract);
