const { BN } = require("@openzeppelin/test-helpers");

task("transfer", "Grant role to an address")
  .addParam("from", "From address of the transfer")
  .addParam("to", "To address of the transfer")
  .addParam("amount", "Amount of the transfer")
  .setAction(async (taskArgs) => {
    const from = web3.utils.toChecksumAddress(taskArgs.from);
    const to = web3.utils.toChecksumAddress(taskArgs.to);
    const BNCOIN = new BN("1000000000000000000");
    const amount = ethers.BigNumber.from(
      BNCOIN.mul(new BN(taskArgs.amount)).toString()
    );
    const signers = await ethers.getSigners();
    const [deployer, owner, alice, bob, charlie, darwin] = signers;
    // select accountsf from the list with address equal to from
    const accounts = [deployer, owner, alice, bob, charlie, darwin];
    const fromAccount = accounts.find((account) => account.address === from);
    if (!fromAccount) {
        throw new Error(`Invalid from address: ${from}`);
    }
    const xtoken = await ethers.getContract("XToken");

    var balance = await xtoken.balanceOf(taskArgs.from);
    console.log(`Before -> Balance for ${taskArgs.from}: ${balance}`);
    balance = await xtoken.balanceOf(taskArgs.to);
    console.log(`Before -> Balance for ${taskArgs.to}: ${balance}`);

    var tx = await xtoken.connect(fromAccount).transfer(to, amount);
    console.log(`Transaction hash: ${tx.hash}`);
    console.log("Waiting for confirmation (transfering)...");
    var receipt = await tx.wait();
    console.log(`tx hash: ${tx.hash}, receipt status: ${receipt.status}`);

    var balance = await xtoken.balanceOf(taskArgs.from);
    console.log(`After -> Balance for ${taskArgs.from}: ${balance}`);
    balance = await xtoken.balanceOf(taskArgs.to);
    console.log(`After -> Balance for ${taskArgs.to}: ${balance}`);
  });

module.exports = {};