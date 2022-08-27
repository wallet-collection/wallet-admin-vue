import axios from "../../utils/axios";


// 获取今日统计数据
export function statisticsToday(params) {
    return axios({
        url: "admin/statistics/today",
        method: "get",
        params: params
    });
}

// 获取统计列表
export function statisticsList(params) {
    return axios({
        url: "admin/statistics/list",
        method: "get",
        params: params
    });
}