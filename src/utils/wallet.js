
/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const getAccounts = async () => {
  if (!window.ethereum) {
    return false
  }
  const provider = window.ethereum
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
