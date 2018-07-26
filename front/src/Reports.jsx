import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import ChevronLeft from '@material-ui/icons/ChevronLeft';

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
          <ChevronLeft className={classes.leftIcon} />
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
            <TableCell>Description</TableCell>
            <TableCell>Document</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ipfsProofs && ipfsProofs.proofs.map(report => {
            return (
              <TableRow key={report['/']}>
                <TableCell>{report.type}</TableCell>
                <TableCell>{report.description}</TableCell>
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
