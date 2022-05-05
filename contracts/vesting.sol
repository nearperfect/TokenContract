// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./roleAccess.sol";

contract TokenVesting is RoleAccess {
  using SafeMath for uint256;
  using Counters for Counters.Counter;

  struct VestingSched {
    uint256 id;
    string name;
    uint256 vestingTime;
    uint256 grantAmount;
    uint256 withdrawAmount;
  }

  struct SoloVesting {
    uint256 vestingID;
    address beneficiary;
    uint256 grantAmount;
    uint256 withdrawAmount;
  }

  event Funding(address indexed funding);
  event Vesting(
    uint256 indexed vestingSchedID,
    string name,
    uint256 vestingTime
  );
  event Grant(
    uint256 indexed vestingSchedID,
    address indexed beneficiary,
    uint256 indexed amount
  );
  event Withdraw(
    uint256 indexed vestingSchedID,
    address indexed from,
    address indexed beneficiary,
    uint256 amount
  );
  event Transfer(
    uint256 indexed vestingSchedID,
    address indexed from,
    address indexed to,
    uint256 amount
  );

  address public token;
  address public funding;
  Counters.Counter public vestingSchedID;
  mapping(uint256 => VestingSched) private vestingScheds;
  mapping(bytes32 => SoloVesting) private soloVestings;

  constructor(address token_, address funding_) {
    token = token_;
    funding = funding_;

    // owner has all roles
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(ADMIN_ROLE, _msgSender());
    _setupRole(GRANTER_ROLE, _msgSender());
  }

  function updateFunding(address newfunding) external onlyAdmin {
    funding = newfunding;
    emit Funding(funding);
  }

  function newVestingSched(string calldata name, uint256 vestingTime)
    external
    onlyAdmin
    returns (uint256)
  {
    uint256 id = vestingSchedID.current();
    vestingScheds[id] = VestingSched(id, name, vestingTime, 0, 0);
    vestingSchedID.increment();

    emit Vesting(id, name, vestingTime);
    return id;
  }

  function _grant(
    uint256 vestingSchedID_,
    address beneficiary,
    uint256 amount
  ) internal {
    require(
      vestingScheds[vestingSchedID_].vestingTime > 0,
      "Vesting does not exist"
    );
    bytes32 indexTo = keccak256(abi.encode(vestingSchedID_, beneficiary));
    // if soloVesting entry does not exist
    if (soloVestings[indexTo].beneficiary == address(0)) {
      soloVestings[indexTo] = SoloVesting(
        vestingSchedID_,
        beneficiary,
        amount,
        0
      );
    } else {
      soloVestings[indexTo].grantAmount += amount;
    }
  }

  function grant(
    uint256 vestingSchedID_,
    address[] calldata beneficiaries,
    uint256[] calldata grantAmounts
  ) external onlyGranter returns (bool) {
    require(
      vestingScheds[vestingSchedID_].vestingTime > 0,
      "Vesting does not exist"
    );
    require(
      beneficiaries.length == grantAmounts.length,
      "Grant amounts mismatch"
    );
    uint256 grantTotal = 0;
    for (uint256 i = 0; i < beneficiaries.length; i++) {
      address beneficiary = beneficiaries[i];
      uint256 grantAmount = grantAmounts[i];
      require(beneficiary != address(0), "Can not grant to null address");
      require(grantAmount > 0, "Should grant non-zero amount");

      grantTotal += grantAmount;
      _grant(vestingSchedID_, beneficiary, grantAmount);
      emit Grant(vestingSchedID_, beneficiary, grantAmount);
    }
    vestingScheds[vestingSchedID_].grantAmount += grantTotal;
    IERC20(token).transferFrom(funding, address(this), grantTotal);
    return true;
  }

  function withdraw(uint256 vestingSchedID_, uint256 amount)
    external
    returns (bool)
  {
    return _withdraw(vestingSchedID_, _msgSender(), amount);
  }

  function withdrawTo(
    uint256 vestingSchedID_,
    uint256 amount,
    address beneficiary
  ) external returns (bool) {
    return _withdraw(vestingSchedID_, beneficiary, amount);
  }

  function _withdraw(
    uint256 vestingSchedID_,
    address beneficiary,
    uint256 amount
  ) internal returns (bool) {
    require(
      vestingScheds[vestingSchedID_].vestingTime > 0,
      "Vesting does not exist"
    );
    require(beneficiary != address(0), "Can not withdraw to null address");
    require(amount > 0, "Withdraw amount should be non-zero");
    require(
      block.timestamp > vestingScheds[vestingSchedID_].vestingTime,
      "Can not withdraw before vesting starts"
    );

    bytes32 index = keccak256(abi.encode(vestingSchedID_, _msgSender()));
    SoloVesting memory soloVesting_ = soloVestings[index];
    uint256 netAmount = soloVesting_.grantAmount - soloVesting_.withdrawAmount;
    require(netAmount >= amount, "Not sufficient fund for withdrawal");
    soloVestings[index].withdrawAmount += amount;
    vestingScheds[vestingSchedID_].withdrawAmount += amount;

    // send the token
    IERC20(token).transfer(beneficiary, amount);
    emit Withdraw(vestingSchedID_, _msgSender(), beneficiary, amount);
    return true;
  }

  function transfer(
    uint256 vestingSchedID_,
    address beneficiary,
    uint256 amount
  ) external returns (bool) {
    require(
      vestingScheds[vestingSchedID_].vestingTime > 0,
      "Vesting does not exist"
    );
    require(beneficiary != address(0), "Can not transfer to null address");
    require(amount > 0, "Transfer amount should be non-zero");

    bytes32 indexFrom = keccak256(abi.encode(vestingSchedID_, _msgSender()));
    SoloVesting memory soloVesting_ = soloVestings[indexFrom];
    uint256 netAmount = soloVesting_.grantAmount - soloVesting_.withdrawAmount;
    require(netAmount >= amount, "Not sufficient fund for transfer");
    soloVestings[indexFrom].grantAmount -= amount;
    _grant(vestingSchedID_, beneficiary, amount);

    emit Transfer(vestingSchedID_, _msgSender(), beneficiary, amount);
    return true;
  }

  function allVestingScheds() external view returns (VestingSched[] memory) {
    VestingSched[] memory vestingScheds_ = new VestingSched[](
      vestingSchedID.current()
    );
    for (uint256 i = 0; i < vestingSchedID.current(); i++) {
      vestingScheds_[i] = vestingScheds[i];
    }

    return vestingScheds_;
  }

  function vestingSched(uint256 vestingSchedID_)
    external
    view
    returns (VestingSched memory)
  {
    return vestingScheds[vestingSchedID_];
  }

  function allSoloVestings(address beneficiary)
    external
    view
    returns (SoloVesting[] memory)
  {
    uint256 length = 0;
    for (uint256 i = 0; i < vestingSchedID.current(); i++) {
      bytes32 index = keccak256(abi.encode(i, beneficiary));
      if (soloVestings[index].grantAmount > 0) {
        length += 1;
      }
    }

    SoloVesting[] memory soloVestings_ = new SoloVesting[](length);
    for (uint256 i = 0; i < vestingSchedID.current(); i++) {
      bytes32 index = keccak256(abi.encode(i, beneficiary));
      if (soloVestings[index].grantAmount > 0) {
        soloVestings_[i] = soloVestings[index];
      }
    }

    return soloVestings_;
  }

  function soloVesting(uint256 vestingSchedID_, address beneficiary)
    external
    view
    returns (SoloVesting memory)
  {
    bytes32 index = keccak256(abi.encode(vestingSchedID_, beneficiary));
    return soloVestings[index];
  }
}
