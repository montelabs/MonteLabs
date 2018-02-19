pragma solidity ^0.4.15;
import "./MonteLabs.sol";
import "./utils.sol";

contract MonteLabsMS {
  // MonteLabs owners
  mapping (address => bool) public owners;
  uint8 constant quorum = 2;
  MonteLabs public MSContract;

  function MonteLabsMS(address[] _owners, MonteLabs _MSContract) public {
    MSContract = _MSContract;
    require(_owners.length == 3);
    for (uint i = 0; i < _owners.length; ++i) {
      owners[_owners[i]] = true;
    }
  }

  function addAuditOrEvidence(bool audit, bytes32 _codeHash, uint _level_or_version,
                              bytes32 _ipfsHash, uint8[] _v, bytes32[] _r, 
                              bytes32[] _s) internal {
    require(_v.length == quorum);
    bytes32 prefixedHash = keccak256("\x19Ethereum Signed Message:\n32",
                           keccak256(_codeHash, _level_or_version, _ipfsHash));
    address[quorum] memory voted;
    for (uint8 i = 0; i < _v.length; ++i) {
      var sudoer = ecrecover(prefixedHash, _v[i], _r[i], _s[i]);
      require(owners[sudoer]);
      voted[i] = sudoer;
    }
    // At least 2 different owners
    assert(voted[0] != voted[1]);
    if (audit)
      MSContract.addAudit(_codeHash, _level_or_version, _ipfsHash);
    else
      MSContract.addEvidence(_codeHash, _level_or_version, _ipfsHash);
  }

  function addAudit(bytes32 _codeHash, uint _level, bytes32 _ipfsHash,
                    uint8[] _v, bytes32[] _r, bytes32[] _s) public  {
    addAuditOrEvidence(true, _codeHash, _level, _ipfsHash, _v, _r, _s);
  }

  function addEvidence(bytes32 _codeHash, uint _version, bytes32 _ipfsHash,
                    uint8[] _v, bytes32[] _r, bytes32[] _s) public {
    addAuditOrEvidence(false, _codeHash, _version, _ipfsHash, _v, _r, _s);
  }
}
