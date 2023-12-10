# core_cors_script
##### step 0
https://nodejs.cn/download/ or https://nodejs.org/en
Download, install, and execute the command; if the correct version is displayed, the installation is successful.
node -v
npm -v

##### step 1
npm install web3

##### step 2
node cors.js

----------------------------------------------

##### 第一步是安装 nodejs 环境，如果有那就跳过
https://nodejs.cn/download/ or https://nodejs.org/en
选择稳定版 最好是 16 的版本 和我一致，如果不一致报错 Web3 替换 const Web3 = require("web3"); 成 const { Web3 } = require("web3");

##### 第二步 就是安装 web3 包
npm install web3

##### 第三步 就是配置你要打铭文的 钱包和对应的私钥，还有代码默认配置的 rpc 节点是公开节点
注意要改的地方是：
rpc 节点 改成你自己找的 目前是公共的 core链一个瘫痪 一个半瘫痪
要配置你的accounts 地址和私钥
还有就是速率 在82行 你一次性要发多少笔交易 目前rpc拉垮太多会被拒绝
如果慢你可以87行 加 gas 目前是2倍gas 是 60 GWEi

##### 第四步 
就是在这个目录页面 打开控制台 输入 node cors.js
来运行脚本
