import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Button from 'material-ui/Button';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import Toolbar from 'material-ui/Toolbar';

import IPFS from 'ipfs';

const styles = theme => ({
  table: {
    width: '100%',
  },
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

class Reports extends Component {

  constructor(props) {
    super(props);
    this.state = {
      IPFSReports: [],
    };
  }
  render() {
    let ipfsNode = new IPFS();
    ipfsNode.on('ready', async () => {
      try{
        // var Buffer = require('buffer');
        window.ipfs = ipfsNode;
        window.Buffer = Buffer;
        const cosa = await ipfsNode.dag.get('zdpuAxQ2bqEkd17SUaXbUaV7YsvA9VjRJJ1ooZFpV9QuwxinU');
        console.log(cosa);
      }
      catch(err) {
        console.log('ERROR', err);
      }
    });
    const { classes, reports, onClose } = this.props;
    return (
      <div>
        <Toolbar>
          <Button className={classes.button} onClick={onClose} size="small" color="primary">
            <ChevronLeftIcon className={classes.leftIcon} />
            Back
          </Button>
          {/* TODO: map contract names
          <Typography variant="title" >
            {contractName} reports
          </Typography>*/}
        </Toolbar>

        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Type of Proof</TableCell>
              <TableCell >IPFS Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports
              && this.state.IPFSReports.map(report => {
              return (
                <TableRow key={report['/']}>
                  <TableCell>{report.type}</TableCell>
                  <TableCell >
                    <a href={report['/']}>
                      {report['/']}
                    </a>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default withStyles(styles)(Reports);
