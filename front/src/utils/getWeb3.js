import Web3 from 'web3';
// import Web3Eth from 'web3-core-requestmanager/';


const testConnection =
    (web3) => {
      return new Promise(
          (resolve, reject) => {web3.eth.getBlock(0, (err, res) => {
            if (err)
              resolve(false);
            else
              resolve(true);
          })});
    }


const connectToLocal = async () => {
  const pr = new Web3.providers.HttpProvider('http://localhost:8545');
  const web3js = new Web3(pr);
  const provider = 'local';
  const isLocal = await testConnection(web3js);
  if (!islocal)
    throw new Error('Failed to connect to local provider');
  return {web3js, provider};
}

const connectToBrowser = async () => {
  const pr = new Web3.providers.HttpProvider('http://localhost:8545');
  let provider;
  if (typeof web3 === 'undefined') {
    throw new Error('Failed to connect to browser provider');
  }
  if (window.web3.currentProvider.isMetaMask)
    provider = 'metamask';
  else
    provider = 'native';

  const web3js = new Web3(window.web3.currentProvider);
  return {web3js, provider};
}

const connectToInfura = async () => {
  const pr = new Web3.providers.HttpProvider('https://kovan.infura.io/DM5TjoIO6E0LEkDkYDtd');
  const provider = 'infura';
  const web3js = new Web3(pr);
  return {web3js, provider};
}

const tryAllProviders = async () => {
  let results;
  // Try in order Local, browser, infura
  try {
    results = await connectToLocal();
  }
  catch(err) {
    console.log('[web3] Local node not found');
    try {
      results = await connectToBrowser();
    }
    catch(err) {
      consol.elog('[web3] Browser node not found');
      results = await connectToInfura();
    }
  }
  return results;
};

const getWeb3 = async (params = null) => {
  let results = null;
  if (params === null)
    results = await tryAllProviders();
  
  else if (params.provider === 'local') {
    try {
      console.log('Trying to connect to local');
      results = await connectToLocal();
    }
    catch(err) {
      console.error('[web3] Failed to connect to local');
      results = await tryAllProviders();
    }
  }
  else if (params.provider === 'metamask' || params.provider === 'native') {
    try {
      console.log('Trying to connect to native');
      results = await connectToBrowser();
    }
    catch(err) {
      console.error('[web3] Failed to connect to native');
      results = await tryAllProviders();
    }
  }
  else if (params.provider === 'infura') {
    try {
      console.log('Trying to connect to infura');
      results = await connectToInfura();
    }
    catch(err) {
      console.error('[web3] Failed to connect to infura');
      results = await tryAllProviders();
    }
  }

  const networkId = await results.web3js.eth.net.getId();
  let networkName = null;
  if (networkId === 1)
    networkName = 'Main Ethereum';
  else if (networkId === 3)
    networkName = 'Ropsten';
  else if (networkId === 4)
    networkName = 'Rinkeby';
  else if (networkId === 42)
    networkName = 'Kovan';
  else
    networkName = 'Private';

  return {...results, networkId, networkName};
};

export default getWeb3
