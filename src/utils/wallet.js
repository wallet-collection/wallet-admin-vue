import {BASE_SCAN_URLS} from '../config'
import getNodeUrl from "./getRpcUrl";

const NETWORK_CONFIG = {
  [1]: {
    name: '以太坊 Ethereum 主网络',
    scanURL: BASE_SCAN_URLS[1],
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    }
  },
  [56]: {
    name: 'BNB Smart Chain Mainnet',
    scanURL: BASE_SCAN_URLS[56],
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    }
  },
  [66]: {
    name: 'OKXChain Mainnet',
    scanURL: BASE_SCAN_URLS[56],
    nativeCurrency: {
      name: 'OKT',
      symbol: 'OKT',
      decimals: 18,
    }
  },
  [97]: {
    name: 'BNB Smart Chain Testnet',
    scanURL: BASE_SCAN_URLS[97],
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    }
  },
  [31337]: {
    name: 'BNB Smart Chain Fork',
    scanURL: BASE_SCAN_URLS[31337],
    nativeCurrency: {
      name: 'Go',
      symbol: 'Go',
      decimals: 18,
    }
  },
}

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async () => {
  const provider = window.ethereum
  const chainId = parseInt(process.env.VUE_APP_CHAIN_ID, 10)
  if (!NETWORK_CONFIG[chainId]) {
    console.error('Invalid chain id')
    return false
  }
  if (provider) {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
      return true
    } catch (switchError) {
      try {
        const RPC_URL = getNodeUrl()
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
              chainName: NETWORK_CONFIG[chainId].name,
              nativeCurrency: {
                name: NETWORK_CONFIG[chainId].nativeCurrency.name,
                symbol: NETWORK_CONFIG[chainId].nativeCurrency.symbol,
                decimals: NETWORK_CONFIG[chainId].nativeCurrency.decimals,
              },
              rpcUrls: [RPC_URL],
              blockExplorerUrls: [`${NETWORK_CONFIG[chainId].scanURL}/`],
            },
          ],
        })
        return true
      } catch (error) {
        console.error('Failed to setup the network in Metamask:', error)
        return false
      }
    }
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
    return false
  }
}

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const getAccounts = async (chainId) => {
  if (!window.ethereum) {
    return false
  }
  const provider = window.ethereum
  if (!NETWORK_CONFIG[chainId]) {
    console.error('Invalid chain id')
    return false
  }
  try {
    return await provider.request({
      method: 'eth_requestAccounts',
    })
  } catch (error) {
    if (error.code === 4001) {
      // User rejected request
    }
  }
  return false
}
