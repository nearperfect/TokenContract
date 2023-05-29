# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```


## 主要函数：
---
### 构造函数
```
constructor(address token_, address funding_)
token_: 锁仓代币
funding_: 来源账户
```

---
### 仅限管理员调用：
```
updateFunding：锁仓代币来源的账号

newVestingSched：创建新的锁仓

grant: 授予账户锁仓token。调用本函数前，需要先调用锁仓代币erc20的approve方法，以保证锁仓时可以将足够的token转入本锁仓合约名下。
```
---
### 不限调用：

#### 写函数：
```
withdraw：赎回锁仓到本人地址

withdrawTo：赎回锁仓到指定地址

transfer：将锁仓额度赠与其他人

approve：授予其他账号调用transfer的额度

transferFrom：approve后可调用，类似transfer
```

#### 只读函数：
```
allowance：查询approve后的额度

allVestingScheds：返回所有的锁仓计划

vestingSched：返回单个锁仓计划 allSoloVestings：返回某个地址的所有锁仓计划

soloVesting：返回某个地址的某个锁仓计划
```