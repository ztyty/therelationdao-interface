import config from "./config";
import { create } from "ipfs-http-client";

const client = create(config.ipfs.url);

export default {
  add(file) {
    return client.add(file);
  },
};
