const nearAPI = require("near-api-js");

// 替换成你的 NEAR 账户 可以多个地址 那样给每个地址都打 类似并发
const accounts = [
  {
    sender: "",
    PRIVATE_KEY: "",
  },
];
for (const account of accounts) {
  runner(account.sender, account.PRIVATE_KEY);
}

async function runner(
  sender,
  PRIVATE_KEY,
  maxCount = 500000000, // 最大mint次数 近乎于无限
  maxErrorCount = 500000000 // 最大出错次数，容忍RPC节点失败 近乎于无限
) {
  const { keyStores, KeyPair, connect, Contract, providers } = nearAPI;
  const myKeyStore = new keyStores.InMemoryKeyStore();
  // creates a public / private key pair using the provided private key
  const keyPair = KeyPair.fromString(PRIVATE_KEY);
  // adds the keyPair you created to keyStore
  await myKeyStore.setKey("mainnet", sender, keyPair);

  const connectionConfig = {
    networkId: "mainnet",
    keyStore: myKeyStore, // first create a key store
    //这个很关键，一个好的节点才能保证成功上链 目前 公开免费的节点1-2分钟才能成功
    //通过 https://account.getblock.io/sign-in?ref=NzMyNmJmNzQtMTg5MC01NTAxLWE2ZDctODM4YTEwZGJiZmU4
    //这个链接注册每天送4w个免费请求 大概够1个地址用11个小时的，可以注册多个白嫖，注册后在dashboard 页面获取 endpoints
    nodeUrl: "https://rpc.mainnet.near.org",
    walletUrl: "https://wallet.mainnet.near.org",
    helperUrl: "https://helper.mainnet.near.org",
    explorerUrl: "https://explorer.mainnet.near.org",
  };
  const nearConnection = await connect(connectionConfig);
  const provider = new providers.JsonRpcProvider(
    "https://rpc.mainnet.near.org"
  );
  const account = await nearConnection.account(sender);
  const balance = await account.getAccountBalance();
  console.log(balance);

  const contract = new Contract(account, "inscription.near", {
    changeMethods: ["inscribe"],
  });

  let errorCount = 0;

  const sendTransaction = async (count) => {
    if (count >= maxCount) {
      //默认最多执行一千次
      console.log(from, "Maximum execution reached.");
      return;
    }
    try {
      const status = await provider.status();
      const gasPrice = await provider.gasPrice(
        status.sync_info.latest_block_height
      );
      //175263878 大概 0.0008 near
      if (gasPrice.gas_price > 200136057) {
        console.log(
          "gas too many wait run now block_height",
          status.sync_info.latest_block_height,
          "gas_price",
          gasPrice.gas_price
        );
        // 等待一秒再执行下一次 注释掉就只执行一次
        setTimeout(() => {
          sendTransaction(count + 1);
        }, 1000);
      } else {
        const res = await contract.inscribe({
          args: {
            p: "nrc-20",
            op: "mint",
            tick: "neat",
            amt: "100000000",
          },
          gas: "300000000000000",
        });
        console.log("res", res);
        // 等待一秒再执行下一次 注释掉就只执行一次
        setTimeout(() => {
          sendTransaction(count + 1);
        }, 1000);
      }
    } catch (error) {
      console.error(sender, "error:", error.message || error);
      errorCount++;
      if (errorCount < maxErrorCount) {
        setTimeout(() => {
          sendTransaction(count + 1);
        }, 1000);
      }
    }
  };
  // 执行第一次发送交易
  sendTransaction(0);
}
// runner();
