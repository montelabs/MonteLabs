pragma solidity ^0.4.15;
import "utils.sol";

contract MonteLabs {
  modifier onlyOwners() {
    require(owners[msg.sender] == true);
    _;
  }

  modifier addressNotPresent(Audit audit) {
    require(audit.addr == 0x0);
    _;
  }

  // Attach 0x1220 to beggining of ipfsHash
  event AttachedEvidence(bytes32 ipfsHash);

  struct Audit {
    address addr;
    uint level;
  }

  // MonteLabs owners
  mapping (address => bool) owners;
  // Maps code's keccak256 hash to Audit
  mapping (bytes32 => Audit) auditedContracts;

  function MonteLabs(address[] _owners) {
    require(_owners.length <= 5);
    for (uint i = 0; i < _owners.length; ++i)
      owners[_owners[i]] = true;  
  }
  
  function isVerified(address addr) constant returns(uint) {
    var codeHash = keccak256(GetCode(addr));
    return auditedContracts[codeHash].level;
  }

  function isVerified(bytes32 codeHash) constant returns(uint) {
    return auditedContracts[codeHash].level;
  }
  
  // Add audit information
  function addAudit(address) onlyOwners {
  }
  // Add address to audited code
  function addAddressInAudit(bytes32 codeHash, address addr)
    onlyOwners 
    addressNotPresent(auditedContracts[codeHash]) {
    auditedContracts[codeHash].addr = addr;
  }

}
