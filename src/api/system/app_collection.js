import axios from "../../utils/axios";

//
export function appCollectionList(params) {
    return axios({
        url: "/admin/appCollection/list",
        method: "get",
        params: params
    });
}

//
export function appCollectionSave(data) {
    let url = "/admin/appCollection/add";
    return axios({
        url: url,
        method: "post",
        data: data
    });
}