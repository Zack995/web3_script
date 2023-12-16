// 填入自己的 地址 和 私钥 最好多个地址 打的快又好看，
// 防高gas 功能 加入大于101gwei 不打
// 81行代码 102 代表一次性发送请求量最好别超过20
// 104行代码 1000000000 代表比基本gas 高1gei 最大别卷3 因为gas大战
// 111行代码 3000 代表执行间隔 目前3秒，如果确认慢就调大 3秒目前我这边比较好
// 还有76行代码 如果高于101gwei 就不打 余额低于0.2也不大 自己酌情考虑
// 还有本脚本都是打自己地址 如果想改其他地址 81行内容         to: "你想要的地址",
//npm install web3@1.10.3

https://github.com/Zack995/web3_script
参考我github 之前的 脚本教程，提示的内容是
nodejs 我本地是 16.6.2 其他版本可能有语法问题 百度 或者chatgpt修改
web3.js 我是     "web3": "^1.10.3" 这个版本
npm 出错误 百度 ：npm 淘宝镜像
const Web3 = require("web3");
// const web3 = new Web3("https://api.avax.network/ext/bc/C/rpc");
//rpc池子
const myArray = [
  "https://api.avax.network/ext/bc/C/rpc",
  "https://avalanche.blockpi.network/v1/rpc/public",
  "https://ava-mainnet.public.blastapi.io/ext/bc/C/rpc",
  "https://api.zan.top/node/v1/avax/mainnet/public/ext/bc/C/rpc",
  "https://avalanche.drpc.org",
  "https://avax.meowrpc.com",
  "https://1rpc.io/avax/c",
  "https://avalanche.blockpi.network/v1/rpc/public",
  "https://avalanche.public-rpc.com",
];
const randomString = myArray[Math.floor(Math.random() * myArray.length)];
const web31 = new Web3("https://api.avax.network/ext/bc/C/rpc");
const accounts = [
  {
    address: "",
    privateKey: "",
  },
];
//avav
const hexData =
  "0x646174613a2c7b2270223a226173632d3230222c226f70223a226d696e74222c227469636b223a2261766176222c22616d74223a223639363936393639227d";
let num = 0;
let runNum = 0;
const st = new Date().getTime();
console.log("accounts number", accounts.length, st);
for (const account of accounts) {
  runner(account.address, account.privateKey);
}

async function runner(sender, privateKey) {
  let balance = web31.utils.fromWei(
    await web31.eth.getBalance(sender),
    "ether"
  );
  console.log(
    num++,
    web31.eth.accounts.privateKeyToAccount(privateKey).address,
    balance
  );

  //   const contract = new Contract(account, "inscription.near", {
  //     changeMethods: ["inscribe"],
  //   });

  const sendTransaction = async (nonce, privateKey, gasPrice) => {
    try {
      //   const gasPrice = await web3.eth.getGasPrice();
      const web3 = new Web3(randomString);
      if (nonce % 10 == 0) {
        balance = web3.utils.fromWei(
          await web3.eth.getBalance(sender),
          "ether"
        );
      }
      const from = web3.eth.accounts.privateKeyToAccount(privateKey).address;
      //   console.log(
      //     from,
      //     "sendTransaction nonce",
      //     nonce,
      //     "gasPrice",
      //     gasPrice,
      //     gasPrice > 50097311320
      //   );
      console.log(
        web3.eth.accounts.privateKeyToAccount(privateKey).address,
        balance,
        "gasPrice",
        gasPrice,
        "nonce",
        nonce
      );
      //1000 gwei 不打
      if (gasPrice > 100097311320 || balance < 0.2) {
        return;
      }
      const transactionObject = {
        from: from,
        to: from,
        value: "0", // 设置为 0，因为这是一笔数据交易，而不是转账v
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
      //   console.error(sender, "error:", error.message || error);
    }
  };
  // 执行第一次发送交易
  const batchRes = 5;
  const runsend = async () => {
    const gasPrice = parseInt(await web31.eth.getGasPrice()) + 1000000000 + "";
    let nonce = await web31.eth.getTransactionCount(sender);
    for (let i = 0; i < batchRes; i++) {
      sendTransaction(nonce + i, privateKey, gasPrice);
    }
    setTimeout(() => {
      runsend();
    }, 3000);
  };
  runsend();
}
// runner();
