const config = {
  contract: process.env.VUE_APP_CONTRACT,
  networkId: parseInt(process.env.VUE_APP_NETWORK_ID),
  ipfs: {
    url: process.env.VUE_APP_IPFS_URL,
  },
};

export default config;
