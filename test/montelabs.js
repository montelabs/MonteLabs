const Web3 = require('web3');
const MonteLabs   = artifacts.require('MonteLabs');
const MonteLabsMS = artifacts.require('MonteLabsMS');
const web3js = new Web3(web3.givenProvider);

let monteLabsInstance;
let monteLabsMS;

let l_acc;
let r_acc;
let f_acc;

function Sig(account, msg) {
  return new Promise((res, rej) => {
    web3.eth.sign(account, msg, (err, sig) => {
      sig = sig.substr(2);
      let r = '0x' + sig.substr(0,64);
      let s = '0x' + sig.substr(64, 64);
      let v = web3.toDecimal(sig.substr(128, 2)) + 27;
      res({r, s, v});
    });
  });
}

contract('MonteLabs', function(accounts) {
  let montelabsCreator = accounts[0];
  l_acc = accounts[1];
  r_acc = accounts[2];
  f_acc = accounts[3];

  it('Should create MonteLabs contract', async () => {
    monteLabsInstance = await MonteLabs.new({from: montelabsCreator});
  });
  
  it('Should create MonteLabsMS contract', async () => {
    let addrs = [l_acc, r_acc, f_acc];
    monteLabsMS = await MonteLabsMS.new(addrs, monteLabsInstance.address, {from: montelabsCreator});
  });

  it('Should add a new Audit with L and R sigs', async () => {
    // let msg =
    const codeHash = web3js.utils.soliditySha3('0x000000000000000100000101010100');
    const level = 1;
    const ipfsHash = web3js.utils.soliditySha3('0x0abcdef0001000001010fffffff100');
    
    const message = web3js.utils.soliditySha3(codeHash, level, ipfsHash);        
    const signatureL = await Sig(l_acc, message);
    const signatureR = await Sig(r_acc, message);
    
    const v = [signatureL.v, signatureR.v];
    const r = [signatureL.r, signatureR.r];
    const s = [signatureL.s, signatureR.s];
    let tx = await monteLabsMS.addAudit(codeHash, level, ipfsHash, v, r, s);
  });

  it('Should add a new Audit with L and F sigs', async () => {
    // let msg =
    const codeHash = web3js.utils.soliditySha3('0x000000000000000100000101010100');
    const level = 1;
    const ipfsHash = web3js.utils.soliditySha3('0x0abcdef0001000001010fffffff100');
    
    const message = web3js.utils.soliditySha3(codeHash, level, ipfsHash);        
    const signatureL = await Sig(l_acc, message);
    const signatureF = await Sig(f_acc, message);
    
    const v = [signatureL.v, signatureF.v];
    const r = [signatureL.r, signatureF.r];
    const s = [signatureL.s, signatureF.s];
    let tx = await monteLabsMS.addAudit(codeHash, level, ipfsHash, v, r, s);
  });

  it('Should add a new Audit with R and F sigs', async () => {
    // let msg =
    const codeHash = web3js.utils.soliditySha3('0x000000000000000100000101010100');
    const level = 1;
    const ipfsHash = web3js.utils.soliditySha3('0x0abcdef0001000001010fffffff100');
    
    const message = web3js.utils.soliditySha3(codeHash, level, ipfsHash);        
    const signatureR = await Sig(r_acc, message);
    const signatureF = await Sig(f_acc, message);
    
    const v = [signatureR.v, signatureF.v];
    const r = [signatureR.r, signatureF.r];
    const s = [signatureR.s, signatureF.s];
    let tx = await monteLabsMS.addAudit(codeHash, level, ipfsHash, v, r, s);
  });

  it('Should not add a new Audit with only L sig', async () => {
    // let msg =
    const codeHash = web3js.utils.soliditySha3('0x000000000000000100000101010100');
    const level = 1;
    const ipfsHash = web3js.utils.soliditySha3('0x0abcdef0001000001010fffffff100');
    
    const message = web3js.utils.soliditySha3(codeHash, level, ipfsHash);        
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
});
