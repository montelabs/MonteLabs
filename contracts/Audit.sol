pragma solidity ^0.4.19;
import "./utils.sol";

contract Audit {
  // Attach 0x1220 to beggining of ipfsHash
  event AttachedEvidence(bytes32 indexed codeHash, uint indexed version, bytes32 ipfsHash, address indexed auditedBy);
  event NewAudit(bytes32 indexed codeHash, uint indexed version, bytes32 ipfsHash, address indexed auditedBy);

  // Maps code's keccak256 hash to Audit
  mapping (bytes32 => mapping(uint => DS.Proof)) public auditedContracts;
  mapping (bytes32 => uint) public auditVersions;
  
  function Audit() public {
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
    auditedContracts[codeHash][auditVersions[codeHash]] = DS.Proof({ 
        level: _level,
        auditedBy: msg.sender,
        insertedBlock: block.number
    });
    NewAudit(codeHash, auditVersions[codeHash], ipfsHash, msg.sender);
    ++auditVersions[codeHash];
  }
  
  // Add evidence to audited code, only author
  function addEvidence(bytes32 codeHash, uint version, bytes32 ipfsHash) public {
    require(auditedContracts[codeHash][version].auditedBy == msg.sender);
    AttachedEvidence(codeHash, version, ipfsHash, msg.sender);
  }
}

