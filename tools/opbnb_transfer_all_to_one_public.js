const Web3 = require("web3");
const { BigNumber } = require("bignumber.js");
// const web3 = new Web3("https://api.avax.network/ext/bc/C/rpc");
//rpc池子
const myArray = [
  "https://opbnb.publicnode.com",
  "https://opbnb-mainnet-rpc.bnbchain.org",
];
function getRandomString() {
  if (myArray.length === 0) {
    return null; // 或者根据你的需求返回适当的默认值
  }

  return myArray[Math.floor(Math.random() * myArray.length)];
}
const web31 = new Web3(getRandomString());
//归集地址
const mainAddress = {
  address: "",
};
//发送地址
const accounts = [
  {
    address: "",
    privateKey: "",
  },
];

async function main() {
  //   let nonce = await web31.eth.getTransactionCount(mainAddress.address);
  //   console.log("main", mainAddress.address, "nonce ", nonce);
  let mainBalance = web31.utils.fromWei(
    await web31.eth.getBalance(mainAddress.address),
    "ether"
  );
  console.log(
    mainAddress.address,
    "balance ",
    mainBalance,
    "accounts size",
    accounts.length
  );
  for (const account of accounts) {
    runner(account.address, account.privateKey);
  }
}
async function runner(from, privateKey) {
  //   let balance = web31.utils.fromWei(await web31.eth.getBalance(from), "ether");
  const sendTransaction = async (nonce, gasPrice, toValue) => {
    try {
      const web3 = new Web3(getRandomString());
      const transactionObject = {
        from: from,
        to: mainAddress.address,
        value: toValue + "", // 设置为 0，因为这是一笔数据交易，而不是转账v
        data: "",
        gas: 21000,
        gasPrice: gasPrice,
        nonce,
      };
      const signedTransaction = await web3.eth.accounts.signTransaction(
        transactionObject,
        privateKey
      );
      // 发送签名交易
      const receipt = await web3.eth.sendSignedTransaction(
        signedTransaction.rawTransaction
      );
      let balance = web3.utils.fromWei(await web3.eth.getBalance(to), "ether");
      console.log(mainAddress.address, balance, toValue, "gasPrice", gasPrice);
    } catch (error) {
      console.error(mainAddress.address, "error:", error.message || error);
    }
  };
  // 执行第一次发送交易
  const runsend = async () => {
    // const gasPrice = parseInt(await web31.eth.getGasPrice()) + "";
    //   const gasPrice = 10;
    const gasPrice = parseInt(await web31.eth.getGasPrice()) + "";
    //to value = balance - 0.00000391
    let balance = web31.utils.fromWei(
      await web31.eth.getBalance(from),
      "ether"
    );
    console.log(from, balance);
    //余额小于0.001 不归集
    if (BigNumber(balance).isLessThanOrEqualTo(BigNumber(0.001))) {
      return;
    }
    //gas 费用 0.00000391
    const toValue = await web31.utils.toWei(
      BigNumber(balance).minus(BigNumber(0.00000391)).toString(),
      "ether"
    );
    let nonce = await web31.eth.getTransactionCount(from);
    console.log(from, balance, toValue, nonce, "gasPrice", gasPrice);
    await sendTransaction(nonce, gasPrice, toValue);
  };
  runsend();
}
main();
