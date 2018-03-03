import Base58 from 'bs58';

const getAudit = (contract, auditor, codeHash) =>
    (new Promise((resolve, reject) => {
      contract.auditedContracts.call(auditor, codeHash, (err, audit) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            codeHash: codeHash,
            level: audit[0].toNumber(),
            insertedBlock: audit[1].toNumber(),
            ipfsHash: audit[2],
            auditedBy: audit[3]
          });
        }
      });
    }));

const getAuditedContractByIndex = (contract, auditor, index) => {
  return new Promise((resolve, reject) => {
    contract.auditorContracts.call(auditor, index, (err, auditHash) => {
      if (err)
        reject(err);
      else {
        resolve(auditHash);
      }
    });
  });
};

const getAuditedCodeHashes = async (contract, auditor) => {
  let contractHashes = [];
  try {
    let i = 0;
    while (true) {
      let contractHash = await getAuditedContractByIndex(contract, auditor, i);
      if (contractHash === '0x') {
        return contractHashes;
      }
      contractHashes.push(contractHash);
      ++i;
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


export { getAuditedContracts, getIPFSAddress };
