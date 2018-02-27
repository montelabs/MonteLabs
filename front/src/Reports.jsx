import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Button from 'material-ui/Button';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import Toolbar from 'material-ui/Toolbar';

import IPFS from 'ipfs';
import constants from './utils/constants.json';


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

  componentWillMount() {
    let ipfsNode = new IPFS();
    ipfsNode.on('ready', async () => {
      try {
        constants.IPFSNodes.map(node => {
          ipfs.swarm.connect(node.address, (err, connected) => {
            if (err) {
              console.error('[IPFS]', err);
            }
            else {
              console.log(`[IPFS] Connected to ${node.name}`);
            }
          });
        });
        // var Buffer = require('buffer');
        window.ipfs = ipfsNode;

        const allProofs = this.props.reports.map(reportAddr => {
          return ipfsNode.dag.get(reportAddr);
        });
        const proofs = await Promise.all(allProofs);
        const parsedProofs = proofs.map(proof => {
          return proof.value.proofs;
        }).reduce((ans, sproof) => {
          return ans.concat(sproof);
        }, []);
        console.log('proofs', parsedProofs);
        this.setState({ IPFSReports: parsedProofs });
      }
      catch (err) {
        console.log('[IPFS] ERROR', err);
      }
    });
  }

  render() {

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
            {reports && this.state.IPFSReports.map(report => {
              return (
                <TableRow key={report['/']}>
                  <TableCell>{report.type}</TableCell>
                  <TableCell >
                    <a target='_blank' href={'https://ipfs.io/ipfs/' + report['/']}>
                      https://ipfs.io/ipfs/{report['/']}
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
