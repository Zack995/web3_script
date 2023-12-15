//https://www.coredao.org
const Web3 = require("web3");
//如果node版本 不是 v16.6.2 可以试试下面的 并且注释或者删除上面
// const { Web3 } = require("web3");
const provider = new Web3.providers.HttpProvider(
  //rpc 基本处于半瘫痪状态，自己这边找靠谱的 第一个瘫痪，第二个速率限制半瘫痪
  //   "https://www.coredao.org"
  "https://rpc-core.icecreamswap.com"
);
//
const web3 = new Web3(provider);
const accounts = [
  {
    //发财了 老板可以打个赏 地址 0x4273173187f1108007b1C1ABE5301eFa03f7fc8A 感谢老板
    address: "",
    privateKey: "",
  },
];
//okts 的 data
const hexData =
  "0x646174613a2c7b2270223a226372632d3230222c226f70223a226d696e74222c227469636b223a22636f7273222c22616d74223a2231303030227d";
let num = 0;
let runNum = 0;
//cors 要转这个地址
const toAddress = "0x000000000000000000000000000000000000dEaD";
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
      //获取余额 注释掉减少rpc请求
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
        value: "0", // 设置为 0，因为这是一笔数据交易，而不是转账
        data: hexData,
        gas: 60896,
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
      console.error(sender, "error:", error.message || error);
    }
  };
  // 执行3次交易 打不死就往死里打，想要加一次发送的交易数量
  const batchRes = 10; //
  const runsend = async () => {
    //目前写死 61 gwei 你们根据实际情况调整，通过rpc 获取的打包太慢了
    // const gasPrice = web3.utils.toWei("61", "gwei");
    //12-11:00:06 获取 30gwei 不打包 直接rpc 获取 *2 根据自己需要修改
    const gasPrice = parseInt(parseInt(await web3.eth.getGasPrice()) * 2) + "";
    let nonce = await web3.eth.getTransactionCount(sender);
    for (let i = 0; i < batchRes; i++) {
        sendTransaction(parseInt(nonce) + i, privateKey, gasPrice);
    }
    setTimeout(() => {
      runsend();
      //8秒一次 看情况调整，太快不一定好
    }, 8000);
  };
  runsend();
}
