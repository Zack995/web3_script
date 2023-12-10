# avax_asct_script
##### step 0
https://nodejs.cn/download/ or https://nodejs.org/en
Download, install, and execute the command; if the correct version is displayed, the installation is successful.
node -v
npm -v

##### step 1
npm install web3

##### step 2
node asct.js

----------------------------------------------

##### 第一步是安装 nodejs 环境，如果有那就跳过
https://nodejs.cn/download/ or https://nodejs.org/en

##### 第二步 就是安装 web3 包
npm install web3

##### 第三步 就是配置你要打铭文的 钱包和对应的私钥，还有代码默认配置的 rpc 节点是公开节点
注意要改的地方是：
rpc 节点 改成你自己找的 目前是公共的
要配置你的accounts 地址和私钥还有toAddress【打给谁】
还有就是速率 在91行 你一次性要发多少笔交易
如果慢你可以51行 加 gas 目前是100倍gas 是 10 GWEi

##### 第四步 
就是在这个目录页面 打开控制台 输入 node okt.js
来运行脚本
