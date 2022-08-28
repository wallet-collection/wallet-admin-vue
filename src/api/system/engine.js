import axios from "../../utils/axios";

//
export function engineList(params) {
    return axios({
        url: "/admin/engine/list",
        method: "get",
        params: params
    });
}

//
export function engineSave(data, formName, method = "post") {
    let url =
        formName === "add"
            ? "/admin/engine/add"
            : "/admin/engine/update";
    return axios({
        url: url,
        method: method,
        data: data
    });
}

//
export function engineDelete(data) {
    return axios({
        url: "/admin/engine/delete",
        method: "post",
        data: data
    });
}

//
export function engineSyncStatus(data) {
    return axios({
        url: "/admin/engine/syncStatus",
        method: "post",
        data: data
    });
}