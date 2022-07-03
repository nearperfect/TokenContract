const { BN } = require("@openzeppelin/test-helpers");

task("check-token", "check token parameters").setAction(async (taskArgs) => {
  const xtoken = await ethers.getContract("XToken");
  const name = await xtoken.name();
  const symbol = await xtoken.symbol();
  const totalSupply = await xtoken.totalSupply();
  const cap = await xtoken.cap();
  console.log(
    `XToken: ${name}, symbo: ${symbol}, totalSupply: ${totalSupply}, cap: ${cap}`
  );
});

module.exports = {};
