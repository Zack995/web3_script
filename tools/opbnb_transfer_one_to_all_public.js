const Web3 = require("web3");
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
const mainAddress = {
  address: "",
  privateKey: "",
};
const toEthValue = "0.3";
const accounts = [
  {
    address: "",
  },
];

async function main() {
  let nonce = await web31.eth.getTransactionCount(mainAddress.address);
  console.log("main", mainAddress.address, "nonce ", nonce);
  let mainBalance = web31.utils.fromWei(
    await web31.eth.getBalance(mainAddress.address),
    "ether"
  );
  console.log(mainAddress.address, "balance ", mainBalance);
  for (const account of accounts) {
    runner(account.address, nonce++);
  }
}
async function runner(to, nonce) {
  //   let balance = web31.utils.fromWei(await web31.eth.getBalance(from), "ether");
  console.log("runner to", to, "from nonce ", nonce);
  const sendTransaction = async (nonce, gasPrice, toValue) => {
    try {
      const web3 = new Web3(getRandomString());
      const transactionObject = {
        from: mainAddress.address,
        to: to,
        value: toValue + "", // 设置为 0，因为这是一笔数据交易，而不是转账v
        data: "",
        gas: 60896,
        gasPrice: gasPrice,
        nonce,
      };
      const signedTransaction = await web3.eth.accounts.signTransaction(
        transactionObject,
        mainAddress.privateKey
      );
      // 发送签名交易
      const receipt = await web3.eth.sendSignedTransaction(
        signedTransaction.rawTransaction
      );
      let balance = web3.utils.fromWei(await web3.eth.getBalance(to), "ether");
      console.log(to, balance, toValue, "gasPrice", gasPrice);
    } catch (error) {
      console.error(to, "error:", error.message || error);
    }
  };
  // 执行第一次发送交易
  const runsend = async () => {
    const gasPrice = parseInt(await web31.eth.getGasPrice()) + "";
    const toValue = await web31.utils.toWei(toEthValue, "ether");
    await sendTransaction(nonce, gasPrice, toValue);
  };
  runsend();
}
main();
