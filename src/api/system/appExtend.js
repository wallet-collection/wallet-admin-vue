import axios from "../../utils/axios";

//
export function appExtendList(params) {
    return axios({
        url: "/admin/appExtend/list",
        method: "get",
        params: params
    });
}

//
export function appExtendSave(data, formName) {
    let url =
        formName === "add"
            ? "/admin/appExtend/add"
            : "/admin/appExtend/update";
    return axios({
        url: url,
        method: "post",
        data: data
    });
}