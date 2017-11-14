pragma solidity ^0.4.15;
import "utils.sol";

contract MonteLabs {
  modifier onlyOwners() {
    require(owners[msg.sender] == true);
    _;
  }

  modifier auditExists(bytes32 codeHash) {
    require(auditedContracts[codeHash].level > 0);
    _;
  }

  // Attach 0x1220 to beggining of ipfsHash
  event AttachedEvidence(bytes32 indexed codeHash, bytes32 ipfsHash);
  event NewAudit(bytes32 codeHash, bytes32 ipfsHash);

  struct Audit {
    uint level;         // Audit level
    uint insertedBlock; // Audit's block
  }

  // MonteLabs owners
  mapping (address => bool) public owners;
  // Maps code's keccak256 hash to Audit
  mapping (bytes32 => Audit) public auditedContracts;

  function MonteLabs(address[] _owners) {
    require(_owners.length <= 5);
    for (uint i = 0; i < _owners.length; ++i) {
      owners[_owners[i]] = true;
    }
  }
  
  // Returns code audit level, 0 if not present
  function isVerifiedAddress(address addr) constant returns(uint) {
    var codeHash = keccak256(GetCode(addr));
    return auditedContracts[codeHash].level;
  }

  function isVerifiedCode(bytes32 codeHash) constant returns(uint) {
    return auditedContracts[codeHash].level;
  }
  
  // Add audit information
  function addAudit(bytes32 codeHash, uint _level, bytes32 ipfsHash) onlyOwners {
    auditedContracts[codeHash] = Audit({ 
        level: _level,
        insertedBlock: block.number
    });
    NewAudit(codeHash, ipfsHash);
  }
  
  // Add evidence to audited code 
  function addEvidence(bytes32 codeHash, bytes32 ipfsHash) 
    onlyOwners 
    auditExists(codeHash) {
    AttachedEvidence(codeHash, ipfsHash);
  }
}

