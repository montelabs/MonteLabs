#!/usr/bin/env node
'use strict';
var colors = require('colors');

const assert = require('assert');
const Web3 = require('web3');
const Web3Utils = require('web3-utils');
const sha3 = Web3Utils.sha3;
const soliditySha3 = Web3Utils.soliditySha3;

const Utils = require('./utils');

const ArgumentParser = require('argparse').ArgumentParser;
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const Sig = Utils.Sig(web3);

var parser = new ArgumentParser({
  version: '0.1.0',
  addHelp: true,
  description: 'MonteLabs multisig auditing tool'
});
parser.addArgument('--account', {help: 'Account used to sign'});
parser.addArgument('--MSContract', {help: 'Deployed Multisig contract'});
parser.addArgument('--othersig', {help: 'Other member json signature'});
parser.addArgument(
    '--mode',
    {choices: ['sign', 'ensemble']},
);
parser.addArgument('--type', {choices: ['new', 'evidence']});
parser.addArgument('--hash', {help: 'New Audit code hash'});
parser.addArgument('--level', {help: 'baz bar'});
parser.addArgument('--ipfs', {help: 'IPFS document hash'});

var args = parser.parseArgs();

const message = soliditySha3(
    args['mode'] === 'sign' ? true : false, args['hash'], args['level'],
    args['ipfs']);

main();

async function main() {
  try {
    const signature = await Sig(args['account'], message);
    if (args['mode'] === 'sign')
      console.log(
          ('Copy the signature: \'' + JSON.stringify(signature) + '\'').green);
    else if (args['mode'] === 'ensemble') {
      // Parse other sig
      const otherSig = JSON.parse(args['othersig']);

      // Send tx
      const MLContractABI = require('../build/contracts/MonteLabsMS').abi
      const contract = web3.eth.contract(MLContractABI).at(args['MSContract']);

      if (args['type'] === 'new') {
        contract.addAudit(
            args['hash'], args['level'], args['ipfs'], otherSig.v, otherSig.r, otherSig.s,
            {from: args['account']});
      } else if (args['type'] === 'evidence') {
        contract.addEvidence(
            args['hash'], args['level'], args['ipfs'], otherSig.v, otherSig.r, otherSig.s,
            {from: args['account']});
      }
      console.log('Trying to sign and send tx...');
    }
  } catch (err) {
    console.error('ERROR', err);
  }
}