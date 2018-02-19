pragma solidity ^0.4.15;
import "./utils.sol";

contract MonteLabs {
  modifier auditExists(bytes32 codeHash, uint version) {
    require(auditedContracts[codeHash][version].level > 0);
    _;
  }

  // Attach 0x1220 to beggining of ipfsHash
  event AttachedEvidence(bytes32 indexed codeHash, uint version, bytes32 ipfsHash, address indexed auditedBy);
  event NewAudit(bytes32 indexed codeHash, uint version, bytes32 ipfsHash, address indexed auditedBy);

  // Maps code's keccak256 hash to Audit
  mapping (bytes32 => mapping(uint => DS.Audit)) public auditedContracts;
  mapping (bytes32 => uint) public AuditVersions;
  
  function MonteLabs() public {
  }
  
  // Returns code audit level, 0 if not present
  function isVerifiedAddress(address addr, uint version) public view returns(uint) {
    var codeHash = keccak256(GetCode(addr));
    return auditedContracts[codeHash][version].level;
  }

  function isVerifiedCode(bytes32 codeHash, uint version) public view returns(uint) {
    return auditedContracts[codeHash][version].level;
  }
  
  // Add audit information
  function addAudit(bytes32 codeHash, uint _level, bytes32 ipfsHash) public {
    auditedContracts[codeHash][AuditVersions[codeHash]] = DS.Audit({ 
        level: _level,
        auditedBy: msg.sender,
        insertedBlock: block.number
    });
    NewAudit(codeHash, AuditVersions[codeHash], ipfsHash, msg.sender);
    ++AuditVersions[codeHash];
  }
  
  // Add evidence to audited code 
  function addEvidence(bytes32 codeHash, uint version, bytes32 ipfsHash) public
    auditExists(codeHash, version) {
    AttachedEvidence(codeHash, version, ipfsHash, msg.sender);
  }
}

