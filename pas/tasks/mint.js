const { BN } = require("@openzeppelin/test-helpers");

task("mint", "Mint coins to an address")
  .addParam("address", "The account that receives the new coins")
  .addParam("amount", "The amount of coins to mint")
  .setAction(async (taskArgs) => {
    const address = web3.utils.toChecksumAddress(taskArgs.address);
    const xtoken = await ethers.getContract("XToken");
    const BNCOIN = new BN("1000000000000000000");
    const amount = ethers.BigNumber.from(
      BNCOIN.mul(new BN(taskArgs.amount)).toString()
    );

    console.log(
      `Sending mint transaction to xtoken: ${
        xtoken.address
      }, receiver: ${address}, amount ${amount.toString()} ...`
    );

    var tx = await xtoken.mint(address, amount);
    console.log(`Transaction hash: ${tx.hash}`);
    console.log("Waiting for confirmation (minting)...");
    var receipt = await tx.wait();
    console.log(`tx hash: ${tx.hash}, receipt status: ${receipt.status}`);
  });

module.exports = {};
