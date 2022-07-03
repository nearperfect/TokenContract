# Solidity API

## AccessControl

_Contract module that allows children to implement role-based access
control mechanisms. This is a lightweight version that doesn&#x27;t allow enumerating role
members except through off-chain means by accessing the contract event logs. Some
applications may benefit from on-chain enumerability, for those cases see
{AccessControlEnumerable}.

Roles are referred to by their &#x60;bytes32&#x60; identifier. These should be exposed
in the external API and be unique. The best way to achieve this is by
using &#x60;public constant&#x60; hash digests:

&#x60;&#x60;&#x60;
bytes32 public constant MY_ROLE &#x3D; keccak256(&quot;MY_ROLE&quot;);
&#x60;&#x60;&#x60;

Roles can be used to represent a set of permissions. To restrict access to a
function call, use {hasRole}:

&#x60;&#x60;&#x60;
function foo() public {
    require(hasRole(MY_ROLE, msg.sender));
    ...
}
&#x60;&#x60;&#x60;

Roles can be granted and revoked dynamically via the {grantRole} and
{revokeRole} functions. Each role has an associated admin role, and only
accounts that have a role&#x27;s admin role can call {grantRole} and {revokeRole}.

By default, the admin role for all roles is &#x60;DEFAULT_ADMIN_ROLE&#x60;, which means
that only accounts with this role will be able to grant or revoke other
roles. More complex role relationships can be created by using
{_setRoleAdmin}.

WARNING: The &#x60;DEFAULT_ADMIN_ROLE&#x60; is also its own admin: it has permission to
grant and revoke this role. Extra precautions should be taken to secure
accounts that have been granted it._

### RoleData

```solidity
struct RoleData {
  mapping(address => bool) members;
  bytes32 adminRole;
}
```

### _roles

```solidity
mapping(bytes32 => struct AccessControl.RoleData) _roles
```

### DEFAULT_ADMIN_ROLE

```solidity
bytes32 DEFAULT_ADMIN_ROLE
```

### onlyRole

```solidity
modifier onlyRole(bytes32 role)
```

_Modifier that checks that an account has a specific role. Reverts
with a standardized message including the required role.

The format of the revert reason is given by the following regular expression:

 /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/

_Available since v4.1.__

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

_See {IERC165-supportsInterface}._

### hasRole

```solidity
function hasRole(bytes32 role, address account) public view virtual returns (bool)
```

_Returns &#x60;true&#x60; if &#x60;account&#x60; has been granted &#x60;role&#x60;._

### _checkRole

```solidity
function _checkRole(bytes32 role, address account) internal view virtual
```

_Revert with a standard message if &#x60;account&#x60; is missing &#x60;role&#x60;.

The format of the revert reason is given by the following regular expression:

 /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/_

### getRoleAdmin

```solidity
function getRoleAdmin(bytes32 role) public view virtual returns (bytes32)
```

_Returns the admin role that controls &#x60;role&#x60;. See {grantRole} and
{revokeRole}.

To change a role&#x27;s admin, use {_setRoleAdmin}._

### grantRole

```solidity
function grantRole(bytes32 role, address account) public virtual
```

_Grants &#x60;role&#x60; to &#x60;account&#x60;.

If &#x60;account&#x60; had not been already granted &#x60;role&#x60;, emits a {RoleGranted}
event.

Requirements:

- the caller must have &#x60;&#x60;role&#x60;&#x60;&#x27;s admin role._

### revokeRole

```solidity
function revokeRole(bytes32 role, address account) public virtual
```

_Revokes &#x60;role&#x60; from &#x60;account&#x60;.

If &#x60;account&#x60; had been granted &#x60;role&#x60;, emits a {RoleRevoked} event.

Requirements:

- the caller must have &#x60;&#x60;role&#x60;&#x60;&#x27;s admin role._

### renounceRole

```solidity
function renounceRole(bytes32 role, address account) public virtual
```

_Revokes &#x60;role&#x60; from the calling account.

Roles are often managed via {grantRole} and {revokeRole}: this function&#x27;s
purpose is to provide a mechanism for accounts to lose their privileges
if they are compromised (such as when a trusted device is misplaced).

If the calling account had been revoked &#x60;role&#x60;, emits a {RoleRevoked}
event.

Requirements:

- the caller must be &#x60;account&#x60;._

### _setupRole

```solidity
function _setupRole(bytes32 role, address account) internal virtual
```

_Grants &#x60;role&#x60; to &#x60;account&#x60;.

If &#x60;account&#x60; had not been already granted &#x60;role&#x60;, emits a {RoleGranted}
event. Note that unlike {grantRole}, this function doesn&#x27;t perform any
checks on the calling account.

[WARNING]
&#x3D;&#x3D;&#x3D;&#x3D;
This function should only be called from the constructor when setting
up the initial roles for the system.

Using this function in any other way is effectively circumventing the admin
system imposed by {AccessControl}.
&#x3D;&#x3D;&#x3D;&#x3D;

NOTE: This function is deprecated in favor of {_grantRole}._

### _setRoleAdmin

```solidity
function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual
```

_Sets &#x60;adminRole&#x60; as &#x60;&#x60;role&#x60;&#x60;&#x27;s admin role.

Emits a {RoleAdminChanged} event._

### _grantRole

```solidity
function _grantRole(bytes32 role, address account) internal virtual
```

_Grants &#x60;role&#x60; to &#x60;account&#x60;.

Internal function without access restriction._

### _revokeRole

```solidity
function _revokeRole(bytes32 role, address account) internal virtual
```

_Revokes &#x60;role&#x60; from &#x60;account&#x60;.

Internal function without access restriction._

## AccessControlEnumerable

_Extension of {AccessControl} that allows enumerating the members of each role._

### _roleMembers

```solidity
mapping(bytes32 => struct EnumerableSet.AddressSet) _roleMembers
```

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

_See {IERC165-supportsInterface}._

### getRoleMember

```solidity
function getRoleMember(bytes32 role, uint256 index) public view virtual returns (address)
```

_Returns one of the accounts that have &#x60;role&#x60;. &#x60;index&#x60; must be a
value between 0 and {getRoleMemberCount}, non-inclusive.

Role bearers are not sorted in any particular way, and their ordering may
change at any point.

WARNING: When using {getRoleMember} and {getRoleMemberCount}, make sure
you perform all queries on the same block. See the following
https://forum.openzeppelin.com/t/iterating-over-elements-on-enumerableset-in-openzeppelin-contracts/2296[forum post]
for more information._

### getRoleMemberCount

```solidity
function getRoleMemberCount(bytes32 role) public view virtual returns (uint256)
```

_Returns the number of accounts that have &#x60;role&#x60;. Can be used
together with {getRoleMember} to enumerate all bearers of a role._

### _grantRole

```solidity
function _grantRole(bytes32 role, address account) internal virtual
```

_Overload {_grantRole} to track enumerable memberships_

### _revokeRole

```solidity
function _revokeRole(bytes32 role, address account) internal virtual
```

_Overload {_revokeRole} to track enumerable memberships_

## IAccessControl

_External interface of AccessControl declared to support ERC165 detection._

### RoleAdminChanged

```solidity
event RoleAdminChanged(bytes32 role, bytes32 previousAdminRole, bytes32 newAdminRole)
```

_Emitted when &#x60;newAdminRole&#x60; is set as &#x60;&#x60;role&#x60;&#x60;&#x27;s admin role, replacing &#x60;previousAdminRole&#x60;

&#x60;DEFAULT_ADMIN_ROLE&#x60; is the starting admin for all roles, despite
{RoleAdminChanged} not being emitted signaling this.

_Available since v3.1.__

### RoleGranted

```solidity
event RoleGranted(bytes32 role, address account, address sender)
```

_Emitted when &#x60;account&#x60; is granted &#x60;role&#x60;.

&#x60;sender&#x60; is the account that originated the contract call, an admin role
bearer except when using {AccessControl-_setupRole}._

### RoleRevoked

```solidity
event RoleRevoked(bytes32 role, address account, address sender)
```

_Emitted when &#x60;account&#x60; is revoked &#x60;role&#x60;.

&#x60;sender&#x60; is the account that originated the contract call:
  - if using &#x60;revokeRole&#x60;, it is the admin role bearer
  - if using &#x60;renounceRole&#x60;, it is the role bearer (i.e. &#x60;account&#x60;)_

### hasRole

```solidity
function hasRole(bytes32 role, address account) external view returns (bool)
```

_Returns &#x60;true&#x60; if &#x60;account&#x60; has been granted &#x60;role&#x60;._

### getRoleAdmin

```solidity
function getRoleAdmin(bytes32 role) external view returns (bytes32)
```

_Returns the admin role that controls &#x60;role&#x60;. See {grantRole} and
{revokeRole}.

To change a role&#x27;s admin, use {AccessControl-_setRoleAdmin}._

### grantRole

```solidity
function grantRole(bytes32 role, address account) external
```

_Grants &#x60;role&#x60; to &#x60;account&#x60;.

If &#x60;account&#x60; had not been already granted &#x60;role&#x60;, emits a {RoleGranted}
event.

Requirements:

- the caller must have &#x60;&#x60;role&#x60;&#x60;&#x27;s admin role._

### revokeRole

```solidity
function revokeRole(bytes32 role, address account) external
```

_Revokes &#x60;role&#x60; from &#x60;account&#x60;.

If &#x60;account&#x60; had been granted &#x60;role&#x60;, emits a {RoleRevoked} event.

Requirements:

- the caller must have &#x60;&#x60;role&#x60;&#x60;&#x27;s admin role._

### renounceRole

```solidity
function renounceRole(bytes32 role, address account) external
```

_Revokes &#x60;role&#x60; from the calling account.

Roles are often managed via {grantRole} and {revokeRole}: this function&#x27;s
purpose is to provide a mechanism for accounts to lose their privileges
if they are compromised (such as when a trusted device is misplaced).

If the calling account had been granted &#x60;role&#x60;, emits a {RoleRevoked}
event.

Requirements:

- the caller must be &#x60;account&#x60;._

## IAccessControlEnumerable

_External interface of AccessControlEnumerable declared to support ERC165 detection._

### getRoleMember

```solidity
function getRoleMember(bytes32 role, uint256 index) external view returns (address)
```

_Returns one of the accounts that have &#x60;role&#x60;. &#x60;index&#x60; must be a
value between 0 and {getRoleMemberCount}, non-inclusive.

Role bearers are not sorted in any particular way, and their ordering may
change at any point.

WARNING: When using {getRoleMember} and {getRoleMemberCount}, make sure
you perform all queries on the same block. See the following
https://forum.openzeppelin.com/t/iterating-over-elements-on-enumerableset-in-openzeppelin-contracts/2296[forum post]
for more information._

### getRoleMemberCount

```solidity
function getRoleMemberCount(bytes32 role) external view returns (uint256)
```

_Returns the number of accounts that have &#x60;role&#x60;. Can be used
together with {getRoleMember} to enumerate all bearers of a role._

## Pausable

_Contract module which allows children to implement an emergency stop
mechanism that can be triggered by an authorized account.

This module is used through inheritance. It will make available the
modifiers &#x60;whenNotPaused&#x60; and &#x60;whenPaused&#x60;, which can be applied to
the functions of your contract. Note that they will not be pausable by
simply including this module, only once the modifiers are put in place._

### Paused

```solidity
event Paused(address account)
```

_Emitted when the pause is triggered by &#x60;account&#x60;._

### Unpaused

```solidity
event Unpaused(address account)
```

_Emitted when the pause is lifted by &#x60;account&#x60;._

### _paused

```solidity
bool _paused
```

### constructor

```solidity
constructor() internal
```

_Initializes the contract in unpaused state._

### paused

```solidity
function paused() public view virtual returns (bool)
```

_Returns true if the contract is paused, and false otherwise._

### whenNotPaused

```solidity
modifier whenNotPaused()
```

_Modifier to make a function callable only when the contract is not paused.

Requirements:

- The contract must not be paused._

### whenPaused

```solidity
modifier whenPaused()
```

_Modifier to make a function callable only when the contract is paused.

Requirements:

- The contract must be paused._

### _pause

```solidity
function _pause() internal virtual
```

_Triggers stopped state.

Requirements:

- The contract must not be paused._

### _unpause

```solidity
function _unpause() internal virtual
```

_Returns to normal state.

Requirements:

- The contract must be paused._

## ERC20

_Implementation of the {IERC20} interface.

This implementation is agnostic to the way tokens are created. This means
that a supply mechanism has to be added in a derived contract using {_mint}.
For a generic mechanism see {ERC20PresetMinterPauser}.

TIP: For a detailed writeup see our guide
https://forum.zeppelin.solutions/t/how-to-implement-erc20-supply-mechanisms/226[How
to implement supply mechanisms].

We have followed general OpenZeppelin Contracts guidelines: functions revert
instead returning &#x60;false&#x60; on failure. This behavior is nonetheless
conventional and does not conflict with the expectations of ERC20
applications.

Additionally, an {Approval} event is emitted on calls to {transferFrom}.
This allows applications to reconstruct the allowance for all accounts just
by listening to said events. Other implementations of the EIP may not emit
these events, as it isn&#x27;t required by the specification.

Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
functions have been added to mitigate the well-known issues around setting
allowances. See {IERC20-approve}._

### _balances

```solidity
mapping(address => uint256) _balances
```

### _allowances

```solidity
mapping(address => mapping(address => uint256)) _allowances
```

### _totalSupply

```solidity
uint256 _totalSupply
```

### _name

```solidity
string _name
```

### _symbol

```solidity
string _symbol
```

### constructor

```solidity
constructor(string name_, string symbol_) public
```

_Sets the values for {name} and {symbol}.

The default value of {decimals} is 18. To select a different value for
{decimals} you should overload it.

All two of these values are immutable: they can only be set once during
construction._

### name

```solidity
function name() public view virtual returns (string)
```

_Returns the name of the token._

### symbol

```solidity
function symbol() public view virtual returns (string)
```

_Returns the symbol of the token, usually a shorter version of the
name._

### decimals

```solidity
function decimals() public view virtual returns (uint8)
```

_Returns the number of decimals used to get its user representation.
For example, if &#x60;decimals&#x60; equals &#x60;2&#x60;, a balance of &#x60;505&#x60; tokens should
be displayed to a user as &#x60;5.05&#x60; (&#x60;505 / 10 ** 2&#x60;).

Tokens usually opt for a value of 18, imitating the relationship between
Ether and Wei. This is the value {ERC20} uses, unless this function is
overridden;

NOTE: This information is only used for _display_ purposes: it in
no way affects any of the arithmetic of the contract, including
{IERC20-balanceOf} and {IERC20-transfer}._

### totalSupply

```solidity
function totalSupply() public view virtual returns (uint256)
```

_See {IERC20-totalSupply}._

### balanceOf

```solidity
function balanceOf(address account) public view virtual returns (uint256)
```

_See {IERC20-balanceOf}._

### transfer

```solidity
function transfer(address to, uint256 amount) public virtual returns (bool)
```

_See {IERC20-transfer}.

Requirements:

- &#x60;to&#x60; cannot be the zero address.
- the caller must have a balance of at least &#x60;amount&#x60;._

### allowance

```solidity
function allowance(address owner, address spender) public view virtual returns (uint256)
```

_See {IERC20-allowance}._

### approve

```solidity
function approve(address spender, uint256 amount) public virtual returns (bool)
```

_See {IERC20-approve}.

NOTE: If &#x60;amount&#x60; is the maximum &#x60;uint256&#x60;, the allowance is not updated on
&#x60;transferFrom&#x60;. This is semantically equivalent to an infinite approval.

Requirements:

- &#x60;spender&#x60; cannot be the zero address._

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 amount) public virtual returns (bool)
```

_See {IERC20-transferFrom}.

Emits an {Approval} event indicating the updated allowance. This is not
required by the EIP. See the note at the beginning of {ERC20}.

NOTE: Does not update the allowance if the current allowance
is the maximum &#x60;uint256&#x60;.

Requirements:

- &#x60;from&#x60; and &#x60;to&#x60; cannot be the zero address.
- &#x60;from&#x60; must have a balance of at least &#x60;amount&#x60;.
- the caller must have allowance for &#x60;&#x60;from&#x60;&#x60;&#x27;s tokens of at least
&#x60;amount&#x60;._

### increaseAllowance

```solidity
function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool)
```

_Atomically increases the allowance granted to &#x60;spender&#x60; by the caller.

This is an alternative to {approve} that can be used as a mitigation for
problems described in {IERC20-approve}.

Emits an {Approval} event indicating the updated allowance.

Requirements:

- &#x60;spender&#x60; cannot be the zero address._

### decreaseAllowance

```solidity
function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool)
```

_Atomically decreases the allowance granted to &#x60;spender&#x60; by the caller.

This is an alternative to {approve} that can be used as a mitigation for
problems described in {IERC20-approve}.

Emits an {Approval} event indicating the updated allowance.

Requirements:

- &#x60;spender&#x60; cannot be the zero address.
- &#x60;spender&#x60; must have allowance for the caller of at least
&#x60;subtractedValue&#x60;._

### _transfer

```solidity
function _transfer(address from, address to, uint256 amount) internal virtual
```

_Moves &#x60;amount&#x60; of tokens from &#x60;sender&#x60; to &#x60;recipient&#x60;.

This internal function is equivalent to {transfer}, and can be used to
e.g. implement automatic token fees, slashing mechanisms, etc.

Emits a {Transfer} event.

Requirements:

- &#x60;from&#x60; cannot be the zero address.
- &#x60;to&#x60; cannot be the zero address.
- &#x60;from&#x60; must have a balance of at least &#x60;amount&#x60;._

### _mint

```solidity
function _mint(address account, uint256 amount) internal virtual
```

_Creates &#x60;amount&#x60; tokens and assigns them to &#x60;account&#x60;, increasing
the total supply.

Emits a {Transfer} event with &#x60;from&#x60; set to the zero address.

Requirements:

- &#x60;account&#x60; cannot be the zero address._

### _burn

```solidity
function _burn(address account, uint256 amount) internal virtual
```

_Destroys &#x60;amount&#x60; tokens from &#x60;account&#x60;, reducing the
total supply.

Emits a {Transfer} event with &#x60;to&#x60; set to the zero address.

Requirements:

- &#x60;account&#x60; cannot be the zero address.
- &#x60;account&#x60; must have at least &#x60;amount&#x60; tokens._

### _approve

```solidity
function _approve(address owner, address spender, uint256 amount) internal virtual
```

_Sets &#x60;amount&#x60; as the allowance of &#x60;spender&#x60; over the &#x60;owner&#x60; s tokens.

This internal function is equivalent to &#x60;approve&#x60;, and can be used to
e.g. set automatic allowances for certain subsystems, etc.

Emits an {Approval} event.

Requirements:

- &#x60;owner&#x60; cannot be the zero address.
- &#x60;spender&#x60; cannot be the zero address._

### _spendAllowance

```solidity
function _spendAllowance(address owner, address spender, uint256 amount) internal virtual
```

_Spend &#x60;amount&#x60; form the allowance of &#x60;owner&#x60; toward &#x60;spender&#x60;.

Does not update the allowance amount in case of infinite allowance.
Revert if not enough allowance is available.

Might emit an {Approval} event._

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual
```

_Hook that is called before any transfer of tokens. This includes
minting and burning.

Calling conditions:

- when &#x60;from&#x60; and &#x60;to&#x60; are both non-zero, &#x60;amount&#x60; of &#x60;&#x60;from&#x60;&#x60;&#x27;s tokens
will be transferred to &#x60;to&#x60;.
- when &#x60;from&#x60; is zero, &#x60;amount&#x60; tokens will be minted for &#x60;to&#x60;.
- when &#x60;to&#x60; is zero, &#x60;amount&#x60; of &#x60;&#x60;from&#x60;&#x60;&#x27;s tokens will be burned.
- &#x60;from&#x60; and &#x60;to&#x60; are never both zero.

To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks]._

### _afterTokenTransfer

```solidity
function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual
```

_Hook that is called after any transfer of tokens. This includes
minting and burning.

Calling conditions:

- when &#x60;from&#x60; and &#x60;to&#x60; are both non-zero, &#x60;amount&#x60; of &#x60;&#x60;from&#x60;&#x60;&#x27;s tokens
has been transferred to &#x60;to&#x60;.
- when &#x60;from&#x60; is zero, &#x60;amount&#x60; tokens have been minted for &#x60;to&#x60;.
- when &#x60;to&#x60; is zero, &#x60;amount&#x60; of &#x60;&#x60;from&#x60;&#x60;&#x27;s tokens have been burned.
- &#x60;from&#x60; and &#x60;to&#x60; are never both zero.

To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks]._

## IERC20

_Interface of the ERC20 standard as defined in the EIP._

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```

_Returns the amount of tokens in existence._

### balanceOf

```solidity
function balanceOf(address account) external view returns (uint256)
```

_Returns the amount of tokens owned by &#x60;account&#x60;._

### transfer

```solidity
function transfer(address to, uint256 amount) external returns (bool)
```

_Moves &#x60;amount&#x60; tokens from the caller&#x27;s account to &#x60;to&#x60;.

Returns a boolean value indicating whether the operation succeeded.

Emits a {Transfer} event._

### allowance

```solidity
function allowance(address owner, address spender) external view returns (uint256)
```

_Returns the remaining number of tokens that &#x60;spender&#x60; will be
allowed to spend on behalf of &#x60;owner&#x60; through {transferFrom}. This is
zero by default.

This value changes when {approve} or {transferFrom} are called._

### approve

```solidity
function approve(address spender, uint256 amount) external returns (bool)
```

_Sets &#x60;amount&#x60; as the allowance of &#x60;spender&#x60; over the caller&#x27;s tokens.

Returns a boolean value indicating whether the operation succeeded.

IMPORTANT: Beware that changing an allowance with this method brings the risk
that someone may use both the old and the new allowance by unfortunate
transaction ordering. One possible solution to mitigate this race
condition is to first reduce the spender&#x27;s allowance to 0 and set the
desired value afterwards:
https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729

Emits an {Approval} event._

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 amount) external returns (bool)
```

_Moves &#x60;amount&#x60; tokens from &#x60;from&#x60; to &#x60;to&#x60; using the
allowance mechanism. &#x60;amount&#x60; is then deducted from the caller&#x27;s
allowance.

Returns a boolean value indicating whether the operation succeeded.

Emits a {Transfer} event._

### Transfer

```solidity
event Transfer(address from, address to, uint256 value)
```

_Emitted when &#x60;value&#x60; tokens are moved from one account (&#x60;from&#x60;) to
another (&#x60;to&#x60;).

Note that &#x60;value&#x60; may be zero._

### Approval

```solidity
event Approval(address owner, address spender, uint256 value)
```

_Emitted when the allowance of a &#x60;spender&#x60; for an &#x60;owner&#x60; is set by
a call to {approve}. &#x60;value&#x60; is the new allowance._

## ERC20Burnable

_Extension of {ERC20} that allows token holders to destroy both their own
tokens and those that they have an allowance for, in a way that can be
recognized off-chain (via event analysis)._

### burn

```solidity
function burn(uint256 amount) public virtual
```

_Destroys &#x60;amount&#x60; tokens from the caller.

See {ERC20-_burn}._

### burnFrom

```solidity
function burnFrom(address account, uint256 amount) public virtual
```

_Destroys &#x60;amount&#x60; tokens from &#x60;account&#x60;, deducting from the caller&#x27;s
allowance.

See {ERC20-_burn} and {ERC20-allowance}.

Requirements:

- the caller must have allowance for &#x60;&#x60;accounts&#x60;&#x60;&#x27;s tokens of at least
&#x60;amount&#x60;._

## IERC20Metadata

_Interface for the optional metadata functions from the ERC20 standard.

_Available since v4.1.__

### name

```solidity
function name() external view returns (string)
```

_Returns the name of the token._

### symbol

```solidity
function symbol() external view returns (string)
```

_Returns the symbol of the token._

### decimals

```solidity
function decimals() external view returns (uint8)
```

_Returns the decimals places of the token._

## ERC20Permit

_Implementation of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].

Adds the {permit} method, which can be used to change an account&#x27;s ERC20 allowance (see {IERC20-allowance}) by
presenting a message signed by the account. By not relying on &#x60;{IERC20-approve}&#x60;, the token holder account doesn&#x27;t
need to send a transaction, and thus is not required to hold Ether at all.

_Available since v3.4.__

### _nonces

```solidity
mapping(address => struct Counters.Counter) _nonces
```

### _PERMIT_TYPEHASH

```solidity
bytes32 _PERMIT_TYPEHASH
```

### constructor

```solidity
constructor(string name) internal
```

_Initializes the {EIP712} domain separator using the &#x60;name&#x60; parameter, and setting &#x60;version&#x60; to &#x60;&quot;1&quot;&#x60;.

It&#x27;s a good idea to use the same &#x60;name&#x60; that is defined as the ERC20 token name._

### permit

```solidity
function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public virtual
```

_See {IERC20Permit-permit}._

### nonces

```solidity
function nonces(address owner) public view virtual returns (uint256)
```

_See {IERC20Permit-nonces}._

### DOMAIN_SEPARATOR

```solidity
function DOMAIN_SEPARATOR() external view returns (bytes32)
```

_See {IERC20Permit-DOMAIN_SEPARATOR}._

### _useNonce

```solidity
function _useNonce(address owner) internal virtual returns (uint256 current)
```

_&quot;Consume a nonce&quot;: return the current value and increment.

_Available since v4.1.__

## IERC20Permit

_Interface of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].

Adds the {permit} method, which can be used to change an account&#x27;s ERC20 allowance (see {IERC20-allowance}) by
presenting a message signed by the account. By not relying on {IERC20-approve}, the token holder account doesn&#x27;t
need to send a transaction, and thus is not required to hold Ether at all._

### permit

```solidity
function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external
```

_Sets &#x60;value&#x60; as the allowance of &#x60;spender&#x60; over &#x60;&#x60;owner&#x60;&#x60;&#x27;s tokens,
given &#x60;&#x60;owner&#x60;&#x60;&#x27;s signed approval.

IMPORTANT: The same issues {IERC20-approve} has related to transaction
ordering also apply here.

Emits an {Approval} event.

Requirements:

- &#x60;spender&#x60; cannot be the zero address.
- &#x60;deadline&#x60; must be a timestamp in the future.
- &#x60;v&#x60;, &#x60;r&#x60; and &#x60;s&#x60; must be a valid &#x60;secp256k1&#x60; signature from &#x60;owner&#x60;
over the EIP712-formatted function arguments.
- the signature must use &#x60;&#x60;owner&#x60;&#x60;&#x27;s current nonce (see {nonces}).

For more information on the signature format, see the
https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP
section]._

### nonces

```solidity
function nonces(address owner) external view returns (uint256)
```

_Returns the current nonce for &#x60;owner&#x60;. This value must be
included whenever a signature is generated for {permit}.

Every successful call to {permit} increases &#x60;&#x60;owner&#x60;&#x60;&#x27;s nonce by one. This
prevents a signature from being used multiple times._

### DOMAIN_SEPARATOR

```solidity
function DOMAIN_SEPARATOR() external view returns (bytes32)
```

_Returns the domain separator used in the encoding of the signature for {permit}, as defined by {EIP712}._

## Context

_Provides information about the current execution context, including the
sender of the transaction and its data. While these are generally available
via msg.sender and msg.data, they should not be accessed in such a direct
manner, since when dealing with meta-transactions the account sending and
paying for execution may not be the actual sender (as far as an application
is concerned).

This contract is only required for intermediate, library-like contracts._

### _msgSender

```solidity
function _msgSender() internal view virtual returns (address)
```

### _msgData

```solidity
function _msgData() internal view virtual returns (bytes)
```

## Counters

_Provides counters that can only be incremented, decremented or reset. This can be used e.g. to track the number
of elements in a mapping, issuing ERC721 ids, or counting request ids.

Include with &#x60;using Counters for Counters.Counter;&#x60;_

### Counter

```solidity
struct Counter {
  uint256 _value;
}
```

### current

```solidity
function current(struct Counters.Counter counter) internal view returns (uint256)
```

### increment

```solidity
function increment(struct Counters.Counter counter) internal
```

### decrement

```solidity
function decrement(struct Counters.Counter counter) internal
```

### reset

```solidity
function reset(struct Counters.Counter counter) internal
```

## Strings

_String operations._

### _HEX_SYMBOLS

```solidity
bytes16 _HEX_SYMBOLS
```

### toString

```solidity
function toString(uint256 value) internal pure returns (string)
```

_Converts a &#x60;uint256&#x60; to its ASCII &#x60;string&#x60; decimal representation._

### toHexString

```solidity
function toHexString(uint256 value) internal pure returns (string)
```

_Converts a &#x60;uint256&#x60; to its ASCII &#x60;string&#x60; hexadecimal representation._

### toHexString

```solidity
function toHexString(uint256 value, uint256 length) internal pure returns (string)
```

_Converts a &#x60;uint256&#x60; to its ASCII &#x60;string&#x60; hexadecimal representation with fixed length._

## ECDSA

_Elliptic Curve Digital Signature Algorithm (ECDSA) operations.

These functions can be used to verify that a message was signed by the holder
of the private keys of a given address._

### RecoverError

```solidity
enum RecoverError {
  NoError,
  InvalidSignature,
  InvalidSignatureLength,
  InvalidSignatureS,
  InvalidSignatureV
}
```

### _throwError

```solidity
function _throwError(enum ECDSA.RecoverError error) private pure
```

### tryRecover

```solidity
function tryRecover(bytes32 hash, bytes signature) internal pure returns (address, enum ECDSA.RecoverError)
```

_Returns the address that signed a hashed message (&#x60;hash&#x60;) with
&#x60;signature&#x60; or error string. This address can then be used for verification purposes.

The &#x60;ecrecover&#x60; EVM opcode allows for malleable (non-unique) signatures:
this function rejects them by requiring the &#x60;s&#x60; value to be in the lower
half order, and the &#x60;v&#x60; value to be either 27 or 28.

IMPORTANT: &#x60;hash&#x60; _must_ be the result of a hash operation for the
verification to be secure: it is possible to craft signatures that
recover to arbitrary addresses for non-hashed data. A safe way to ensure
this is by receiving a hash of the original message (which may otherwise
be too long), and then calling {toEthSignedMessageHash} on it.

Documentation for signature generation:
- with https://web3js.readthedocs.io/en/v1.3.4/web3-eth-accounts.html#sign[Web3.js]
- with https://docs.ethers.io/v5/api/signer/#Signer-signMessage[ethers]

_Available since v4.3.__

### recover

```solidity
function recover(bytes32 hash, bytes signature) internal pure returns (address)
```

_Returns the address that signed a hashed message (&#x60;hash&#x60;) with
&#x60;signature&#x60;. This address can then be used for verification purposes.

The &#x60;ecrecover&#x60; EVM opcode allows for malleable (non-unique) signatures:
this function rejects them by requiring the &#x60;s&#x60; value to be in the lower
half order, and the &#x60;v&#x60; value to be either 27 or 28.

IMPORTANT: &#x60;hash&#x60; _must_ be the result of a hash operation for the
verification to be secure: it is possible to craft signatures that
recover to arbitrary addresses for non-hashed data. A safe way to ensure
this is by receiving a hash of the original message (which may otherwise
be too long), and then calling {toEthSignedMessageHash} on it._

### tryRecover

```solidity
function tryRecover(bytes32 hash, bytes32 r, bytes32 vs) internal pure returns (address, enum ECDSA.RecoverError)
```

_Overload of {ECDSA-tryRecover} that receives the &#x60;r&#x60; and &#x60;vs&#x60; short-signature fields separately.

See https://eips.ethereum.org/EIPS/eip-2098[EIP-2098 short signatures]

_Available since v4.3.__

### recover

```solidity
function recover(bytes32 hash, bytes32 r, bytes32 vs) internal pure returns (address)
```

_Overload of {ECDSA-recover} that receives the &#x60;r and &#x60;vs&#x60; short-signature fields separately.

_Available since v4.2.__

### tryRecover

```solidity
function tryRecover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) internal pure returns (address, enum ECDSA.RecoverError)
```

_Overload of {ECDSA-tryRecover} that receives the &#x60;v&#x60;,
&#x60;r&#x60; and &#x60;s&#x60; signature fields separately.

_Available since v4.3.__

### recover

```solidity
function recover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) internal pure returns (address)
```

_Overload of {ECDSA-recover} that receives the &#x60;v&#x60;,
&#x60;r&#x60; and &#x60;s&#x60; signature fields separately.
/_

### toEthSignedMessageHash

```solidity
function toEthSignedMessageHash(bytes32 hash) internal pure returns (bytes32)
```

_Returns an Ethereum Signed Message, created from a &#x60;hash&#x60;. This
produces hash corresponding to the one signed with the
https://eth.wiki/json-rpc/API#eth_sign[&#x60;eth_sign&#x60;]
JSON-RPC method as part of EIP-191.

See {recover}.
/_

### toEthSignedMessageHash

```solidity
function toEthSignedMessageHash(bytes s) internal pure returns (bytes32)
```

_Returns an Ethereum Signed Message, created from &#x60;s&#x60;. This
produces hash corresponding to the one signed with the
https://eth.wiki/json-rpc/API#eth_sign[&#x60;eth_sign&#x60;]
JSON-RPC method as part of EIP-191.

See {recover}.
/_

### toTypedDataHash

```solidity
function toTypedDataHash(bytes32 domainSeparator, bytes32 structHash) internal pure returns (bytes32)
```

_Returns an Ethereum Signed Typed Data, created from a
&#x60;domainSeparator&#x60; and a &#x60;structHash&#x60;. This produces hash corresponding
to the one signed with the
https://eips.ethereum.org/EIPS/eip-712[&#x60;eth_signTypedData&#x60;]
JSON-RPC method as part of EIP-712.

See {recover}.
/_

## EIP712

_https://eips.ethereum.org/EIPS/eip-712[EIP 712] is a standard for hashing and signing of typed structured data.

The encoding specified in the EIP is very generic, and such a generic implementation in Solidity is not feasible,
thus this contract does not implement the encoding itself. Protocols need to implement the type-specific encoding
they need in their contracts using a combination of &#x60;abi.encode&#x60; and &#x60;keccak256&#x60;.

This contract implements the EIP 712 domain separator ({_domainSeparatorV4}) that is used as part of the encoding
scheme, and the final step of the encoding to obtain the message digest that is then signed via ECDSA
({_hashTypedDataV4}).

The implementation of the domain separator was designed to be as efficient as possible while still properly updating
the chain id to protect against replay attacks on an eventual fork of the chain.

NOTE: This contract implements the version of the encoding known as &quot;v4&quot;, as implemented by the JSON RPC method
https://docs.metamask.io/guide/signing-data.html[&#x60;eth_signTypedDataV4&#x60; in MetaMask].

_Available since v3.4.__

### _CACHED_DOMAIN_SEPARATOR

```solidity
bytes32 _CACHED_DOMAIN_SEPARATOR
```

### _CACHED_CHAIN_ID

```solidity
uint256 _CACHED_CHAIN_ID
```

### _CACHED_THIS

```solidity
address _CACHED_THIS
```

### _HASHED_NAME

```solidity
bytes32 _HASHED_NAME
```

### _HASHED_VERSION

```solidity
bytes32 _HASHED_VERSION
```

### _TYPE_HASH

```solidity
bytes32 _TYPE_HASH
```

### constructor

```solidity
constructor(string name, string version) internal
```

_Initializes the domain separator and parameter caches.

The meaning of &#x60;name&#x60; and &#x60;version&#x60; is specified in
https://eips.ethereum.org/EIPS/eip-712#definition-of-domainseparator[EIP 712]:

- &#x60;name&#x60;: the user readable name of the signing domain, i.e. the name of the DApp or the protocol.
- &#x60;version&#x60;: the current major version of the signing domain.

NOTE: These parameters cannot be changed except through a xref:learn::upgrading-smart-contracts.adoc[smart
contract upgrade]._

### _domainSeparatorV4

```solidity
function _domainSeparatorV4() internal view returns (bytes32)
```

_Returns the domain separator for the current chain._

### _buildDomainSeparator

```solidity
function _buildDomainSeparator(bytes32 typeHash, bytes32 nameHash, bytes32 versionHash) private view returns (bytes32)
```

### _hashTypedDataV4

```solidity
function _hashTypedDataV4(bytes32 structHash) internal view virtual returns (bytes32)
```

_Given an already https://eips.ethereum.org/EIPS/eip-712#definition-of-hashstruct[hashed struct], this
function returns the hash of the fully encoded EIP712 message for this domain.

This hash can be used together with {ECDSA-recover} to obtain the signer of a message. For example:

&#x60;&#x60;&#x60;solidity
bytes32 digest &#x3D; _hashTypedDataV4(keccak256(abi.encode(
    keccak256(&quot;Mail(address to,string contents)&quot;),
    mailTo,
    keccak256(bytes(mailContents))
)));
address signer &#x3D; ECDSA.recover(digest, signature);
&#x60;&#x60;&#x60;_

## ERC165

_Implementation of the {IERC165} interface.

Contracts that want to implement ERC165 should inherit from this contract and override {supportsInterface} to check
for the additional interface id that will be supported. For example:

&#x60;&#x60;&#x60;solidity
function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId &#x3D;&#x3D; type(MyInterface).interfaceId || super.supportsInterface(interfaceId);
}
&#x60;&#x60;&#x60;

Alternatively, {ERC165Storage} provides an easier to use but more expensive implementation._

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

_See {IERC165-supportsInterface}._

## IERC165

_Interface of the ERC165 standard, as defined in the
https://eips.ethereum.org/EIPS/eip-165[EIP].

Implementers can declare support of contract interfaces, which can then be
queried by others ({ERC165Checker}).

For an implementation, see {ERC165}._

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool)
```

_Returns true if this contract implements the interface defined by
&#x60;interfaceId&#x60;. See the corresponding
https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
to learn more about how these ids are created.

This function call must use less than 30 000 gas._

## SafeMath

_Wrappers over Solidity&#x27;s arithmetic operations.

NOTE: &#x60;SafeMath&#x60; is generally not needed starting with Solidity 0.8, since the compiler
now has built in overflow checking._

### tryAdd

```solidity
function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256)
```

_Returns the addition of two unsigned integers, with an overflow flag.

_Available since v3.4.__

### trySub

```solidity
function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256)
```

_Returns the substraction of two unsigned integers, with an overflow flag.

_Available since v3.4.__

### tryMul

```solidity
function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256)
```

_Returns the multiplication of two unsigned integers, with an overflow flag.

_Available since v3.4.__

### tryDiv

```solidity
function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256)
```

_Returns the division of two unsigned integers, with a division by zero flag.

_Available since v3.4.__

### tryMod

```solidity
function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256)
```

_Returns the remainder of dividing two unsigned integers, with a division by zero flag.

_Available since v3.4.__

### add

```solidity
function add(uint256 a, uint256 b) internal pure returns (uint256)
```

_Returns the addition of two unsigned integers, reverting on
overflow.

Counterpart to Solidity&#x27;s &#x60;+&#x60; operator.

Requirements:

- Addition cannot overflow._

### sub

```solidity
function sub(uint256 a, uint256 b) internal pure returns (uint256)
```

_Returns the subtraction of two unsigned integers, reverting on
overflow (when the result is negative).

Counterpart to Solidity&#x27;s &#x60;-&#x60; operator.

Requirements:

- Subtraction cannot overflow._

### mul

```solidity
function mul(uint256 a, uint256 b) internal pure returns (uint256)
```

_Returns the multiplication of two unsigned integers, reverting on
overflow.

Counterpart to Solidity&#x27;s &#x60;*&#x60; operator.

Requirements:

- Multiplication cannot overflow._

### div

```solidity
function div(uint256 a, uint256 b) internal pure returns (uint256)
```

_Returns the integer division of two unsigned integers, reverting on
division by zero. The result is rounded towards zero.

Counterpart to Solidity&#x27;s &#x60;/&#x60; operator.

Requirements:

- The divisor cannot be zero._

### mod

```solidity
function mod(uint256 a, uint256 b) internal pure returns (uint256)
```

_Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
reverting when dividing by zero.

Counterpart to Solidity&#x27;s &#x60;%&#x60; operator. This function uses a &#x60;revert&#x60;
opcode (which leaves remaining gas untouched) while Solidity uses an
invalid opcode to revert (consuming all remaining gas).

Requirements:

- The divisor cannot be zero._

### sub

```solidity
function sub(uint256 a, uint256 b, string errorMessage) internal pure returns (uint256)
```

_Returns the subtraction of two unsigned integers, reverting with custom message on
overflow (when the result is negative).

CAUTION: This function is deprecated because it requires allocating memory for the error
message unnecessarily. For custom revert reasons use {trySub}.

Counterpart to Solidity&#x27;s &#x60;-&#x60; operator.

Requirements:

- Subtraction cannot overflow._

### div

```solidity
function div(uint256 a, uint256 b, string errorMessage) internal pure returns (uint256)
```

_Returns the integer division of two unsigned integers, reverting with custom message on
division by zero. The result is rounded towards zero.

Counterpart to Solidity&#x27;s &#x60;/&#x60; operator. Note: this function uses a
&#x60;revert&#x60; opcode (which leaves remaining gas untouched) while Solidity
uses an invalid opcode to revert (consuming all remaining gas).

Requirements:

- The divisor cannot be zero._

### mod

```solidity
function mod(uint256 a, uint256 b, string errorMessage) internal pure returns (uint256)
```

_Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
reverting with custom message when dividing by zero.

CAUTION: This function is deprecated because it requires allocating memory for the error
message unnecessarily. For custom revert reasons use {tryMod}.

Counterpart to Solidity&#x27;s &#x60;%&#x60; operator. This function uses a &#x60;revert&#x60;
opcode (which leaves remaining gas untouched) while Solidity uses an
invalid opcode to revert (consuming all remaining gas).

Requirements:

- The divisor cannot be zero._

## EnumerableSet

_Library for managing
https://en.wikipedia.org/wiki/Set_(abstract_data_type)[sets] of primitive
types.

Sets have the following properties:

- Elements are added, removed, and checked for existence in constant time
(O(1)).
- Elements are enumerated in O(n). No guarantees are made on the ordering.

&#x60;&#x60;&#x60;
contract Example {
    // Add the library methods
    using EnumerableSet for EnumerableSet.AddressSet;

    // Declare a set state variable
    EnumerableSet.AddressSet private mySet;
}
&#x60;&#x60;&#x60;

As of v3.3.0, sets of type &#x60;bytes32&#x60; (&#x60;Bytes32Set&#x60;), &#x60;address&#x60; (&#x60;AddressSet&#x60;)
and &#x60;uint256&#x60; (&#x60;UintSet&#x60;) are supported._

### Set

```solidity
struct Set {
  bytes32[] _values;
  mapping(bytes32 => uint256) _indexes;
}
```

### _add

```solidity
function _add(struct EnumerableSet.Set set, bytes32 value) private returns (bool)
```

_Add a value to a set. O(1).

Returns true if the value was added to the set, that is if it was not
already present._

### _remove

```solidity
function _remove(struct EnumerableSet.Set set, bytes32 value) private returns (bool)
```

_Removes a value from a set. O(1).

Returns true if the value was removed from the set, that is if it was
present._

### _contains

```solidity
function _contains(struct EnumerableSet.Set set, bytes32 value) private view returns (bool)
```

_Returns true if the value is in the set. O(1)._

### _length

```solidity
function _length(struct EnumerableSet.Set set) private view returns (uint256)
```

_Returns the number of values on the set. O(1)._

### _at

```solidity
function _at(struct EnumerableSet.Set set, uint256 index) private view returns (bytes32)
```

_Returns the value stored at position &#x60;index&#x60; in the set. O(1).

Note that there are no guarantees on the ordering of values inside the
array, and it may change when more values are added or removed.

Requirements:

- &#x60;index&#x60; must be strictly less than {length}._

### _values

```solidity
function _values(struct EnumerableSet.Set set) private view returns (bytes32[])
```

_Return the entire set in an array

WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
this function has an unbounded cost, and using it as part of a state-changing function may render the function
uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block._

### Bytes32Set

```solidity
struct Bytes32Set {
  struct EnumerableSet.Set _inner;
}
```

### add

```solidity
function add(struct EnumerableSet.Bytes32Set set, bytes32 value) internal returns (bool)
```

_Add a value to a set. O(1).

Returns true if the value was added to the set, that is if it was not
already present._

### remove

```solidity
function remove(struct EnumerableSet.Bytes32Set set, bytes32 value) internal returns (bool)
```

_Removes a value from a set. O(1).

Returns true if the value was removed from the set, that is if it was
present._

### contains

```solidity
function contains(struct EnumerableSet.Bytes32Set set, bytes32 value) internal view returns (bool)
```

_Returns true if the value is in the set. O(1)._

### length

```solidity
function length(struct EnumerableSet.Bytes32Set set) internal view returns (uint256)
```

_Returns the number of values in the set. O(1)._

### at

```solidity
function at(struct EnumerableSet.Bytes32Set set, uint256 index) internal view returns (bytes32)
```

_Returns the value stored at position &#x60;index&#x60; in the set. O(1).

Note that there are no guarantees on the ordering of values inside the
array, and it may change when more values are added or removed.

Requirements:

- &#x60;index&#x60; must be strictly less than {length}._

### values

```solidity
function values(struct EnumerableSet.Bytes32Set set) internal view returns (bytes32[])
```

_Return the entire set in an array

WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
this function has an unbounded cost, and using it as part of a state-changing function may render the function
uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block._

### AddressSet

```solidity
struct AddressSet {
  struct EnumerableSet.Set _inner;
}
```

### add

```solidity
function add(struct EnumerableSet.AddressSet set, address value) internal returns (bool)
```

_Add a value to a set. O(1).

Returns true if the value was added to the set, that is if it was not
already present._

### remove

```solidity
function remove(struct EnumerableSet.AddressSet set, address value) internal returns (bool)
```

_Removes a value from a set. O(1).

Returns true if the value was removed from the set, that is if it was
present._

### contains

```solidity
function contains(struct EnumerableSet.AddressSet set, address value) internal view returns (bool)
```

_Returns true if the value is in the set. O(1)._

### length

```solidity
function length(struct EnumerableSet.AddressSet set) internal view returns (uint256)
```

_Returns the number of values in the set. O(1)._

### at

```solidity
function at(struct EnumerableSet.AddressSet set, uint256 index) internal view returns (address)
```

_Returns the value stored at position &#x60;index&#x60; in the set. O(1).

Note that there are no guarantees on the ordering of values inside the
array, and it may change when more values are added or removed.

Requirements:

- &#x60;index&#x60; must be strictly less than {length}._

### values

```solidity
function values(struct EnumerableSet.AddressSet set) internal view returns (address[])
```

_Return the entire set in an array

WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
this function has an unbounded cost, and using it as part of a state-changing function may render the function
uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block._

### UintSet

```solidity
struct UintSet {
  struct EnumerableSet.Set _inner;
}
```

### add

```solidity
function add(struct EnumerableSet.UintSet set, uint256 value) internal returns (bool)
```

_Add a value to a set. O(1).

Returns true if the value was added to the set, that is if it was not
already present._

### remove

```solidity
function remove(struct EnumerableSet.UintSet set, uint256 value) internal returns (bool)
```

_Removes a value from a set. O(1).

Returns true if the value was removed from the set, that is if it was
present._

### contains

```solidity
function contains(struct EnumerableSet.UintSet set, uint256 value) internal view returns (bool)
```

_Returns true if the value is in the set. O(1)._

### length

```solidity
function length(struct EnumerableSet.UintSet set) internal view returns (uint256)
```

_Returns the number of values on the set. O(1)._

### at

```solidity
function at(struct EnumerableSet.UintSet set, uint256 index) internal view returns (uint256)
```

_Returns the value stored at position &#x60;index&#x60; in the set. O(1).

Note that there are no guarantees on the ordering of values inside the
array, and it may change when more values are added or removed.

Requirements:

- &#x60;index&#x60; must be strictly less than {length}._

### values

```solidity
function values(struct EnumerableSet.UintSet set) internal view returns (uint256[])
```

_Return the entire set in an array

WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
this function has an unbounded cost, and using it as part of a state-changing function may render the function
uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block._

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
function getRoles() public pure returns (struct RoleAccess.Role[])
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

## XToken

### _cap

```solidity
uint256 _cap
```

### frozen

```solidity
mapping(address => bool) frozen
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

_Destroys &#x60;amount&#x60; tokens from the caller.

See {ERC20-_burn}._

### burnFrom

```solidity
function burnFrom(address account, uint256 amount) public
```

_Destroys &#x60;amount&#x60; tokens from &#x60;account&#x60;, deducting from the caller&#x27;s
allowance.

See {ERC20-_burn} and {ERC20-allowance}.

Requirements:

- the caller must have allowance for &#x60;&#x60;accounts&#x60;&#x60;&#x27;s tokens of at least
&#x60;amount&#x60;._

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

- when &#x60;from&#x60; and &#x60;to&#x60; are both non-zero, &#x60;amount&#x60; of &#x60;&#x60;from&#x60;&#x60;&#x27;s tokens
will be transferred to &#x60;to&#x60;.
- when &#x60;from&#x60; is zero, &#x60;amount&#x60; tokens will be minted for &#x60;to&#x60;.
- when &#x60;to&#x60; is zero, &#x60;amount&#x60; of &#x60;&#x60;from&#x60;&#x60;&#x27;s tokens will be burned.
- &#x60;from&#x60; and &#x60;to&#x60; are never both zero.

To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks]._

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

### vestingScheds

```solidity
mapping(uint256 => struct TokenVesting.VestingSched) vestingScheds
```

### soloVestings

```solidity
mapping(bytes32 => struct TokenVesting.SoloVesting) soloVestings
```

### constructor

```solidity
constructor(address token_, address funding_) public
```

### updateFunding

```solidity
function updateFunding(address newfunding) external
```

Update the funding source address of vesting schedules

| Name | Type | Description |
| ---- | ---- | ----------- |
| newfunding | address | The new address of the funding source account |

### newVestingSched

```solidity
function newVestingSched(string name, uint256 vestingTime) external returns (uint256)
```

Create new vesting schedule

| Name | Type | Description |
| ---- | ---- | ----------- |
| name | string | The name of the vesting schedule, such as &quot;3-month vesting schedule&quot; |
| vestingTime | uint256 | The timestamp in seconds of the beginning of the vesting period. |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The id of the created new vesting schedule. |

### _grant

```solidity
function _grant(uint256 vestingSchedID_, address beneficiary, uint256 amount) internal
```

### grant

```solidity
function grant(uint256 vestingSchedID_, address[] beneficiaries, uint256[] grantAmounts) external returns (bool)
```

Grant a list of beneficiaries tokens for a vesting schedule

| Name | Type | Description |
| ---- | ---- | ----------- |
| vestingSchedID_ | uint256 | The vesting schedule of the token grant |
| beneficiaries | address[] | A list of beneficiaries addresses |
| grantAmounts | uint256[] | A list of token amounts that each beneficiary will be granted |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | Return true if the function is called without any issue. |

### withdraw

```solidity
function withdraw(uint256 vestingSchedID_, uint256 amount) external returns (bool)
```

Withdraw tokens from vesting schedule into caller&#x27;s address

| Name | Type | Description |
| ---- | ---- | ----------- |
| vestingSchedID_ | uint256 | ID of the vesting schedule to withdraw token from. |
| amount | uint256 | Amount of token to withdraw. |

### withdrawTo

```solidity
function withdrawTo(uint256 vestingSchedID_, uint256 amount, address beneficiary) external returns (bool)
```

Withdraw tokens from vesting schedule into beneficiary&#x27;s address

| Name | Type | Description |
| ---- | ---- | ----------- |
| vestingSchedID_ | uint256 | The ID of the vesting schedule to withdraw token from. |
| amount | uint256 | Amount of token to withdraw. |
| beneficiary | address | The address that will receive the withdrawed tokens. |

### _withdraw

```solidity
function _withdraw(uint256 vestingSchedID_, address beneficiary, uint256 amount) internal returns (bool)
```

### transfer

```solidity
function transfer(uint256 vestingSchedID_, address beneficiary, uint256 amount) external returns (bool)
```

Transfer vesting between beneficiaries

| Name | Type | Description |
| ---- | ---- | ----------- |
| vestingSchedID_ | uint256 | The ID of the vesting schedule to withdraw token from. |
| beneficiary | address | The beneficiary that will receive the transfered grants. |
| amount | uint256 | The amount of transfered grants. |

### allVestingScheds

```solidity
function allVestingScheds() external view returns (struct TokenVesting.VestingSched[])
```

Return all vesting schedules.

### vestingSched

```solidity
function vestingSched(uint256 vestingSchedID_) external view returns (struct TokenVesting.VestingSched)
```

Return all vesting schedules.

| Name | Type | Description |
| ---- | ---- | ----------- |
| vestingSchedID_ | uint256 | a single vesting schedule by ID |

### allSoloVestings

```solidity
function allSoloVestings(address beneficiary) external view returns (struct TokenVesting.SoloVesting[])
```

Return all vesting schedules for a user.

| Name | Type | Description |
| ---- | ---- | ----------- |
| beneficiary | address | User&#x27;s address |

### soloVesting

```solidity
function soloVesting(uint256 vestingSchedID_, address beneficiary) external view returns (struct TokenVesting.SoloVesting)
```

Return beneficiary&#x27;s grants for a certain vesting schedule.

| Name | Type | Description |
| ---- | ---- | ----------- |
| vestingSchedID_ | uint256 | The ID of the vesting schedule. |
| beneficiary | address | The beneficiary&#x27;s account |

