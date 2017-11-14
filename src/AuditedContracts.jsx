/* eslint-disable flowtype/require-valid-file-annotation */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import verifiedContracts from './utils/verifiedContracts.json'
import Button from 'material-ui/Button';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  card: {
    width: 200,
    height: 200,
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
});

class AuditedContracs extends React.Component {
  state = {
    spacing: '8',
  };

  render() {
    const { classes } = this.props;
    const { spacing } = this.state;

    return (
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <Grid container className={classes.demo} justify="flex-start" spacing={Number(spacing)}>
            {verifiedContracts.map(value => (
              <Grid key={value.name} item>
                <Card className={classes.card}>
                <CardMedia
                  className={classes.media}
                  image="/static/images/cards/contemplative-reptile.jpg"
                  title="Contemplative Reptile"
                />
                <CardContent>
                  <Typography type="headline" component="h2">
                    {value.name}
                  </Typography>
                  <Typography component="p">
                    {value.short_description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button dense color='primary'>Proofs</Button>
                </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

AuditedContracs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AuditedContracs);