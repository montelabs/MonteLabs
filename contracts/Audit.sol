pragma solidity ^0.4.19;
import "./utils.sol";

contract Audit {
  event AttachedEvidence(address indexed auditorAddr, bytes32 indexed codeHash, bytes32 ipfsHash);
  event NewAudit(address indexed auditorAddr, bytes32 indexed codeHash);

  // Maps auditor address and code's keccak256 to Audit
  mapping (address => mapping (bytes32 => DS.Proof)) public auditedContracts;
  // Maps auditor address to a list of audit code hashes
  mapping (address => bytes32[]) public auditorContracts;
  
  // Returns code audit level, 0 if not present
  function isVerifiedAddress(address _auditorAddr, address _contractAddr) public view returns(uint) {
    var codeHash = keccak256(GetCode(_contractAddr));
    return auditedContracts[_auditorAddr][codeHash].level;
  }

  function isVerifiedCode(address _auditorAddr, bytes32 _codeHash) public view returns(uint) {
    return auditedContracts[_auditorAddr][_codeHash].level;
  }
  
  // Add audit information
  function addAudit(bytes32 _codeHash, uint _level, bytes32 _ipfsHash) public {
    address auditor = msg.sender;
    require(auditedContracts[auditor][_codeHash].insertedBlock == 0);
    auditedContracts[auditor][_codeHash] = DS.Proof({ 
        level: _level,
        auditedBy: auditor,
        insertedBlock: block.number,
        ipfsHash: _ipfsHash
    });
    auditorContracts[auditor].push(_codeHash);
    NewAudit(auditor, _codeHash);
  }
  
  // Add evidence to audited code, only author, if _newLevel is different from original
  // updates the contract's level
  function addEvidence(bytes32 _codeHash, uint _newLevel, bytes32 _ipfsHash) public {
    address auditor = msg.sender;
    require(auditedContracts[auditor][_codeHash].insertedBlock != 0);
    if (auditedContracts[auditor][_codeHash].level != _newLevel)
      auditedContracts[auditor][_codeHash].level = _newLevel;
    AttachedEvidence(auditor, _codeHash, _ipfsHash);
  }
}

