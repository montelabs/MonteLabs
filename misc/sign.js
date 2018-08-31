#!/usr/bin/env node
'use strict';
var colors = require('colors');

const bs58 = require('bs58');
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
parser.addArgument('--code', {help: 'New Audit code'});
parser.addArgument('--level', {help: 'baz bar'});
parser.addArgument('--ipfs', {help: 'IPFS document hash'});
parser.addArgument('--ipfs-hash-only');


var args = parser.parseArgs();

const bytes = bs58.decode(args['ipfs']);
let ipfsHex = '0x' + bytes.toString('hex').substr(4, 64);

main();

async function main() {
  try {
    if (args['ipfs-hash-only'] !== null) {
      console.log(ipfsHex);
      return;
    }

    var codehash = args['hash'];
    if (args['code'] != null)
      codehash = soliditySha3(args['code']);

    const message = soliditySha3(
      args['mode'] === 'sign' ? true : false, codehash, args['level'],
      ipfsHex);
    
    if (args['mode'] === 'sign') {
      const signature = await Sig(args['account'], message);
      // console.log(
        // ('Run: ./sign.js --othersig' + '\'' + JSON.stringify(signature) + '\'' + '--MSContract ' + args['MSContract']).green
      console.log(`Run ./sign.js --othersig ${'\''}${JSON.stringify(signature)}${'\''} --MSContract ${args['MSContract']} --mode ensemble --type ${args['type']} --hash ${codehash} --level ${args['level']} --ipfs ${args['ipfs']} --account <YOURACCOUNT>`.green)
    }
    else if (args['mode'] === 'ensemble') {
      // Parse other sig
      const otherSig = JSON.parse(args['othersig']);

      // Send tx
      const MLContractABI = require('../build/contracts/MonteLabsMS').abi
      const contract = web3.eth.contract(MLContractABI).at(args['MSContract']);

      if (args['type'] === 'new') {
        contract.addAudit(
            codehash, args['level'], ipfsHex, otherSig.v, otherSig.r, otherSig.s,
            {from: args['account']});
      } else if (args['type'] === 'evidence') {
        contract.addEvidence(
            codehash, args['level'], ipfsHex, otherSig.v, otherSig.r, otherSig.s,
            {from: args['account']});
      }
      console.log('Trying to sign and send tx...');
    }
  } catch (err) {
    console.error('ERROR', err);
  }
}