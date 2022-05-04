// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TokenVesting {
  using SafeMath for uint256;
  using Counters for Counters.Counter;

  struct VestingSched {
    uint256 id;
    string name;
    uint256 startDate;
    uint256 grantAmount;
    uint256 withdrawAmount;
  }

  struct SoloVesting {
    uint256 vestingID;
    address beneficiary;
    uint256 grantAmount;
    uint256 withdrawAmount;
  }

  address private token;
  address private founding;
  Counters.Counter private vestingSchedID;
  mapping(uint256 => VestingSched) private vestingScheds;
  mapping(uint256 => mapping(address => SoloVesting)) private soloVestings;

  constructor(address token_, address founding_) {
    token = token_;
    founding = founding_;
  }

  function newVestingSched(string calldata name_, uint256 startDate_)
    external
    returns (uint256)
  {
    uint256 id = vestingSchedID.current();
    vestingScheds[id] = VestingSched(id, name_, startDate_, 0, 0);
    vestingSchedID.increment();
    return id;
  }

  function grant(
    uint256 vestingID,
    address[] calldata beneficiaries,
    uint256[] calldata grantAmounts
  ) external {
    require(beneficiaries.length == grantAmounts.length, "");
    uint256 grantTotal = 0;
    for (uint256 i = 0; i < beneficiaries.length; i++) {
      address beneficiary = beneficiaries[i];
      uint256 grantAmount = grantAmounts[i];
      if (soloVestings[vestingID][beneficiary].beneficiary == address(0x0)) {
        soloVestings[vestingID][beneficiary] = SoloVesting(
          vestingID,
          beneficiary,
          grantAmount,
          0
        );
      } else {
        soloVestings[vestingID][beneficiary].grantAmount += grantAmount;
      }
      grantTotal += grantAmounts[i];
    }
    IERC20(token).transferFrom(founding, address(this), grantTotal);
  }

  function withdraw(uint256 vestingID, uint256 amount) external {
    SoloVesting memory soloVesting_ = soloVestings[vestingID][msg.sender];
    uint256 netAmount = soloVesting_.grantAmount - soloVesting_.withdrawAmount;
    require(netAmount >= amount, "");
    vestingScheds[vestingID].withdrawAmount += amount;
    IERC20(token).transferFrom(address(this), msg.sender, amount);
  }

  function transfer(
    uint256 vestingID,
    address beneficiary,
    uint256 amount
  ) external {
    SoloVesting memory soloVesting_ = soloVestings[vestingID][msg.sender];
    uint256 netAmount = soloVesting_.grantAmount - soloVesting_.withdrawAmount;
    require(netAmount >= amount);

    soloVestings[vestingID][msg.sender].grantAmount -= amount;
    soloVestings[vestingID][beneficiary].grantAmount += amount;
  }

  function allVestingSched() external view returns (VestingSched[] memory) {
    VestingSched[] memory vestingScheds_;
    for (uint256 i = 0; i < vestingSchedID.current(); i++) {
      vestingScheds_[i] = vestingScheds[i];
    }
    return vestingScheds_;
  }

  function soloVesting(address beneficiary)
    external
    view
    returns (SoloVesting[] memory)
  {
    SoloVesting[] memory soloVestings_;
    for (uint256 i = 0; i < vestingSchedID.current(); i++) {
      if (soloVestings[i][beneficiary].grantAmount > 0) {
        soloVestings_[i] = soloVestings[i][beneficiary];
      }
    }

    return soloVestings_;
  }
}
