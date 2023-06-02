env:
	virtualenv .venv ;  . .venv/bin/activate ; pip install -r requirements.txt

myth:
	myth analyze contracts/vesting.sol --solc-json solc.json --execution-timeout 200

compile:
	npx hardhat compile

test: compile
	npx hardhat test
