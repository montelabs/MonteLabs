pragma solidity ^0.4.15;
import "./utils.sol";

contract MonteLabs {
  modifier auditExists(bytes32 codeHash) {
    require(auditedContracts[codeHash].level > 0);
    _;
  }

  // Attach 0x1220 to beggining of ipfsHash
  event AttachedEvidence(bytes32 indexed codeHash, bytes32 ipfsHash, address indexed auditedBy);
  event NewAudit(bytes32 indexed codeHash, bytes32 ipfsHash, address indexed auditedBy);

  // Maps code's keccak256 hash to Audit
  mapping (bytes32 => DS.Audit) public auditedContracts;

  function MonteLabs() public {
  }
  
  // Returns code audit level, 0 if not present
  function isVerifiedAddress(address addr) public view returns(uint) {
    var codeHash = keccak256(GetCode(addr));
    return auditedContracts[codeHash].level;
  }

  function isVerifiedCode(bytes32 codeHash) public view returns(uint) {
    return auditedContracts[codeHash].level;
  }
  
  // Add audit information
  function addAudit(bytes32 codeHash, uint _level, bytes32 ipfsHash) public {
    auditedContracts[codeHash] = DS.Audit({ 
        level: _level,
        auditedBy: msg.sender,
        insertedBlock: block.number
    });
    NewAudit(codeHash, ipfsHash, msg.sender);
  }
  
  // Add evidence to audited code 
  function addEvidence(bytes32 codeHash, bytes32 ipfsHash) public
    auditExists(codeHash) {
    AttachedEvidence(codeHash, ipfsHash, msg.sender);
  }
}

