#!/usr/bin/env python
import json
import sys

def writeJSON(binary, ABI, filename):
  with open(filename, 'w') as jsonFile:
    obj = {'abi': ABI, 'bin': binary, 'deployed': {}}
    json.dump(obj, jsonFile, indent=2)

def markDeployed(jsonFilename, networkId, address):
  with open(jsonFilename, 'r') as jsonContract:
    jsonFile = json.load(jsonContract)
    jsonFile['deployed'][networkId] = address
  with open(jsonFilename, 'w') as jsonContract:
    json.dump(jsonFile, jsonContract, indent=2)

if __name__ == '__main__':
  if len(sys.argv) > 1:
    markDeployed(sys.argv[1], sys.argv[2], sys.argv[3])
    sys.exit(0)
  monteLabsContractPath = '../compiledContracts/MonteLabs'
  monteLabsMSPath = '../compiledContracts/MonteLabsMS'
  with \
  open(monteLabsContractPath + '.bin') as monteLabsContractBin, \
  open(monteLabsContractPath + '.abi') as monteLabsContractABI:
    writeJSON(monteLabsContractBin.readlines()[0], \
      monteLabsContractABI.readlines()[0], '../compiledContracts/MonteLabs.json')
  
  with \
  open(monteLabsMSPath + '.bin') as monteLabsMSContractBin, \
  open(monteLabsMSPath + '.abi') as monteLabsMSContractABI:
    writeJSON(monteLabsMSContractBin.readlines()[0], \
      monteLabsMSContractABI.readlines()[0], '../compiledContracts/MonteLabsMS.json')