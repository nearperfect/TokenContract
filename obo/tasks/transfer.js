const { BN } = require("@openzeppelin/test-helpers");

task("transfer", "Transfer token between accounts")
  .addParam("to", "to account")
  .addParam("amount", "amount of tokens to transfer")
  .setAction(async (taskArgs) => {
    const { deployer } = await getNamedAccounts();
    var from = deployer;
    var to = web3.utils.toChecksumAddress(taskArgs.to);

    const xtoken = await ethers.getContract("XToken");
    const name = await xtoken.name();
    const symbol = await xtoken.symbol();
    const totalSupply = await xtoken.totalSupply();
    const cap = await xtoken.cap();
    const decimal = await xtoken.decimals();

    // get from acount balance
    const fromBalance = await xtoken.balanceOf(from);
    // get to account balance
    const toBalance = await xtoken.balanceOf(to);
    // define 1 coin
    const oneCOIN = new BN("1000000000000000000");
    // convert amount to wei
    const amount = ethers.BigNumber.from(
      oneCOIN.mul(new BN(taskArgs.amount)).toString()
    );

    console.log(
      `XToken: ${name}, symbo: ${symbol}, decimals: ${decimal}, totalSupply: ${totalSupply}, cap: ${cap}`
    );

    // print out transfer info
    console.log("From account:", from, "balance:", fromBalance.toString());
    console.log("To account:", to, "balance:", toBalance.toString());
    console.log("Transfer amount:", amount.toString());

    // transfer token
    var tx = await xtoken.transfer(to, amount);
    console.log("Transfer tx:", tx.hash);
  });

module.exports = {};
