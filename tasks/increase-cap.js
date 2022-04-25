const { BN } = require("@openzeppelin/test-helpers");

task("increase-cap", "Increase cap of the token")
  .addParam("cap", "New cap of the token")
  .setAction(async (taskArgs) => {
    const xtoken = await ethers.getContract("XToken");
    const BNCOIN = new BN("1000000000000000000");
    const cap = ethers.BigNumber.from(
      BNCOIN.mul(new BN(taskArgs.cap)).toString()
    );

    console.log(
      `Sending setcap transaction to xtoken: ${
        xtoken.address
      }, cap: ${cap.toString()} ...`
    );

    var tx = await xtoken.setCap(cap);
    console.log(`Transaction hash: ${tx.hash}`);
    console.log("Waiting for confirmation (set new cap)...");
    var receipt = await tx.wait();
    console.log(`tx hash: ${tx.hash}, receipt status: ${receipt.status}`);
  });

module.exports = {};
