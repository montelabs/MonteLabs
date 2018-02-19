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
    let networkId = await web3js.eth.net.getId();
    let networkName = null;
    switch (networkId) {
      case 1:
        networkName = 'Main Ethereum';
        break;
      case 3:
        networkName = 'Ropsten';
        break;
      case 4:
        networkName = 'Rinkeby';
        break;
      case 42:
        networkName = 'Kovan';
        break;
      default:
        networkName = 'Private';
        break;
    }
    resolve({ ...results, networkId, networkName });
  })
})

export default getWeb3
