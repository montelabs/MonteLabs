import React from 'react';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Button from 'material-ui/Button';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import Toolbar from 'material-ui/Toolbar';

import IPFS from 'ipfs';
import constants from './utils/constants.json';
import dateFormat from 'dateformat';

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

const formatDate = (timestamp) => {
  const date = new Date(timestamp*1000);
  return dateFormat(date, "dd/mm/yyyy, HH:MM:ss", true);
}

const Reports = (props) => {
  const { classes, ipfsProofs, evidences, onClose } = props;
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
            <TableCell>IPFS Address</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ipfsProofs && ipfsProofs.proofs.map(report => {
            return (
              <TableRow key={report['/']}>
                <TableCell>{report.type}</TableCell>
                <TableCell >
                  <a target='_blank' href={'https://ipfs.io/ipfs/' + report['/']}>
                    https://ipfs.io/ipfs/{report['/']}
                  </a>
                </TableCell>
                <TableCell>{formatDate(ipfsProofs.timestamp)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableBody>
          {evidences.map(evidence => {
            const proofs = evidence.evidence.proofs;
            return proofs.map(proof => {
              return (
                <TableRow key={proof['/']}>
                  <TableCell>{proof.type}</TableCell>
                  <TableCell >
                    <a target='_blank' href={'https://ipfs.io/ipfs/' + proof['/']}>
                      https://ipfs.io/ipfs/{proof['/']}
                    </a>
                  </TableCell>
                  <TableCell>{formatDate(evidence.timestamp)}</TableCell>
                </TableRow>
              );
            });
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default withStyles(styles)(Reports);
