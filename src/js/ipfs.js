import config from "./config";
import axios from "axios";
import { create } from "ipfs-http-client";

const ipfs = create(config.ipfs.url);

const instance = axios.create({
  baseURL: config.ipfs.url,
});

export default {
  async add(file) {
    return ipfs.add(file);
  },
  cat(hash) {
    return instance.get("/api/v0/cat?arg=" + hash);
  },
};
