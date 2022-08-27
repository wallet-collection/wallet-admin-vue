import addresses from '../config/constants/contracts'

export const getAddress = (chainId, address) => {
  return address[chainId]
}

export const getUSDTAddress = (chainId) => {
  return getAddress(chainId, addresses.USDT)
}