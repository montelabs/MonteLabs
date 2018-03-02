const getAudit = (contract, codeHash, version) => (
  new Promise((resolve, reject) => {
    contract.auditedContracts.call(codeHash, version, (err, audit) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          level: audit[0].toNumber(),
          auditedBy: audit[1],
          insertedBlock: audit[2].toNumber()
        });
      }
    });
  })
);

export default getAudit;
