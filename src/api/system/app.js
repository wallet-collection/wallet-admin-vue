import axios from "../../utils/axios";

//
export function appList(params) {
    return axios({
        url: "/admin/app/list",
        method: "get",
        params: params
    });
}

//
export function appSave(data, formName, method = "post") {
    let url =
        formName === "add"
            ? "/admin/app/add"
            : "/admin/app/update";
    return axios({
        url: url,
        method: method,
        data: data
    });
}

//
export function appDelete(data) {
    return axios({
        url: "/admin/app/delete",
        method: "post",
        data: data
    });
}

//
export function appSyncStatus(data) {
    return axios({
        url: "/admin/app/syncStatus",
        method: "post",
        data: data
    });
}