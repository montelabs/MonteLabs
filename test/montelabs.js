const Web3Utils = require('web3-utils');
const sha3 = Web3Utils.sha3;
const soliditySha3 = Web3Utils.soliditySha3;

const Audit   = artifacts.require('Audit');
const MonteLabsMS = artifacts.require('MonteLabsMS');

const utils = require('../misc/utils');
const Sig = utils.Sig(web3);
const getEvents = utils.getEvents;

let auditInstance;
let monteLabsMS;

let l_acc;
let r_acc;
let f_acc;

contract('MonteLabs', function(accounts) {
  let montelabsCreator = accounts[0];
  l_acc = accounts[1];
  r_acc = accounts[2];
  f_acc = accounts[3];

  it('Should create MonteLabs contract', async () => {
    auditInstance = await Audit.new({from: montelabsCreator});
  });
  
  it('Should create MonteLabsMS contract', async () => {
    let addrs = [l_acc, r_acc, f_acc];
    monteLabsMS = await MonteLabsMS.new(addrs, auditInstance.address, {from: montelabsCreator});
  });

  it('Should add a new Audit with L and R sigs', async () => {
    const codeHash = sha3('0x000000000000000100000101010100');
    const level = 1;
    const ipfsHash = sha3('0x0abcdef0001000001010fffffff100');
    
    const message = soliditySha3(true, codeHash, level, ipfsHash);
    const signatureL = await Sig(l_acc, message);
    const signatureR = await Sig(r_acc, message);

    const v = [signatureL.v, signatureR.v];
    const r = [signatureL.r, signatureR.r];
    const s = [signatureL.s, signatureR.s];
    let tx = await monteLabsMS.addAudit(codeHash, level, ipfsHash, v, r, s);
  });

  it('Should add a new Audit with L and F sigs', async () => {
    // let msg =
    const codeHash = soliditySha3('0x000000000000000100000101010100');
    const level = 1;
    const ipfsHash = soliditySha3('0x0abcdef0001000001010fffffff100');
    
    const message = soliditySha3(true, codeHash, level, ipfsHash);        
    const signatureL = await Sig(l_acc, message);
    const signatureF = await Sig(f_acc, message);
    
    const v = [signatureL.v, signatureF.v];
    const r = [signatureL.r, signatureF.r];
    const s = [signatureL.s, signatureF.s];
    let tx = await monteLabsMS.addAudit(codeHash, level, ipfsHash, v, r, s);
  });

  it('Should add a new Audit with R and F sigs', async () => {
    // let msg =
    const codeHash = soliditySha3('0x000000000000000100000101010100');
    const level = 1;
    const ipfsHash = soliditySha3('0x0abcdef0001000001010fffffff100');
    
    const message = soliditySha3(true, codeHash, level, ipfsHash);        
    const signatureR = await Sig(r_acc, message);
    const signatureF = await Sig(f_acc, message);
    
    const v = [signatureR.v, signatureF.v];
    const r = [signatureR.r, signatureF.r];
    const s = [signatureR.s, signatureF.s];
    let tx = await monteLabsMS.addAudit(codeHash, level, ipfsHash, v, r, s);

    let versions = await auditInstance.AuditVersions(codeHash);
    assert(versions.toNumber() == 3, 'Number of versions not right');
  });

  it('Should not add a new Audit with only L sig', async () => {
    // let msg =
    const codeHash = soliditySha3('0x000000000000000100000101010100');
    const level = 1;
    const ipfsHash = soliditySha3('0x0abcdef0001000001010fffffff100');
    
    const message = soliditySha3(true, codeHash, level, ipfsHash);        
    const signatureL = await Sig(l_acc, message);
    
    const v = [signatureL.v, signatureL.v];
    const r = [signatureL.r, signatureL.r];
    const s = [signatureL.s, signatureL.s];
    
    try {
      let tx = await monteLabsMS.addAudit(codeHash, level, ipfsHash, v, r, s);
    }
    catch(err) {
      return;
    }
    assert.fail('Expected throw not received');
    
  });


  // TEST ADDING EVIDENCES
  it('Should add a new evidence', async () => {
    // let msg =
    const codeHash = soliditySha3('0x000000000000000100000101010100');
    const version = 0;
    const ipfsHash = soliditySha3('0x0abcdef0001000001010fffffff100');
    
    const message = soliditySha3(false, codeHash, version, ipfsHash);        
    const signatureR = await Sig(r_acc, message);
    const signatureF = await Sig(f_acc, message);
    
    const v = [signatureR.v, signatureF.v];
    const r = [signatureR.r, signatureF.r];
    const s = [signatureR.s, signatureF.s];
    const tx = await monteLabsMS.addEvidence(codeHash, version, ipfsHash, v, r, s);
  });
});
