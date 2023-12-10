const Web3 = require("web3");
//如果node版本 不是 v16.6.2 可以试试下面的 并且注释或者删除上面
// const { Web3 } = require("web3");
const provider = new Web3.providers.HttpProvider(
  "https://oktc-mainnet.public.blastapi.io"
);
const web3 = new Web3(provider);
const accounts = [
  {
    //发财了 老板可以打个赏 地址 0xB178FE6040fe7dB1c7b0219e72C7BaDbCF7A3B0c 感谢老板
    address: "",
    privateKey: "",
  },
];
//okts 的 data
const hexData =
  "0x646174613a2c7b2270223a227872632d3230222c226f70223a226d696e74222c227469636b223a226f6b7473222c22616d74223a2231303030227d";
let num = 0;
let runNum = 0;
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
      const balance = web3.utils.fromWei(
        await web3.eth.getBalance(sender),
        "ether"
      );

      const from = web3.eth.accounts.privateKeyToAccount(privateKey).address;
      console.log(
        web3.eth.accounts.privateKeyToAccount(privateKey).address,
        balance,
        "gasPrice",
        gasPrice,
        "nonce",
        nonce
      );
      const transactionObject = {
        from: from,
        to: from,
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
  const batchRes = 3; //
  const runsend = async () => {
    //okt 最大好像是 0.1gwei 100 倍是 10GWEI 自己调整
    const gasPrice = parseInt(await web3.eth.getGasPrice()) * 100 + "";
    let nonce = await web3.eth.getTransactionCount(sender);
    for (let i = 0; i < batchRes; i++) {
      sendTransaction(nonce + i, privateKey, gasPrice);
    }
    setTimeout(() => {
      runsend();
      //6秒一次 看情况调整，太快不一定好
    }, 6000);
  };
  runsend();
}
// runner();
