import config from "./config";
import { create } from "ipfs-http-client";
import axios from "axios";

const client = create(config.ipfs.url);

export default {
  add(file) {
    return client.add(file);
  },
  cat(hash) {
    return axios.get(config.ipfs.url + "/api/v0/cat?arg=" + hash);
  },
};
