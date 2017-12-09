all:
	solc --overwrite --abi --bin  MonteLabs.sol -o ../compiledContracts
	solc --overwrite --abi --bin  MonteLabsMS.sol -o ../compiledContracts
	./scripts/unifyJson.py
	rm -f ../compiledContracts/*.bin ../compiledContracts/*.abi
