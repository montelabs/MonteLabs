pragma solidity ^0.4.15;
import "./MonteLabs.sol";
import "./utils.sol";

contract MonteLabsMS {
  modifier onlyOwners() {
    require(owners[msg.sender] == true);
    _;
  }

  // MonteLabs owners
  mapping (address => bool) public owners;
  uint8 constant quorum = 2;
  MonteLabs public MSContract;

  DS.PendingAudit pendingAudit;

  function MonteLabsMS(address[] _owners, MonteLabs _MSContract) public {
    MSContract = _MSContract;
    require(_owners.length == 3);
    for (uint i = 0; i < _owners.length; ++i) {
      owners[_owners[i]] = true;
    }
  }

  function addAudit(bytes32 _codeHash, uint _level, bytes32 _ipfsHash,
                    uint8[] _sigV, bytes32[] _sigR, bytes32[] _sigS) public {
    require(_sigV.length == quorum);
    var hash = sha256(_codeHash, _level, _ipfsHash);
    address[2] memory voted;
    for (uint8 i = 0; i < _sigV.length; ++i) {
      var sudoer = ecrecover(keccak256("\x19Ethereum Signed Message:\n32", hash), _sigV[i], _sigR[i], _sigS[i]);
      require(owners[sudoer]);
      voted[i] = sudoer;
    }
    // At least 2 different owners
    assert(voted[0] != voted[1]);

    MSContract.addAudit(_codeHash, _level, _ipfsHash);
  }

  function addEvidence(bytes32 _codeHash, bytes32 _ipfsHash,
                       uint8[] _sigV, bytes32[] _sigR, bytes32[] _sigS) public {
    require(_sigV.length == quorum);
    var hash = sha256(_codeHash, _ipfsHash);
    address[2] memory voted;
    for (uint8 i = 0; i < _sigV.length; ++i) {
      var sudoer = ecrecover(keccak256("\x19Ethereum Signed Message:\n32", hash), _sigV[i], _sigR[i], _sigS[i]);
      require(owners[sudoer]);
      voted[i] = sudoer;
    }
    // At least 2 different owners
    assert(voted[0] != voted[1]);

    MSContract.addEvidence(_codeHash, _ipfsHash);
  }

}
