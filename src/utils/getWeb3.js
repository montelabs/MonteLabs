import Web3 from 'web3';

let getWeb3 = new Promise((resolve, reject) => {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', async function() {
    let results;
    let web3js;
    let provider = null;
    if (typeof web3 !== 'undefined') {
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
      let pr = new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws')
      provider = 'Infura'
      web3js = new Web3(pr);

      results = {
        web3js,
        provider
      }
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
