pragma solidity ^0.4.15;
import "MonteLabs.sol";
import "utils.sol";

contract MonteLabsMS {
  modifier onlyOwners() {
    require(owners[msg.sender] == true);
    _;
  }

  // MonteLabs owners
  mapping (address => bool) public owners;
  MonteLabs public constant MSContract = MonteLabs(0x0000000000000000000000000000000000000000);

  DS.PendingAudit pendingAudit;

  function MonteLabsMS(address[] _owners) {
    require(_owners.length == 2);
    for (uint i = 0; i < _owners.length; ++i) {
      owners[_owners[i]] = true;
    }
  }

  function addAudit(bytes32 _codeHash, uint _level, bytes32 _ipfsHash)
    onlyOwners() {
    require(pendingAudit.level == 0); // Not pending audit
    pendingAudit = DS.PendingAudit({ 
        level: _level,
        codeHash: _codeHash,
        ipfsHash: _ipfsHash,
        author: msg.sender
    });
    // MonteLabs MSContract = MonteLabs(MonteLabsAddress);
    // MSContract.addAudit(codeHash, _level, ipfsHash);
  }

  function approveAudit() onlyOwners() {
    require(pendingAudit.level != 0); // Pending audit
    require(msg.sender != pendingAudit.author);

    MSContract.addAudit(pendingAudit.codeHash, pendingAudit.level, pendingAudit.ipfsHash);
    delete pendingAudit;
  }
}
