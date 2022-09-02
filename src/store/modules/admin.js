import {delToken, getMemberInit, delMemberInit, setMemberInit} from "../../utils/userAuth";
import {authRule} from "../../api/auth/authAdmin"
const member = getMemberInit();

const state = {
    adminInfo: {
        adminId: member.adminId ? parseInt(member.adminId) : 0,
        username: member.username || "",
    },
    authRules: [],
    routers: [],
};

// getters
const getters = {
    adminInfo: state => state.adminInfo,
    authRules: state => state.authRules,
    routers: state => state.routers,
};

// actions
const actions = {
    logout({commit}) {
        let info = {
            adminId: 0,
            username: "",
        };
        commit("ADMIN_INFO", info);
        commit("ADMIN_CLEAR_LOGIN");
    },
    getAuthRule({commit}) {
        return new Promise((resolve, reject) => {
            authRule()
                .then(res => {
                    if (res.code > 0) {
                        reject()
                        return false
                    }
                    const data = res.data || ["-1"];
                    commit("ADMIN_RULE", data);
                    resolve(data);
                })
                .catch(error => {
                    reject(error)
                });
        })
    },
    setRouters({commit}, routers) {
        commit("ROUTERS", routers);
    }
};

// mutations
const mutations = {
    //清空信息
    ["ADMIN_CLEAR_LOGIN"](state) {
        delToken();
        delMemberInit();
    },
    //设置用户信息
    ["ADMIN_INFO"](state, memberInfo) {
        state.memberInfo = memberInfo;
        setMemberInit(memberInfo);
    },
    //
    ["ADMIN_RULE"](state, rule) {
        state.authRules = rule;
    },
    //
    ["ROUTERS"](state, routers) {
        state.routers = JSON.parse(JSON.stringify(routers));
    },
};
export default {
    state,
    getters,
    actions,
    mutations
};
