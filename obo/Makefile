env:
	virtualenv .venv ;  . .venv/bin/activate ; pip install -r requirements.txt

myth:
	myth analyze contracts/vesting.sol --solc-json solc.json --parallel-solving --enable-coverage-strategy --enable-physics --execution-timeout 20 -o markdown

compile:
	npx hardhat compile

test: compile
	npx hardhat test

flatten:
	npx hardhat flatten > vesting.out.sol
