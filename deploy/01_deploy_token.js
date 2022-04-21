module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const { ethers } = require("hardhat");

  // The contract is upgradeable through UUPS
  await deploy("XToken", {
    from: deployer,
    log: true,
    args: [
      "Geodnet Token",
      "GEOD",
      ethers.BigNumber.from("1000000000000000000000000000"),
    ],
  });
};

module.exports.tags = ["XToken"];