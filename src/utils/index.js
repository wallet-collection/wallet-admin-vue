
// account is not optional
import {web3Provider} from "./providers";
import {ethers} from "ethers";

export function getSigner(account) {
    const provider = web3Provider()
    return provider.getSigner(account).connectUnchecked()
}

export function isAddress(address) {
    return ethers.utils.isAddress(address)
}

export function toChecksumAddress(address) {
    return ethers.utils.getAddress(address)
}

export async function sendTransaction(from, to, value, nonce, chainId, gas, gasPrice, data) {
    let tx = {
        from: from,
        nonce: ethers.utils.hexlify(nonce),
        value: ethers.utils.hexlify(value),
        chain: ethers.utils.hexlify(chainId),
        gas: ethers.utils.hexlify(gas),
        gasPrice: ethers.utils.hexlify(gasPrice)
    }
    if (to) {
        tx.to = to
    }
    if (data) {
        tx.data = data
    }
    console.log(tx)

    const res = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx]
    })

    return res

}