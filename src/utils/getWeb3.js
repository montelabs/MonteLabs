import Web3 from 'web3/src';

let getWeb3 = new Promise((resolve, reject) => {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function() {
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
      resolve(results);
    } 
    else {
      let pr = new Web3.providers.HttpProvider('https://kovan.infura.io/')
      provider = 'Infura'
      web3js = new Web3(pr);

      results = {
        web3js,
        provider
      }
      console.log('No web3 instance injected, using infura\'s provider');
      resolve(results);
    }
  })
})

export default getWeb3
