module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const { ethers } = require("hardhat");

  await deploy("XToken", {
    from: deployer,
    log: true,
    args: [
      "Obosky Token",
      "OBO",
      ethers.BigNumber.from("1000000000000000000000000000"),
    ],
  });
};

module.exports.tags = ["XToken"];
