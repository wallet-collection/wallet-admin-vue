import { ethers } from 'ethers'

// ABI
import FabricWalletAbi from '../config/abi/FabricWallet.json'
import {simpleRpcProvider} from "./providers";

export const getFabricWalletContract = (rpc, privateKey, address) => {
    let provider = simpleRpcProvider();
    let walletWithProvider = new ethers.Wallet(privateKey, provider);

    return new ethers.Contract(address, FabricWalletAbi, walletWithProvider)
}

export const getTrxFabricWalletContract = async (rpc, privateKey, address) => {

    const TronWeb = require('tronweb');
    let fullNode = rpc;
    let solidityNode = '';
    let eventServer = '';
    let sideOptions = {
        fullNode: '',
        solidityNode: '',
        eventServer: '',
        mainGatewayAddress: '',
        sideGatewayAddress: '',
        sideChainId: ''
    }
    console.log(privateKey, rpc)
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, sideOptions, privateKey);

    return await tronWeb.contract().at(address)

}