# Solidity API

## RoleAccess

### ADMIN_ROLE

```solidity
bytes32 ADMIN_ROLE
```

### MINTER_ROLE

```solidity
bytes32 MINTER_ROLE
```

### BURNER_ROLE

```solidity
bytes32 BURNER_ROLE
```

### GRANTER_ROLE

```solidity
bytes32 GRANTER_ROLE
```

### BLACKLISTER_ROLE

```solidity
bytes32 BLACKLISTER_ROLE
```

### Role

```solidity
struct Role {
  bytes32 role;
  string describe;
}
```

### onlyAdmin

```solidity
modifier onlyAdmin()
```

### onlyMinter

```solidity
modifier onlyMinter()
```

### onlyBurner

```solidity
modifier onlyBurner()
```

### onlyGranter

```solidity
modifier onlyGranter()
```

### onlyBlacklister

```solidity
modifier onlyBlacklister()
```

### getRoles

```solidity
function getRoles() external pure returns (struct RoleAccess.Role[])
```

### addRoleMember

```solidity
function addRoleMember(bytes32 role, address member) external returns (bool)
```

### removeRoleMember

```solidity
function removeRoleMember(bytes32 role, address member) external returns (bool)
```

### getRoleMembers

```solidity
function getRoleMembers(bytes32 role) external view returns (address[])
```

### grantMinter

```solidity
function grantMinter(address minter) external returns (bool)
```

### revokeMinter

```solidity
function revokeMinter(address minter) external returns (bool)
```

### grantBurner

```solidity
function grantBurner(address burner) external returns (bool)
```

### revokeBurner

```solidity
function revokeBurner(address burner) external returns (bool)
```

### grantGranter

```solidity
function grantGranter(address granter) external returns (bool)
```

### revokeGranter

```solidity
function revokeGranter(address granter) external returns (bool)
```

### grantBlacklister

```solidity
function grantBlacklister(address blacklister) external returns (bool)
```

### revokeBlacklister

```solidity
function revokeBlacklister(address blacklister) external returns (bool)
```

## TokenVesting

### VestingSched

```solidity
struct VestingSched {
  uint256 id;
  string name;
  uint256 vestingTime;
  uint256 grantAmount;
  uint256 withdrawAmount;
}
```

### SoloVesting

```solidity
struct SoloVesting {
  uint256 vestingID;
  address beneficiary;
  uint256 grantAmount;
  uint256 withdrawAmount;
}
```

### Funding

```solidity
event Funding(address funding)
```

### Vesting

```solidity
event Vesting(uint256 vestingSchedID, string name, uint256 vestingTime)
```

### Grant

```solidity
event Grant(uint256 vestingSchedID, address beneficiary, uint256 amount)
```

### Withdraw

```solidity
event Withdraw(uint256 vestingSchedID, address from, address beneficiary, uint256 amount)
```

### Transfer

```solidity
event Transfer(uint256 vestingSchedID, address from, address to, uint256 amount)
```

### Approval

```solidity
event Approval(uint256 vestingSchedID, address owner, address spender, uint256 amount)
```

### token

```solidity
address token
```

### funding

```solidity
address funding
```

### vestingSchedID

```solidity
struct Counters.Counter vestingSchedID
```

### constructor

```solidity
constructor(address token_, address funding_) public
```

### updateFunding

```solidity
function updateFunding(address newfunding) external
```

Update the funding source of vesting schedules

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newfunding | address | The new address of the funding source account |

### newVestingSched

```solidity
function newVestingSched(string name, uint256 vestingTime) external returns (uint256)
```

Create new vesting schedule

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| name | string | The name of the vesting schedule, such as "3-month vesting schedule" |
| vestingTime | uint256 | The timestamp in seconds of the beginning of the vesting period. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The id of the created new vesting schedule. |

### _grant

```solidity
function _grant(uint256 vestingSchedID_, address beneficiary, uint256 amount) internal virtual
```

### grant

```solidity
function grant(uint256 vestingSchedID_, address[] beneficiaries, uint256[] grantAmounts) external returns (bool)
```

Grant a list of beneficiaries tokens for a vesting schedule

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vestingSchedID_ | uint256 | The vesting schedule of the token grant |
| beneficiaries | address[] | A list of beneficiaries addresses |
| grantAmounts | uint256[] | A list of token amounts that each beneficiary will be granted |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | Return true if the function is called without any issue. |

### withdraw

```solidity
function withdraw(uint256 vestingSchedID_, uint256 amount) external returns (bool)
```

Withdraw granted tokens into caller's address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vestingSchedID_ | uint256 | ID of the vesting schedule to withdraw token from. |
| amount | uint256 | Amount of token to withdraw. |

### withdrawTo

```solidity
function withdrawTo(uint256 vestingSchedID_, uint256 amount, address beneficiary) external returns (bool)
```

Withdraw granted tokens into beneficiary's address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vestingSchedID_ | uint256 | The ID of the vesting schedule to withdraw token from. |
| amount | uint256 | Amount of token to withdraw. |
| beneficiary | address | The address that will receive the withdrawed tokens. |

### _withdraw

```solidity
function _withdraw(uint256 vestingSchedID_, address beneficiary, uint256 amount) internal returns (bool)
```

### approve

```solidity
function approve(address spender, uint256 vestingSchedID_, uint256 amount) external returns (bool)
```

Allow the spender to transfer up to certain amount of token from owner's vesting

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| spender | address | The beneficiary that will be approved. |
| vestingSchedID_ | uint256 | The ID of the vesting schedule to withdraw token from. |
| amount | uint256 | The amount of transfered grants. |

### _approve

```solidity
function _approve(address owner, address spender, uint256 vestingSchedID_, uint256 amount) internal virtual
```

### allowance

```solidity
function allowance(address owner, address spender, uint256 vestingSchedID_) external view returns (uint256)
```

Return the allowed amount of token the spender can transfer from owner's vesting.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | The owner of the vesting. |
| spender | address | The spender of the allowance. |
| vestingSchedID_ | uint256 | The ID of the vesting schedule to transfer token from. |

### transfer

```solidity
function transfer(address beneficiary, uint256 vestingSchedID_, uint256 amount) external returns (bool)
```

Transfer vesting between beneficiaries.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| beneficiary | address | The beneficiary that will receive the transfered grants. |
| vestingSchedID_ | uint256 | The ID of the vesting schedule to withdraw token from. |
| amount | uint256 | The amount of transfered grants. |

### transferFrom

```solidity
function transferFrom(address from, address beneficiary, uint256 vestingSchedID_, uint256 amount) external returns (bool)
```

Transfer vesting between beneficiaries after approval

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | The source account of the token transfer. |
| beneficiary | address | The beneficiary that will receive the transfered grants. |
| vestingSchedID_ | uint256 | The ID of the vesting schedule to withdraw token from. |
| amount | uint256 | The amount of transfered grants. |

### _spendAllowance

```solidity
function _spendAllowance(address owner, address spender, uint256 vestingSchedID_, uint256 amount) internal virtual
```

### _transfer

```solidity
function _transfer(address from, address beneficiary, uint256 vestingSchedID_, uint256 amount) internal virtual returns (bool)
```

### allVestingScheds

```solidity
function allVestingScheds() external view returns (struct TokenVesting.VestingSched[])
```

Return all vesting schedules.

### vestingSched

```solidity
function vestingSched(uint256 vestingSchedID_) external view returns (struct TokenVesting.VestingSched)
```

Return a single vesting schedules.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vestingSchedID_ | uint256 | a single vesting schedule by ID |

### allSoloVestings

```solidity
function allSoloVestings(address beneficiary) external view returns (struct TokenVesting.SoloVesting[])
```

Return all vesting schedules for a single user.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| beneficiary | address | User's address |

### soloVesting

```solidity
function soloVesting(uint256 vestingSchedID_, address beneficiary) external view returns (struct TokenVesting.SoloVesting)
```

Return beneficiary's vesting for a certain vesting schedule.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| vestingSchedID_ | uint256 | The ID of the vesting schedule. |
| beneficiary | address | The beneficiary's account |

## XToken

### _cap

```solidity
uint256 _cap
```

### constructor

```solidity
constructor(string name, string symbol, uint256 cap_) public
```

### cap

```solidity
function cap() public view returns (uint256)
```

### setCap

```solidity
function setCap(uint256 cap_) external returns (uint256)
```

### mint

```solidity
function mint(address account, uint256 amount) public
```

### burn

```solidity
function burn(uint256 amount) public
```

_Destroys `amount` tokens from the caller.

See {ERC20-_burn}._

### burnFrom

```solidity
function burnFrom(address account, uint256 amount) public
```

_Destroys `amount` tokens from `account`, deducting from the caller's
allowance.

See {ERC20-_burn} and {ERC20-allowance}.

Requirements:

- the caller must have allowance for ``accounts``'s tokens of at least
`amount`._

### pause

```solidity
function pause() external
```

### unpause

```solidity
function unpause() external
```

### freeze

```solidity
function freeze(address account) external
```

### defrost

```solidity
function defrost(address account) external
```

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address from, address to, uint256 amount) internal
```

_Hook that is called before any transfer of tokens. This includes
minting and burning.

Calling conditions:

- when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
will be transferred to `to`.
- when `from` is zero, `amount` tokens will be minted for `to`.
- when `to` is zero, `amount` of ``from``'s tokens will be burned.
- `from` and `to` are never both zero.

To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks]._

