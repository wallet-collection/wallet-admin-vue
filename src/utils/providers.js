import { StaticJsonRpcProvider, Web3Provider } from '@ethersproject/providers'

export function simpleRpcProvider(url) {
    return new StaticJsonRpcProvider(url)
}

export const web3Provider = () => {
    return new Web3Provider(window.ethereum)
}

export default null
