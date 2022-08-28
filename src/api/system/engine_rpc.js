import axios from "../../utils/axios";

//
export function engineRpcList(params) {
    return axios({
        url: "/admin/engineRpc/list",
        method: "get",
        params: params
    });
}

//
export function engineRpcSave(data, formName, method = "post") {
    let url =
        formName === "add"
            ? "/admin/engineRpc/add"
            : "/admin/engineRpc/update";
    return axios({
        url: url,
        method: method,
        data: data
    });
}

//
export function engineRpcDelete(data) {
    return axios({
        url: "/admin/engineRpc/delete",
        method: "post",
        data: data
    });
}