import Base58 from 'bs58';

const getAudit =
    async (contract, auditor, codeHash) => {
  let auditedContract =
      await contract.methods.auditedContracts(auditor, codeHash).call({});
  console.log('audited contracts', auditedContract);
  return {codeHash: codeHash, ...auditedContract};
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

const getIPFSAddress = (header, hexaAddr) => {
  const ipfsHexa = header + hexaAddr.substr(2, 64);
  console.log(Base58.encode(Buffer.from(ipfsHexa, 'hex')));
  return Base58.encode(Buffer.from(ipfsHexa, 'hex'));
};

const getBlockTimestamp = async (web3js, blockNumber) => {
    const block = await web3js.eth.getBlock(blockNumber);
    // If can't get block, return the first one
    if (block === null)
      return 0;
    return block.timestamp;
}

export {getAuditedContracts, getIPFSAddress, getBlockTimestamp};
