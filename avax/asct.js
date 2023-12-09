const Web3 = require("web3");
//自己找一个靠谱的rpc 节点
//我个人推荐 https://account.getblock.io/sign-in?ref=NzMyNmJmNzQtMTg5MC01NTAxLWE2ZDctODM4YTEwZGJiZmU4 这个链接注册每天送4w个免费请求
const web3 = new Web3("https://api.avax.network/ext/bc/C/rpc");
const accounts = [
  {
    address: "",
    privateKey: "",
  },
];
//asct 的 data
const hexData =
  "0x646174613a2c7b2270223a226173632d3230222c226f70223a226d696e74222c227469636b223a2261736374222c22616d74223a2232227d";
//要打给哪个地址
const toAddress = "";
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

  //   const contract = new Contract(account, "inscription.near", {
  //     changeMethods: ["inscribe"],
  //   });

  const sendTransaction = async (nonce, privateKey) => {
    try {
      //   const gasPrice = await web3.eth.getGasPrice();
      const balance = web3.utils.fromWei(
        await web3.eth.getBalance(sender),
        "ether"
      );
      console.log(
        web3.eth.accounts.privateKeyToAccount(privateKey).address,
        balance
      );
      const from = web3.eth.accounts.privateKeyToAccount(privateKey).address;
      const gasPrice = parseInt(await web3.eth.getGasPrice()) + 6000000000 + "";
      //   console.log(from, "sendTransaction nonce", nonce, "gasPrice", gasPrice);
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
      //   console.error(sender, "error:", error.message || error);
    }
  };
  // 执行速率 现在一次性发送4次交易，可以调整大小
  const batchRes = [0 ,1, 2, 3]; //, 4, 5, 6, 4, 5, 6, 7, 8, 9, 10
  const runsend = async () => {
    let nonce = await web3.eth.getTransactionCount(sender);
    console.log("nonce", nonce);
    for (let i = 0; i < batchRes.length; i++) {
      sendTransaction(nonce + batchRes[i], privateKey);
    }
    setTimeout(() => {
      runsend();
      //调整执行等待时间 根据你gas 和 交易次数自己条件，这个是我测试后得到的相对合适
    }, 6000);
  };
  runsend();
}
// runner();
