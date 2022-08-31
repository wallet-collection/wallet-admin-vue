
export const API_HOST = process.env.VUE_APP_API_HOST || window.location.protocol+"//"+window.location.host+"/api"

export const ERC20_FULL_HOST = process.env.VUE_APP_ERC20_FULL_HOST
export const TRC20_FULL_HOST = process.env.VUE_APP_TRC20_FULL_HOST
export const BEP20_FULL_HOST = process.env.VUE_APP_BEP20_FULL_HOST

export const ROUTER_WHITELIST = [
    "/401", "/404", "/500","/readme/main"
]
