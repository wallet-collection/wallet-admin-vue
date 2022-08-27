
import { Contract } from '@ethersproject/contracts'
import {simpleRpcProvider} from "./providers";
import {
    getUSDTAddress,
} from "./addressHelpers";

// ABI
import Erc20Abi from '../config/abi/erc20.json'
import {getSigner} from "./index";

export const getContract = (chainId, abi, address, signer) => {
    const signerOrProvider = signer ? getSigner() : simpleRpcProvider(chainId)
    return new Contract(address, abi, signerOrProvider)
}

export const getUSDTContract = (chainId, isSigner) => {
    return getContract(chainId, Erc20Abi, getUSDTAddress(chainId), isSigner)
}