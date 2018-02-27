import Web3 from 'web3';

const testConnection = (web3) => {
  return new Promise((resolve, reject) => {
    web3.eth.getBlock(0, (err, res) => {
      if (err)
        resolve(false);
      else
        resolve(true);
    })
  });
}

let getWeb3 = new Promise((resolve, reject) => {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', async function() {
    let results;
    let web3js;
    let provider = null;
    let pr = new Web3.providers.HttpProvider('http://localhost:8545');
    web3js = new Web3(pr);

    const isLocal = await testConnection(web3js);
    if (isLocal) {
      provider = 'Local';
      results = {
        web3js,
        provider
      }
    }
    else if (typeof web3 !== 'undefined') {
      if (window.web3.currentProvider.isMetaMask) {
        provider = 'MetaMask';
      }
      else {
        provider = 'Custom';
      }
      web3js = new Web3(window.web3.currentProvider);
      results = {
        web3js,
        provider
      }
    } 
    else {
      // let pr = new Web3.providers.HttpProvider('http://localhost:8545');
      let pr = new Web3.providers.HttpProvider('https://kovan.infura.io/DM5TjoIO6E0LEkDkYDtd');

      provider = 'Infura';
      web3js = new Web3(pr);

      results = {
        web3js,
        provider
      };
      console.log('No web3 instance injected, using infura\'s provider');
    }
    const networkId = web3js.version.network;
    let networkName = null;
    if (networkId === '1')
        networkName = 'Main Ethereum';
    else if (networkId === '3')
        networkName = 'Ropsten';
    else if (networkId === '4')
        networkName = 'Rinkeby';
    else if (networkId === '42')
        networkName = 'Kovan';
     else
        networkName = 'Private';
  
    resolve({ ...results, networkId, networkName });
  })
})

export default getWeb3
