import { Interface } from '@ethersproject/abi'
import { getMulticallContract } from './contractHelpers'

export const multicall = async (abi, calls) => {
  const multi = getMulticallContract()
  const itf = new Interface(abi)
  const calldata = calls.map((call) => ({
    target: call.address.toLowerCase(),
    callData: itf.encodeFunctionData(call.name, call.params),
  }))
  try {
    const {returnData} = await multi.aggregate(calldata)
    return returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))
  }catch (e) {
    console.log("批量调用报错", e)
    return false
  }
}

function callData(abis, calls) {
  const itfs = abis.map((abi) => {
    return new Interface(abi)
  })
  const calldata = calls.map((call) => ({
    target: call.address.toLowerCase(),
    callData: itfs[call.abiIndex].encodeFunctionData(call.name, call.params),
  }))
  const callArr = calls.map((call) => {
    return itfs[call.abiIndex]
  })
  return {
    calldata,
    callArr
  }
}

export const multicallAll = async (abis, calls) => {
  const multi = getMulticallContract()
  const {calldata,callArr} = callData(abis, calls)
  try {
    const {returnData} = await multi.aggregate(calldata)
    return returnData.map((call, i) => callArr[i].decodeFunctionResult(calls[i].name, call))
  }catch (e) {
    console.log("批量调用报错", e)
    return false
  }
}

export const multicallAllv2 = async (abis, calls, requireSuccess = true) => {
  const multi = getMulticallContract()
  const {calldata,callArr} = callData(abis, calls)
  try {
    const returnData = await multi.tryAggregate(requireSuccess,calldata)
    const res = returnData.map((call, i) => {
      const [result, data] = call
      return result ? callArr[i].decodeFunctionResult(calls[i].name, data) : null
    })
    return res
  }catch (e) {
    console.log("批量调用报错", e)
    return false
  }
}

/**
 * Multicall V2 uses the new "tryAggregate" function. It is different in 2 ways
 *
 * 1. If "requireSuccess" is false multicall will not bail out if one of the calls fails
 * 2. The return includes a boolean whether the call was successful e.g. [wasSuccessful, callResult]
 */
export const multicallv2 = async (abi, calls, requireSuccess = true) => {
  const multi = getMulticallContract()
  const itf = new Interface(abi)

  const calldata = calls.map((call) => ({
    target: call.address.toLowerCase(),
    callData: itf.encodeFunctionData(call.name, call.params),
  }))

  const returnData = await multi.tryAggregate(requireSuccess, calldata)
  const res = returnData.map((call, i) => {
    const [result, data] = call
    return result ? itf.decodeFunctionResult(calls[i].name, data) : null
  })

  return res
}
