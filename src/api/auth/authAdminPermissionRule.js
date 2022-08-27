import axios from "../../utils/axios";

//
export function authAdminPermissionRuleList(params) {
    return axios({
        url: "/admin/permissionRule/list",
        method: "get",
        params: params
    });
}

//
export function authAdminPermissionRuleSave(data, formName, method = "post") {
    let url =
        formName === "add"
            ? "/admin/permissionRule/add"
            : "/admin/permissionRule/update";
    return axios({
        url: url,
        method: method,
        data: data
    });
}

// 删除管理员
export function authAdminPermissionRuleDelete(data) {
    return axios({
        url: "/admin/permissionRule/delete",
        method: "post",
        data: data
    });
}