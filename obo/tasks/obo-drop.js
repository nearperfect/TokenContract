const { BN } = require("@openzeppelin/test-helpers");
const csv = require("csvtojson");
const oboPerToken = "500";

task("tokendrop", "Drop token to accounts")
  .addParam("csv", "csv file of accounts and amounts")
  .setAction(async (taskArgs) => {
    const { deployer } = await getNamedAccounts();
    const xtoken = await ethers.getContract("XToken");
    // read csv file
    const csvFile = taskArgs.csv;
    const csvData = await csv().fromFile(csvFile);
    // define 1 coin
    const oneCOIN = new BN("1000000000000000000");
    // get deployer balance
    const deployerBalance = await xtoken.balanceOf(deployer);
    console.log("Deployer balance:", deployerBalance.toString());

    // loop through csv data
    for (let i = 0; i < csvData.length; i++) {
      const { address, amount } = csvData[i];
      // convert amount to wei
      const tokenAmount = ethers.BigNumber.from(
        oneCOIN.mul(new BN(amount)).mul(new BN(oboPerToken)).toString()
      );
      // print out transfer info
      console.log(
        `From: ${deployer}, to: ${address}, amount: ${tokenAmount.toString()}`
      );

      // transfer token
      const tx = await xtoken.transfer(address, tokenAmount);
      console.log("Transfer tx:", tx.hash);
    }
  });

module.exports = {};
