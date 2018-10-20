#!/usr/bin/env node
'use strict';
require('colors');
const Web3 = require('web3');
const Web3Utils = require('web3-utils');
const soliditySha3 = Web3Utils.soliditySha3;

const Utils = require('./utils');

const ArgumentParser = require('argparse').ArgumentParser;
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const Sig = Utils.Sig(web3);

var parser = new ArgumentParser({
  version: '0.1.0',
  addHelp: true,
  description: 'MonteLabs multisig account'
});
parser.addArgument('--account', {help: 'Account used to sign'});
parser.addArgument('--MSContract', {help: 'Deployed Multisig contract'});
parser.addArgument('--othersig', {help: 'Other member json signature'});
parser.addArgument(
    '--mode',
    {choices: ['sign', 'send']},
);
parser.addArgument('--destination', {help: 'Destination address'});
parser.addArgument('--value', {help: 'Value in wei'});
parser.addArgument('--data', {help: 'Data'});
parser.addArgument('--nonce', {help: 'Contract nonce'});

var args = parser.parseArgs();

main();

async function main() {
  try {
    // address, destination, value, data, nonce
    const message = soliditySha3(
        args['MSContract'], args['destination'], args['value'], args['data'],
        args['nonce']);

    if (args['mode'] === 'sign') {
      const signature = await Sig(args['account'], message);
      // console.log(
      // ('Run: ./sign.js --othersig' + '\'' + JSON.stringify(signature) + '\''
      // + '--MSContract ' + args['MSContract']).green
      console.log(`Run ${process.argv[1]} --othersig ${'\''}${JSON.stringify(signature)}${'\''} --MSContract ${args['MSContract']} --mode send --destination ${args['destination']} --value ${args['value']} --data ${args['data']} --nonce ${args['nonce']} --account <YOURACCOUNT>`.green);
    } else if (args['mode'] === 'send') {
      // Parse other sig
      const otherSig = JSON.parse(args['othersig']);

      // Send tx
      const MLContractABI = require('../build/contracts/MonteLabsMS').abi
      const contract = web3.eth.contract(MLContractABI).at(args['MSContract']);
      contract.execute(
          otherSig.v, otherSig.r, otherSig.s, args['destination'],
          args['value'], args['data'], {from: args['account']});
      console.log('Trying to sign and send tx...');
    } else {
      throw 'Must specify sign or send';
    }
  } catch (err) {
    console.error('ERROR', err);
  }
}