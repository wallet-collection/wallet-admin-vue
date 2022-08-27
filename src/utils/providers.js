import { StaticJsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import getNodeUrl from "./getRpcUrl";

export function simpleRpcProvider(chainId) {
    return new StaticJsonRpcProvider(getNodeUrl(chainId))
}

export const web3Provider = () => {
    return new Web3Provider(window.ethereum)
}

export default null
