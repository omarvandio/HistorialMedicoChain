require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { ALCHEMY_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.28",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    scrollSepolia: {
      url: ALCHEMY_URL,
      accounts: [PRIVATE_KEY],
      chainId: 534352,
    },
  },
};