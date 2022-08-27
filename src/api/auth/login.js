
import axios from "../../utils/axios";

export function password(data) {
    return axios({
        url: "/admin/setLoginPassword",
        method: "post",
        data: data
    });
}

// 登录
export function Login(data) {
    return axios({
        url: "/admin/login",
        method: "post",
        data: data
    });
}

// 获取谷歌授权码
export function GoogleAuthQrcode(params) {
    return axios({
        url: "/admin/googleAuthQrcode",
        method: "get",
        params: params
    });
}

// 设置谷歌授权码
export function SetGoogleAuthQrcode(data) {
    return axios({
        url: "/admin/setGoogleAuthQrcode",
        method: "post",
        data: data
    });
}