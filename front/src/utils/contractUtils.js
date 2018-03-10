import Base58 from 'bs58';

const getAudit =
    async (contract, auditor, codeHash) => {
  let auditedContract =
      await contract.methods.auditedContracts(auditor, codeHash).call({});
  return {codeHash: codeHash, pending: true, ...auditedContract};
}

const getAuditedCodeHashes = async (contract, auditor) => {
  let contractHashes = [];
  try {
    let i = 0;
    while (true) {
      try {
        let contractHash =
            await contract.methods.auditorContracts(auditor, i).call({});
        contractHashes.push(contractHash);
        ++i;
      } catch (err) {
        return contractHashes;
      }
    }
  } catch (err) {
    console.error('[getAuditedCodeHashes]', err);
  }
};

const getAuditedContracts = async (contract, auditor) => {
  const codeHashes = await getAuditedCodeHashes(contract, auditor);
  const contracts = codeHashes.map(codeHash => {
    return getAudit(contract, auditor, codeHash);
  });
  return Promise.all(contracts);
};

const getIPFSAddress = (hexaAddr) => {
  const IPFS_HASH = '82ddfdec';
  const ipfsHexa = IPFS_HASH + hexaAddr.substr(2, 64);
  return Base58.encode(Buffer.from(ipfsHexa, 'hex'));
};

const getBlockTimestamp = (web3js, blockNumber) => new Promise(
    (resolve, reject) => {web3js.eth.getBlock(blockNumber, (err, result) => {
      if (err)
        reject(err);
      else
        resolve(result.timestamp);
    })});


export {getAuditedContracts, getIPFSAddress, getBlockTimestamp};
