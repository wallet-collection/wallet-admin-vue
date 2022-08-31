
import { Contract } from '@ethersproject/contracts'

// ABI
import FabricWalletAbi from '../config/abi/FabricWallet.json'
import {getSigner} from "./index";

export const getContract = (abi, address) => {
    const signerOrProvider = getSigner()
    return new Contract(address, abi, signerOrProvider)
}

export const getFabricWalletContract = (address) => {
    return getContract(FabricWalletAbi, address)
}