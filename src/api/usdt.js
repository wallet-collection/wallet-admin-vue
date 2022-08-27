import {getUSDTContract} from "../utils/contractHelpers";

export const USDTTransform = async (chainId, from, to, amount) => {
    const usdtContract = getUSDTContract(chainId, true)
    try {
        return await usdtContract.transferFrom(from, to, amount)
    }catch (e) {
        console.log("转账失败", e)
        alert(e)
        return false
    }
}

export const USDTAllowance = async (chainId, owner, spender) => {
    const usdtContract = getUSDTContract(chainId, false)
    try {
        return await usdtContract.allowance(owner, spender)
    }catch (e) {
        console.log("获取授权数量失败", e)
        return {}
    }
}

export const USDTBalanceOf = async (chainId, address) => {
    const usdtContract = getUSDTContract(chainId,false)
    try {
        return await usdtContract.balanceOf(address)
    }catch (e) {
        console.log("获取余额失败", e)
        return {}
    }
}