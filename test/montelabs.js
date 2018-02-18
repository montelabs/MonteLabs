const MonteLabs   = artifacts.require('MonteLabs');
const MonteLabsMS = artifacts.require('MonteLabsMS');

let monteLabsInstance;
let monteLabsMS;

contract('MonteLabs', function(accounts) {
  let montelabsCreator = accounts[0];

  let l, r, f;
  l = accounts[1];
  r = accounts[2];
  f = accounts[3];
  it('Should create MonteLabs contract', async () => {
    monteLabsInstance = await MonteLabs.new({from: montelabsCreator});
  });
  
  it('Should create MonteLabsMS contract', async () => {
    let addresses = [l, r, f];
    monteLabsMS = await MonteLabsMS.new(addresses, monteLabsInstance.address, {from: montelabsCreator});
  });

  it('Should add a new Audit', async () => {
    
  });
});
