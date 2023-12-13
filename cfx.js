//https://www.coredao.org
const Web3 = require("web3");
//如果node版本 不是 v16.6.2 可以试试下面的 并且注释或者删除上面
// const { Web3 } = require("web3");
const provider = new Web3.providers.HttpProvider(
  //   "https://rpc.ankr.com/core/3a6942581a6bb7a10741688d43c3a3b5cb3e2ef6e0d0bf7799bc26a3cff21d09"
  "https://evm.confluxrpc.com"
  //   "https://www.coredao.org"
  //   "https://rpc-core.icecreamswap.com"
);
//   "https://oktc-mainnet.public.blastapi.io"
//   "https://exchainrpc.okex.org/"
//
const web3 = new Web3(provider);
const accounts = [
  //cfx 网络爆炸推荐多地址 这样成功率略大
  {
    address: "",
    privateKey: "",
  },
];
//okts 的 data
// const hexData =
//   "0x646174613a2c7b2270223a226372632d3230222c226f70223a226d696e74222c227469636b223a22636f7273222c22616d74223a2231303030227d";
let num = 0;
let runNum = 0;
const toAddress = "0xc6e865c213c89ca42a622c5572d19f00d84d7a16";
const st = new Date().getTime();
console.log("accounts number", accounts.length, st);
for (const account of accounts) {
  runner(account.address, account.privateKey);
}

async function runner(sender, privateKey) {
  const balance = web3.utils.fromWei(
    await web3.eth.getBalance(sender),
    "ether"
  );
  console.log(
    num++,
    web3.eth.accounts.privateKeyToAccount(privateKey).address,
    balance
  );

  const sendTransaction = async (nonce, privateKey, gasPrice) => {
    try {
      //获取余额
      //   const balance = web3.utils.fromWei(
      //     await web3.eth.getBalance(sender),
      //     "ether"
      //   );

      const from = web3.eth.accounts.privateKeyToAccount(privateKey).address;
      console.log(
        web3.eth.accounts.privateKeyToAccount(privateKey).address,
        // balance,
        "gasPrice",
        gasPrice,
        "nonce",
        nonce
      );
      const transactionObject = {
        from: from,
        to: toAddress,
        value: "0",
        data: "",
        gas: 600896,
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
      console.log("res sucess", runNum++);
    } catch (error) {
      //需要看错误就去掉下面的两个斜杠
      //console.error(sender, "error:", error.message || error);
    }
  };
  // 执行3次交易 打不死就往死里打，想要加一次发送的交易数量
  const batchRes = 5; //
  const runsend = async () => {
    //okt 最大好像是 0.1gwei 150 倍是 15GWEI 自己调整
    // const gasPrice = web3.utils.toWei("61", "gwei");
    //12-11:00:06 获取 30gwei 不打包
    const gasPrice = web3.utils.toWei("35", "gwei");
    // const gasPrice =
    //   parseInt(parseInt(await web3.eth.getGasPrice()) * 1.5) + "";
    let nonce = await web3.eth.getTransactionCount(sender);
    // let toNonce = await web3.eth.getTransactionCount(toAddress);
    // console.log(toAddress, toNonce);
    for (let i = 0; i < batchRes; i++) {
      sendTransaction(nonce + i, privateKey, gasPrice);
    }
    setTimeout(() => {
      runsend();
      //6秒一次 看情况调整，太快不一定好
    }, 3000);
  };
  runsend();
}
