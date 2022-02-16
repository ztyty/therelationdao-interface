const config = {
  contract: process.env.VUE_APP_CONTRACT,
  networkId: parseInt(process.env.VUE_APP_NETWORK_ID),
  ipfs: {
    url: process.env.VUE_APP_IPFS_URL,
  },
  graph: {
      url: process.env.VUE_APP_GRAPH_URL
  },
  provider: process.env.VUE_APP_PROVIDER
};

export default config;
