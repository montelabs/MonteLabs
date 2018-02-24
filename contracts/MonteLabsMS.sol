pragma solidity ^0.4.19;
import "./Audit.sol";
import "./utils.sol";

contract MonteLabsMS {
  // MonteLabs owners
  mapping (address => bool) public owners;
  uint8 constant quorum = 2;
  Audit public auditContract;

  function MonteLabsMS(address[] _owners, Audit _auditContract) public {
    auditContract = _auditContract;
    require(_owners.length == 3);
    for (uint i = 0; i < _owners.length; ++i) {
      owners[_owners[i]] = true;
    }
  }

  function addAuditOrEvidence(bool audit, bytes32 _codeHash, uint _levelOrVersion,
                              bytes32 _ipfsHash, uint8 _v, bytes32 _r, 
                              bytes32 _s) internal {
    address sender = msg.sender;
    require(owners[sender]);

    bytes32 prefixedHash = keccak256("\x19Ethereum Signed Message:\n32",
                           keccak256(audit, _codeHash, _levelOrVersion, _ipfsHash));

    address other = ecrecover(prefixedHash, _v, _r, _s);
    // At least 2 different owners
    assert(other != sender);
    if (audit)
      auditContract.addAudit(_codeHash, _levelOrVersion, _ipfsHash);
    else
      auditContract.addEvidence(_codeHash, _levelOrVersion, _ipfsHash);
  }

  function addAudit(bytes32 _codeHash, uint _level, bytes32 _ipfsHash,
                    uint8 _v, bytes32 _r, bytes32 _s) public {
    addAuditOrEvidence(true, _codeHash, _level, _ipfsHash, _v, _r, _s);
  }

  function addEvidence(bytes32 _codeHash, uint _version, bytes32 _ipfsHash,
                    uint8 _v, bytes32 _r, bytes32 _s) public {
    addAuditOrEvidence(false, _codeHash, _version, _ipfsHash, _v, _r, _s);
  }
}
