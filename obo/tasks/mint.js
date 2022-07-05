const { BN } = require("@openzeppelin/test-helpers");

task("mint", "Mint coins to an address")
  .addParam("account", "The account that receives the new coins")
  .addParam("amount", "The amount of coins to mint")
  .setAction(async (taskArgs) => {
    const account = web3.utils.toChecksumAddress(taskArgs.account);
    const xtoken = await ethers.getContract("XToken");
    const oneCOIN = new BN("1000000000000000000");
    const amount = ethers.BigNumber.from(
      oneCOIN.mul(new BN(taskArgs.amount)).toString()
    );

    console.log(
      `Sending mint transaction to xtoken: ${
        xtoken.address
      }, receiver: ${account}, amount ${amount.toString()} ...`
    );

    var tx = await xtoken.mint(account, amount);
    console.log(`Transaction hash: ${tx.hash}`);
    console.log("Waiting for confirmation (minting)...");
    var receipt = await tx.wait();
    console.log(`tx hash: ${tx.hash}, receipt status: ${receipt.status}`);
  });

module.exports = {};
