require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    sepolia: {
      url:"https://eth-sepolia.g.alchemy.com/v2/DdKQ701-Ws8LxyErZIux1vDqPGmKidpV", //SepoliaTestnet Alchemy API 
      accounts:["c51cc668c425493722326ca907fa266e50b6a81818b3e84b4aa771b2e57980ee"] //Blockchain class Private Metamask Key
    }
},
  solidity: "0.8.4",
};
