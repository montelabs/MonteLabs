import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Button from 'material-ui/Button';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import Toolbar from 'material-ui/Toolbar';

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
            <TableCell >IPFS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports
            && reports.map(report => {
            return (
              <TableRow key={report.id}>
                <TableCell>{report.type_of_proof}</TableCell>
                <TableCell >
                  <a href={"https://ipfs.io/ipfs/" + report.ipfs_url}>
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
