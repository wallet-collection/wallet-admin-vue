import axios from "../../utils/axios";

//
export function addressList(params) {
    return axios({
        url: "/admin/address/list",
        method: "get",
        params: params
    });
}
//
export function addressCollection(data) {
    return axios({
        url: "/admin/address/collection",
        method: "post",
        data: data
    });
}