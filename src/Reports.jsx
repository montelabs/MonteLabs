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

const Reports = (props) => {
  let ipfsNode = new IPFS();
  console.log(ipfsNode);
  ipfsNode.on('ready', async () => {
    try{
      // var Buffer = require('buffer');
      console.log(ipfsNode.dag.get)
      window.ipfs = ipfsNode;
      window.Buffer = Buffer;
      const cosa = await ipfsNode.files.get('QmQ2r6iMNpky5f1m4cnm3Yqw8VSvjuKpTcK1X7dBR1LkJF');
      console.log('Hey', cosa);
    }
    catch(err) {
      console.log('ERROR', err);
    }
  });
  const { classes, reports, onClose } = props;
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
            && reports.map(report => {
            return (
              <TableRow key={report.id}>
                <TableCell>{report.type_of_proof}</TableCell>
                <TableCell >
                  <a href={report.ipfs_url}>
                    {report.ipfs_url} 
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

export default withStyles(styles)(Reports);
