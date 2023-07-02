// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./roleAccess.sol";

contract TokenVestingWithRecall is RoleAccess {
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
    event Approval(
        uint256 indexed vestingSchedID,
        address indexed owner,
        address indexed spender,
        uint256 amount
    );
    event Recall(
        uint256 indexed vestingSchedID,
        address indexed from,
        address indexed receipient,
        uint256 amount
    );

    address public token;
    address public funding;
    Counters.Counter public vestingSchedID;
    mapping(uint256 => VestingSched) private _vestingScheds;
    mapping(bytes32 => SoloVesting) private _soloVestings;
    mapping(uint256 => address[]) private _soloVestingKeys;

    // scheduleID => owner => spender => amount
    mapping(uint256 => mapping(address => mapping(address => uint256)))
        private _allowances;

    constructor(address token_, address funding_) {
        token = token_;
        funding = funding_;

        // owner has all roles
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(ADMIN_ROLE, _msgSender());
        _setupRole(GRANTER_ROLE, _msgSender());
    }

    function soloVestingsLength(
        uint256 sched
    ) public view returns (uint256) {
        return _soloVestingKeys[sched].length;
    }

    function allSoloVestingsForSched(
        uint256 sched
    ) external view returns (SoloVesting[] memory) {
        SoloVesting[] memory soloVestings = new SoloVesting[](
            soloVestingsLength(sched)
        );
        for (uint256 i = 0; i < soloVestingsLength(sched); i++) {
            bytes32 indexTo = keccak256(
                abi.encode(sched, _soloVestingKeys[sched][i])
            );
            soloVestings[i] = _soloVestings[indexTo];
        }
        return soloVestings;
    }

    /// @notice Update the funding source of vesting schedules
    /// @param newfunding The new address of the funding source account
    function updateFunding(address newfunding) external onlyAdmin {
        funding = newfunding;
        emit Funding(funding);
    }

    /// @notice Create new vesting schedule
    /// @param name The name of the vesting schedule, such as "3-month vesting schedule"
    /// @param vestingTime The timestamp in seconds of the beginning of the vesting period.
    /// @return The id of the created new vesting schedule.
    function newVestingSched(
        string calldata name,
        uint256 vestingTime
    ) external onlyAdmin returns (uint256) {
        uint256 id = vestingSchedID.current();
        _vestingScheds[id] = VestingSched(id, name, vestingTime, 0, 0);
        vestingSchedID.increment();

        emit Vesting(id, name, vestingTime);
        return id;
    }

    function updateVestingSchedTime(
        uint256 vestingSchedID_,
        uint256 vestingTime
    ) external onlyAdmin returns (bool) {
        require(
            _vestingScheds[vestingSchedID_].vestingTime > 0,
            "Vesting does not exist"
        );
        _vestingScheds[vestingSchedID_].vestingTime = vestingTime;
        return true;
    }

    function _grant(
        uint256 vestingSchedID_,
        address beneficiary,
        uint256 amount
    ) internal virtual {
        require(
            _vestingScheds[vestingSchedID_].vestingTime > 0,
            "Vesting does not exist"
        );
        bytes32 indexTo = keccak256(abi.encode(vestingSchedID_, beneficiary));
        // if soloVesting entry does not exist
        if (_soloVestings[indexTo].beneficiary == address(0)) {
            _soloVestings[indexTo] = SoloVesting(
                vestingSchedID_,
                beneficiary,
                amount,
                0
            );
            _soloVestingKeys[vestingSchedID_].push(beneficiary);
        } else {
            _soloVestings[indexTo].grantAmount += amount;
        }
    }

    /// @notice Grant a list of beneficiaries tokens for a vesting schedule
    /// @param vestingSchedID_ The vesting schedule of the token grant
    /// @param beneficiaries A list of beneficiaries addresses
    /// @param grantAmounts A list of token amounts that each beneficiary will be granted
    /// @return Return true if the function is called without any issue.
    function grant(
        uint256 vestingSchedID_,
        address[] calldata beneficiaries,
        uint256[] calldata grantAmounts
    ) external onlyGranter returns (bool) {
        require(
            _vestingScheds[vestingSchedID_].vestingTime > 0,
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
        _vestingScheds[vestingSchedID_].grantAmount += grantTotal;
        bool result = IERC20(token).transferFrom(
            funding,
            address(this),
            grantTotal
        );
        require(result, "Grant failed with token transfer");
        return true;
    }

    /// @notice Withdraw granted tokens into caller's address
    /// @param vestingSchedID_ ID of the vesting schedule to withdraw token from.
    /// @param amount Amount of token to withdraw.
    function withdraw(
        uint256 vestingSchedID_,
        uint256 amount
    ) external returns (bool) {
        return _withdraw(vestingSchedID_, _msgSender(), amount);
    }

    /// @notice Withdraw granted tokens into beneficiary's address
    /// @param vestingSchedID_ The ID of the vesting schedule to withdraw token from.
    /// @param amount Amount of token to withdraw.
    /// @param beneficiary The address that will receive the withdrawed tokens.
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
    ) internal virtual returns (bool) {
        return
            _withdrawFrom(vestingSchedID_, _msgSender(), beneficiary, amount);
    }

    function _withdrawFrom(
        uint256 vestingSchedID_,
        address from,
        address receipient,
        uint256 amount
    ) internal virtual returns (bool) {
        require(
            _vestingScheds[vestingSchedID_].vestingTime > 0,
            "Vesting does not exist"
        );
        require(receipient != address(0), "Can not withdraw to null address");
        require(amount > 0, "Withdraw amount should be non-zero");
        require(
            block.timestamp > _vestingScheds[vestingSchedID_].vestingTime,
            "Can not withdraw before vesting starts"
        );

        bytes32 index = keccak256(abi.encode(vestingSchedID_, from));
        SoloVesting memory soloVesting_ = _soloVestings[index];
        uint256 netAmount = soloVesting_.grantAmount -
            soloVesting_.withdrawAmount;
        require(netAmount >= amount, "Not sufficient fund for withdrawal");
        _soloVestings[index].withdrawAmount += amount;
        _vestingScheds[vestingSchedID_].withdrawAmount += amount;

        // send the toke
        emit Withdraw(vestingSchedID_, from, receipient, amount);
        bool result = IERC20(token).transfer(receipient, amount);
        require(result, "Withdrawal failed with token transfer");

        return true;
    }

    /// @notice Recall all vesting tokens into recipient's address
    /// @param vestingSchedID_ The ID of the vesting schedule to recall token from.
    /// @param from The address that will be used to recall the tokens.
    /// @param recipient The address that will receive the recalled tokens.
    function recallVesting(
        uint256 vestingSchedID_,
        address from,
        address recipient
    ) external onlyAdmin {
        bytes32 index = keccak256(abi.encode(vestingSchedID_, from));
        require(
            _soloVestings[index].beneficiary != address(0),
            "Vesting does not exist"
        );
        uint256 netAmount = _soloVestings[index].grantAmount -
            _soloVestings[index].withdrawAmount;
        require(netAmount > 0, "Recall amount should be non-zero");

        _withdrawFrom(vestingSchedID_, from, recipient, netAmount);

        emit Recall(vestingSchedID_, from, recipient, netAmount);
    }

    /// @notice Allow the spender to transfer up to certain amount of token from owner's vesting
    /// @param spender The beneficiary that will be approved.
    /// @param vestingSchedID_ The ID of the vesting schedule to withdraw token from.
    /// @param amount The amount of transfered grants.
    function approve(
        address spender,
        uint256 vestingSchedID_,
        uint256 amount
    ) external returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, vestingSchedID_, amount);
        return true;
    }

    function _approve(
        address owner,
        address spender,
        uint256 vestingSchedID_,
        uint256 amount
    ) internal virtual {
        require(owner != address(0), "approve from the zero address");
        require(spender != address(0), "approve to the zero address");

        _allowances[vestingSchedID_][owner][spender] = amount;
        emit Approval(vestingSchedID_, owner, spender, amount);
    }

    /// @notice Return the allowed amount of token the spender can transfer from owner's vesting.
    /// @param owner The owner of the vesting.
    /// @param spender The spender of the allowance.
    /// @param vestingSchedID_ The ID of the vesting schedule to transfer token from.
    function allowance(
        address owner,
        address spender,
        uint256 vestingSchedID_
    ) external view returns (uint256) {
        return _allowances[vestingSchedID_][owner][spender];
    }

    /// @notice Transfer vesting between beneficiaries.
    /// @param beneficiary The beneficiary that will receive the transfered grants.
    /// @param vestingSchedID_ The ID of the vesting schedule to withdraw token from.
    /// @param amount The amount of transfered grants.
    function transfer(
        address beneficiary,
        uint256 vestingSchedID_,
        uint256 amount
    ) external returns (bool) {
        address from = _msgSender();
        _transfer(from, beneficiary, vestingSchedID_, amount);
        return true;
    }

    /// @notice Transfer vesting between beneficiaries after approval
    /// @param from The source account of the token transfer.
    /// @param beneficiary The beneficiary that will receive the transfered grants.
    /// @param vestingSchedID_ The ID of the vesting schedule to withdraw token from.
    /// @param amount The amount of transfered grants.
    function transferFrom(
        address from,
        address beneficiary,
        uint256 vestingSchedID_,
        uint256 amount
    ) external returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, vestingSchedID_, amount);
        _transfer(from, beneficiary, vestingSchedID_, amount);
        return true;
    }

    function _spendAllowance(
        address owner,
        address spender,
        uint256 vestingSchedID_,
        uint256 amount
    ) internal virtual {
        uint256 currentAllowance = _allowances[vestingSchedID_][owner][spender];
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "Insufficient allowance");
            unchecked {
                _approve(
                    owner,
                    spender,
                    vestingSchedID_,
                    currentAllowance - amount
                );
            }
        }
    }

    function _transfer(
        address from,
        address beneficiary,
        uint256 vestingSchedID_,
        uint256 amount
    ) internal virtual returns (bool) {
        require(
            _vestingScheds[vestingSchedID_].vestingTime > 0,
            "Vesting does not exist"
        );
        require(beneficiary != address(0), "Can not transfer to null address");
        require(amount > 0, "Transfer amount should be non-zero");

        bytes32 indexFrom = keccak256(abi.encode(vestingSchedID_, from));
        SoloVesting memory soloVesting_ = _soloVestings[indexFrom];
        uint256 netAmount = soloVesting_.grantAmount -
            soloVesting_.withdrawAmount;
        require(netAmount >= amount, "Not sufficient fund for transfer");
        _soloVestings[indexFrom].grantAmount -= amount;
        _grant(vestingSchedID_, beneficiary, amount);

        emit Transfer(vestingSchedID_, from, beneficiary, amount);
        return true;
    }

    /// @notice Return all vesting schedules.
    function allVestingScheds() external view returns (VestingSched[] memory) {
        VestingSched[] memory vestingScheds_ = new VestingSched[](
            vestingSchedID.current()
        );
        for (uint256 i = 0; i < vestingSchedID.current(); i++) {
            vestingScheds_[i] = _vestingScheds[i];
        }

        return vestingScheds_;
    }

    /// @notice Return a single vesting schedules.
    /// @param vestingSchedID_ a single vesting schedule by ID
    function vestingSched(
        uint256 vestingSchedID_
    ) external view returns (VestingSched memory) {
        return _vestingScheds[vestingSchedID_];
    }

    /// @notice Return all vesting schedules for a single user.
    /// @param beneficiary User's address
    function allSoloVestings(
        address beneficiary
    ) external view returns (SoloVesting[] memory) {
        uint256 length = 0;
        for (uint256 i = 0; i < vestingSchedID.current(); i++) {
            bytes32 index = keccak256(abi.encode(i, beneficiary));
            if (_soloVestings[index].beneficiary != address(0)) {
                length += 1;
            }
        }

        SoloVesting[] memory soloVestings_ = new SoloVesting[](length);
        uint256 pos = 0;
        for (uint256 i = 0; i < vestingSchedID.current(); i++) {
            bytes32 index = keccak256(abi.encode(i, beneficiary));
            if (_soloVestings[index].beneficiary != address(0)) {
                soloVestings_[pos] = _soloVestings[index];
                pos += 1;
            }
        }

        return soloVestings_;
    }

    /// @notice Return beneficiary's vesting for a certain vesting schedule.
    /// @param vestingSchedID_ The ID of the vesting schedule.
    /// @param beneficiary The beneficiary's account
    function soloVesting(
        uint256 vestingSchedID_,
        address beneficiary
    ) external view returns (SoloVesting memory) {
        bytes32 index = keccak256(abi.encode(vestingSchedID_, beneficiary));
        return _soloVestings[index];
    }
}
