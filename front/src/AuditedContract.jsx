/* eslint-disable flowtype/require-valid-file-annotation */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Base58 from 'bs58';

import constants from './utils/constants';

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

const getIPFSAddress = (hexaAddr) => {
  const IPFS_HASH = '82ddfdec';
  const ipfsHexa = IPFS_HASH + hexaAddr.substr(2, 64);
  return Base58.encode(Buffer.from(ipfsHexa, 'hex'));
}

const getAudit = (contract, codeHash, version) => {
  return new Promise((resolve, reject) => {
    contract.auditedContracts.call(codeHash, version, (err, audit) => {
      if (err)
        reject(err);
      else
        resolve({
          level: audit[0].toNumber(),
          auditedBy: audit[1],
          insertedBlock: audit[2].toNumber()
        });
    });
  });
}

class AuditedContract extends Component {
      constructor(props) {
        super(props);
        this.state = {
          proofs: []
        };
      }

      // TODO: merge componentWillMount and componentWillReceiveProps functions 
      componentWillMount() {
        const {
          auditContract,
          codeHash,
          version
        } = this.props;
        if (auditContract !== null) {
          getAudit(auditContract, codeHash, version).then(audit => {
            this.setState(audit);
            auditContract.NewAudit({
              codeHash: codeHash,
              auditedBy: constants.MontelabsMS,
              version: version,
            },
            {
              fromBlock: audit.insertedBlock,
              toBlock: audit.insertedBlock
            }, (err, log) => {
              const ipfsAddr = getIPFSAddress(log.args.ipfsHash)
              this.setState(prevState => {
                  return prevState.proofs.push(ipfsAddr);
              })
            })
          })
        }
      }

      componentWillReceiveProps(nextProps) {
        const {
          auditContract,
          codeHash,
          version
        } = nextProps;
        if (auditContract !== null) {
          getAudit(auditContract, codeHash, version).then(audit => {
            this.setState(audit);
            auditContract.NewAudit({
              codeHash: codeHash,
              auditedBy: constants.MontelabsMS,
              version: version,
            },
            {
              fromBlock: audit.insertedBlock,
              toBlock: audit.insertedBlock
            }, (err, log) => {
              const ipfsAddr = getIPFSAddress(log.args.ipfsHash)
              this.setState(prevState => {
                  return prevState.proofs.push(ipfsAddr);
              })
            })
          })
        }
      }

      render() {
        const {
          classes,
          name,
          shortDescription,
          getIPFSReports
        } = this.props;
        return <Card className={classes.card}>
          <CardContent>
            <Typography variant="headline" component="h2">
              {name}
            </Typography>
            <Typography component="p">
              {shortDescription}
            </Typography>
            <Typography component="p">
              [DEBUG] Inserted at block: {this.state.insertedBlock}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              color='primary'
              onClick={() => getIPFSReports(this.state.proofs)}
            >
              Security report
      </Button>
          </CardActions>
        </Card>
      }
    }

export default withStyles(styles)(AuditedContract);
