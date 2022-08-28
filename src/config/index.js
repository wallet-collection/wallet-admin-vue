export const BASE_RPC_URLS = {
    1: 'https://mainnet.infura.io/v3/adee4ead47844d238802431fcb7683c6',
    56: 'https://bscrpc.com',
    66: 'https://exchainrpc.okex.org',
}

export const BASE_SCAN_URLS = {
    1: 'https://etherscan.io',
    56: 'https://bscscan.com',
    66: 'https://www.oklink.com/en/okc',
}

export const API_HOST = process.env.VUE_APP_API_HOST || window.location.protocol+"//"+window.location.host+"/api"


export const ROUTER_WHITELIST = [
    "/401", "/404", "/500","/readme/main"
]

export const LANGUAGE_LIST = [
    {
        code: "en",
        name: "English"
    },
    {
        code: "zh-Hans",
        name: "中文简体"
    },
    {
        code: "zh-Hant",
        name: "中文繁体"
    },
]