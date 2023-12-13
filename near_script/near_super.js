const nearAPI = require("near-api-js");
const BN = require("bn.js");
const sha256 = require("js-sha256");

// 替换成你的 NEAR 账户 可以多个地址 那样给每个地址都打 类似并发
// 替换成你的 NEAR 账户
const accounts = [
  {
    sender: "",
    PRIVATE_KEY: "ed25519:",
  },
];
for (const account of accounts) {
  runner(account.sender, account.PRIVATE_KEY);
}

async function runner(sender, PRIVATE_KEY) {
  const { keyStores, KeyPair, connect, transactions, providers } = nearAPI;
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

  const account = await nearConnection.account(sender);
  const balance = await account.getAccountBalance();
  console.log(balance);

  //   const contract = new Contract(account, "inscription.near", {
  //     changeMethods: ["inscribe"],
  //   });

  const actions = [
    transactions.functionCall(
      "inscribe",
      {
        p: "nrc-20",
        op: "mint",
        tick: "neat",
        amt: "100000000",
      },
      "300000000000000",
      new BN(0)
    ),
  ];
  const provider = new providers.JsonRpcProvider(
    "https://rpc.mainnet.near.org"
  );
  // 其他必需的参数
  const signerId = sender; // 发送者账户ID
  const publicKey = keyPair.getPublicKey(); // 发送者公钥
  const accessKey = await provider.query(
    `access_key/${sender}/${publicKey.toString()}`,
    ""
  ); // 替换为适当的 nonce 值
  const recentBlockHash = nearAPI.utils.serialize.base_decode(
    accessKey.block_hash
  );
  const sendTransaction = async (nonce) => {
    try {
      console.log("sendTransaction nonce", nonce);
      const receiverId = "inscription.near"; // 接收者账户ID
      const transaction = nearAPI.transactions.createTransaction(
        sender,
        publicKey,
        receiverId,
        nonce++,
        actions,
        recentBlockHash
      );
      const serializedTx = nearAPI.utils.serialize.serialize(
        nearAPI.transactions.SCHEMA,
        transaction
      );
      const serializedTxHash = new Uint8Array(
        sha256.sha256.array(serializedTx)
      );
      const signature = keyPair.sign(serializedTxHash);
      const signedTransaction = new nearAPI.transactions.SignedTransaction({
        transaction,
        signature: new nearAPI.transactions.Signature({
          keyType: transaction.publicKey.keyType,
          data: signature.signature,
        }),
      });
      // encodes transaction to serialized Borsh (required for all transactions)
      const signedSerializedTx = signedTransaction.encode();
      // sends transaction to NEAR blockchain via JSON RPC call and records the result
      const result = await provider.sendJsonRpc("broadcast_tx_commit", [
        Buffer.from(signedSerializedTx).toString("base64"),
      ]);
      console.log("res", res);
    } catch (error) {
      console.error(sender, "error:", error.message || error);
    }
  };
  // 执行第一次发送交易
  const batchRes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; //, 4, 5, 6, 7, 8, 9, 10
  const runsend = async () => {
    const accessKey = await provider.query(
      `access_key/${sender}/${publicKey.toString()}`,
      ""
    ); // 替换为适当的 nonce 值
    const nonce = accessKey.nonce;
    console.log("nonce", nonce);
    for (let i = 0; i < batchRes.length; i++) {
      sendTransaction(nonce + batchRes[i]);
    }
    setTimeout(() => {
      runsend();
    }, 3000);
  };
  runsend();
}
// runner();
