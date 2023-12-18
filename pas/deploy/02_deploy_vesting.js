module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer, alice } = await getNamedAccounts();
  const { ethers } = require("hardhat");

  /*
  const xtoken = await ethers.getContract("XToken");
  await deploy("TokenVesting", {
    from: deployer,
    log: true,
    args: [xtoken.address, alice],
  });
  */
};

module.exports.tags = ["TokenVesting"];
