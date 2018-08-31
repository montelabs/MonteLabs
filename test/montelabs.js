const Web3Utils = require('web3-utils');
const BigNumber = require('bignumber.js');
const sha3 = Web3Utils.sha3;
const soliditySha3 = Web3Utils.soliditySha3;

const Audit = artifacts.require('Audit');
const MonteLabsMS = artifacts.require('MonteLabsMS');

const utils = require('../misc/utils');
const Sig = utils.Sig(web3);
const getEvents = utils.getEvents;

let auditInstance;
let monteLabsMSinstance;

let l_acc;
let r_acc;
let f_acc;

let client1;

contract('MonteLabs', function(accounts) {
  let montelabsCreator = accounts[0];
  l_acc = accounts[1];
  r_acc = accounts[2];
  f_acc = accounts[3];

  client1 = accounts[4];

  it('Should create MonteLabs contract', async () => {
    console.log('----- Testing Audits system -----'.yellow)
    auditInstance = await Audit.new({from: montelabsCreator});
  });

  it('Should add a new Audit', async () => {
    const codeHash = sha3('0x000000000000000100000101010100');
    const level = 1;
    const ipfsHash = sha3('0x0abcdef0001000001010fffffff100');

    await auditInstance.addAudit(codeHash, level, ipfsHash, {from: r_acc});
    let verificationLevel = await auditInstance.isVerifiedCode(r_acc, codeHash);

    assert(verificationLevel.eq(new BigNumber(1)));
  });

  it('Should create Monte Labs multisig', async () => {
    console.log('----- Testing Multisig -----'.yellow);

    let addrs = [l_acc, r_acc, f_acc];
    monteLabsMSinstance = await MonteLabsMS.new(addrs, {from: montelabsCreator});
  });

  it('Should send 1 eth to Multi sig', async () => {
    await monteLabsMSinstance.sendTransaction({from: client1, value: 1e18});

    let balance = await web3.eth.getBalance(monteLabsMSinstance.address);
    assert(new BigNumber(1e18).eq(balance));
  });

  it('Should send to l_acc 0.5 eth with l_acc and f_acc signatures', async () => {
    const nonce = await monteLabsMSinstance.nonce();
    assert(nonce.eq(new BigNumber(0)));
    const message = soliditySha3(monteLabsMSinstance.address, l_acc, new BigNumber(5*1e17), {type: 'bytes', value: '0x00'}, nonce);

    const signatureL = await Sig(l_acc, message);

    let balanceBefore = await web3.eth.getBalance(l_acc);
    var a = await monteLabsMSinstance.execute(signatureL.v, signatureL.r, signatureL.s, l_acc, 5*1e17, '0x00', {from: f_acc});

    let balanceAfter = await web3.eth.getBalance(l_acc);
    assert(balanceAfter.sub(balanceBefore).eq(new BigNumber(5*1e17)));
  });

  it('Should send to l_acc 0.5 eth with l_acc and f_acc signatures again', async () => {
    const nonce = await monteLabsMSinstance.nonce();
    assert(nonce.eq(new BigNumber(1)));
    const message = soliditySha3(monteLabsMSinstance.address, l_acc, new BigNumber(5*1e17), {type: 'bytes', value: '0x00'}, nonce);

    const signatureL = await Sig(l_acc, message);

    let balanceBefore = await web3.eth.getBalance(l_acc);
    var a = await monteLabsMSinstance.execute(signatureL.v, signatureL.r, signatureL.s, l_acc, 5*1e17, '0x00', {from: f_acc});

    let balanceAfter = await web3.eth.getBalance(l_acc);
    assert(balanceAfter.sub(balanceBefore).eq(new BigNumber(5*1e17)));
  });

  it('Invalid signature, should not pass', async () => {
    const invalidAccount = accounts[6];
    const nonce = await monteLabsMSinstance.nonce();
    assert(nonce.eq(new BigNumber(2)));
    const message = soliditySha3(monteLabsMSinstance.address, invalidAccount, new BigNumber(5*1e17), {type: 'bytes', value: '0x00'}, nonce);
    const signatureL = await Sig(invalidAccount, message);

    try {
      await monteLabsMSinstance.execute(signatureL.v, signatureL.r, signatureL.s, invalidAccount, 5*1e17, '0x00', {from: f_acc});
      assert(false);
    }
    catch (err) {
      // console.log(err);
    }
  });

  it('No funds, should revert', async () => {
    const nonce = await monteLabsMSinstance.nonce();
    assert(nonce.eq(new BigNumber(2)));
    const message = soliditySha3(monteLabsMSinstance.address, l_acc, new BigNumber(5*1e17), {type: 'bytes', value: '0x00'}, nonce);
    const signatureL = await Sig(l_acc, message);

    try {
      var a = await monteLabsMSinstance.execute(signatureL.v, signatureL.r, signatureL.s, l_acc, 5*1e17, '0x00', {from: f_acc});
      assert(false);
    }
    catch (err) {
      // console.log(err);
    }
  });

  // it('Should not add same audit', async () => {
  //   // let msg =
  //   const codeHash = sha3('0x000000000000000100000101010100');
  //   const level = 1;
  //   const ipfsHash = sha3('0x0abcdef0001000001010fffffff100');

  //   const message = soliditySha3(true, codeHash, level, ipfsHash);
  //   const signatureL = await Sig(l_acc, message);

  //   try {
  //     await monteLabsMS.addAudit(
  //       codeHash, level, ipfsHash, signatureL.v, signatureL.r, signatureL.s,
  //       {from: r_acc});
  //   } catch (err) {
  //     return;
  //   }
  //   assert.fail('Expected throw not received');

  // });

  // it('Should add a new Audit with L and F sigs', async () => {
  //   // let msg =
  //   const codeHash = soliditySha3('0x000000000000000100000101010101');
  //   const level = 1;
  //   const ipfsHash = soliditySha3('0x0abcdef0001000001010fffffff100');

  //   const message = soliditySha3(true, codeHash, level, ipfsHash);
  //   const signatureL = await Sig(l_acc, message);

  //   await monteLabsMS.addAudit(
  //       codeHash, level, ipfsHash, signatureL.v, signatureL.r, signatureL.s,
  //       {from: f_acc});
  // });

  // it('Should add a new Audit with R and F sigs', async () => {
  //   // let msg =
  //   const codeHash = soliditySha3('0x000000000000000100000101010102');
  //   const level = 1;
  //   const ipfsHash = soliditySha3('0x0abcdef0001000001010fffffff100');

  //   const message = soliditySha3(true, codeHash, level, ipfsHash);
  //   const signatureR = await Sig(r_acc, message);

  //   await monteLabsMS.addAudit(
  //       codeHash, level, ipfsHash, signatureR.v, signatureR.r, signatureR.s,
  //       {from: f_acc});
  // });

  // it('Should not add a new Audit with only L sig', async () => {
  //   // let msg =
  //   const codeHash = soliditySha3('0x000000000000000100000101010100');
  //   const level = 1;
  //   const ipfsHash = soliditySha3('0x0abcdef0001000001010fffffff100');

  //   const message = soliditySha3(true, codeHash, level, ipfsHash);
  //   const signatureL = await Sig(l_acc, message);

  //   try {
  //     await monteLabsMS.addAudit(
  //         codeHash, level, ipfsHash, signatureL.v, signatureL.r,
  //         signatureL.s, {from: l_acc});
  //   } catch (err) {
  //     return;
  //   }
  //   assert.fail('Expected throw not received');

  // });

  // // TEST ADDING EVIDENCES
  // it('Should add a new evidence', async () => {
  //   // let msg =
  //   const codeHash = soliditySha3('0x000000000000000100000101010100');
  //   const version = 0;
  //   const ipfsHash = soliditySha3('0x0abcdef0001000001010fffffff100');

  //   const message = soliditySha3(false, codeHash, version, ipfsHash);
  //   const signatureR = await Sig(r_acc, message);

  //   await monteLabsMS.addEvidence(
  //       codeHash, version, ipfsHash, signatureR.v, signatureR.r,
  //       signatureR.s, {from: f_acc});
  // });
});
