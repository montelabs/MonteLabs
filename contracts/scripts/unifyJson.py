#!/usr/bin/env python
import json

def writeJSON(binary, ABI, filename):
  with open(filename, 'w') as jsonFile:
    obj = {'abi': ABI, 'bin': binary}
    json.dump(obj, jsonFile, indent=2)

if __name__ == '__main__':
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