require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-etherscan");
require("@openzeppelin/hardhat-upgrades");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("hardhat-deploy");

require("dotenv").config();

const MUMBAI_PRIVATE_KEY_MOAC = process.env.MUMBAI_PRIVATE_KEY_MOAC;
const POLYGON_STAGE_PRIVATE_KEY_MOAC =
  process.env.POLYGON_STAGE_PRIVATE_KEY_MOAC;
const POLYGON_PROD_PRIVATE_KEY_MOAC = process.env.POLYGON_PROD_PRIVATE_KEY_MOAC;
const MUMBAI_MOAC_URL = process.env.MUMBAI_MOAC_URL;
const POLYGON_STAGE_MOAC_URL = process.env.POLYGON_STAGE_MOAC_URL;
const POLYGON_PROD_MOAC_URL = process.env.POLYGON_PROD_MOAC_URL;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const POLYSCAN_API_KEY = process.env.POLYSCAN_API_KEY;

const MUMBAI_PRIVATE_KEY_OWNER_MOAC = process.env.MUMBAI_PRIVATE_KEY_OWNER_MOAC;
const MUMBAI_PRIVATE_KEY_ALICE_MOAC = process.env.MUMBAI_PRIVATE_KEY_ALICE_MOAC;
const MUMBAI_PRIVATE_KEY_BOB_MOAC = process.env.MUMBAI_PRIVATE_KEY_BOB_MOAC;
const MUMBAI_PRIVATE_KEY_CHARLIE_MOAC =
  process.env.MUMBAI_PRIVATE_KEY_CHARLIE_MOAC;

const MUMBAI_PRIVATE_KEY_BECKETT = process.env.MUMBAI_PRIVATE_KEY_BECKETT;

module.exports = {
  networks: {
    hardhat: {
      tags: ["local"],
      allowUnlimitedContractSize: true,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      tags: ["localhost"],
    },
    mumbai: {
      url: MUMBAI_MOAC_URL,
      accounts: [
        MUMBAI_PRIVATE_KEY_MOAC,
        MUMBAI_PRIVATE_KEY_OWNER_MOAC,
        MUMBAI_PRIVATE_KEY_ALICE_MOAC,
        MUMBAI_PRIVATE_KEY_BOB_MOAC,
        MUMBAI_PRIVATE_KEY_CHARLIE_MOAC,
        MUMBAI_PRIVATE_KEY_BECKETT,
      ],
      tags: ["mumbai"],
    },
    polygon_staging: {
      chainId: 137,
      url: POLYGON_STAGE_MOAC_URL,
      accounts: [POLYGON_STAGE_PRIVATE_KEY_MOAC],
      tags: ["polygon_staging"],
    },
    polygon_production: {
      chainId: 137,
      url: POLYGON_PROD_MOAC_URL,
      accounts: [POLYGON_PROD_PRIVATE_KEY_MOAC],
      tags: ["polygon_production"],
    },
  },
  namedAccounts: {
    deployer: 0,
    owner: 1,
    alice: 2,
    bob: 3,
    charlie: 4,
    darwin: 5,
  },
  upgradeable: {
    uups: ["NFTCollection"],
  },
  gasReporter: {
    enabled: false,
  },
  mocha: {
    timeout: 999999,
    slow: 1000,
  },
  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN_API_KEY,
      polygon: POLYSCAN_API_KEY,
      polygonMumbai: POLYSCAN_API_KEY,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
};
