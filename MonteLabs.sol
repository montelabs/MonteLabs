pragma solidity ^0.4.15;
import "utils.sol";

contract MonteLabs {

  struct Audit {
    address auditedContract;
    uint auditLevel;
  }

  // MonteLabs owners
  mapping (address => bool) owners;
  // Maps code keccak256 hasha to Audit
  mapping (bytes32 => Audit) auditedContracts;
  event AttachedEvidence(string ipfsHash);

  function MonteLabs(address[] _owners) {
    require(_owners.length <= 5);
    for (uint i = 0; i < _owners.length; ++i)
      owners[_owners[i]] = true;  
  }
  
  function isVerified(address addr) constant returns(uint) {
    var codeHash = keccak256(GetCode(addr));
    return auditedContracts[codeHash].auditLevel;
  }

  function isVerified(bytes32 codeHash) constant returns(uint) {
    return auditedContracts[codeHash].auditLevel;
  }
  
  function addAudit();
}
