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