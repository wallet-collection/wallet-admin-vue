import axios from "../../utils/axios";

//
export function authAdminList(params) {
    return axios({
        url: "/admin/list",
        method: "get",
        params: params
    });
}

//
export function authAdminSave(data, formName, method = "post") {
    let url =
        formName === "add"
            ? "/admin/add"
            : "/admin/update";
    return axios({
        url: url,
        method: method,
        data: data
    });
}

// 删除管理员
export function authAdminDelete(data) {
    return axios({
        url: "/admin/delete",
        method: "post",
        data: data
    });
}

export function authList(params) {
    return axios({
        url: "/admin/authList",
        method: "get",
        params: params
    });
}

export function auth(data) {
    return axios({
        url: "/admin/auth",
        method: "post",
        data: data
    });
}


// 获取授权信息
export function authRule(params) {
    return axios({
        url: "/admin/authRule",
        method: "get",
        params: params
    });
}