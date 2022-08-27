import {BASE_RPC_URLS} from "../config";

const getNodeUrl = (chainId) => {
  return BASE_RPC_URLS[chainId]
}

export default getNodeUrl
