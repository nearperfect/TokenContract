task("revoke-role", "Revoke role of an address")
  .addParam("role", "The role to revoke")
  .addParam("address", "The address grant role to")
  .setAction(async (taskArgs) => {
    const address = web3.utils.toChecksumAddress(taskArgs.address);
    const xtoken = await ethers.getContract("XToken");
    var role = ""
    if (taskArgs.role == "DEFAULT_ADMIN_ROLE") {
      role = "0x0000000000000000000000000000000000000000000000000000000000000000"
    } else {
      role = web3.utils.keccak256(taskArgs.role);
    }

    console.log(`Sending the transaction to xtoken: ${xtoken.address} ...`);
    var tx = await xtoken.revokeRole(role, address);
    console.log(`Transaction hash: ${tx.hash}`);
    console.log("Waiting for confirmation (revoking)...");
    var receipt = await tx.wait();
    console.log(`tx hash: ${tx.hash}, receipt status: ${receipt.status}`);

    var roleMembers = await xtoken.getRoleMembers(role);
    console.log(`Role members: ${roleMembers}`);
    console.log("All roles operator granted");
  });

module.exports = {};